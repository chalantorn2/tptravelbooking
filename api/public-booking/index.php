<?php
require_once __DIR__ . '/../config/database.php';

// ---- API Key Check ----
$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
$validKeys = [
    'sayhitransfer' => 'SHT-2026-xK9mPqR7vL3nBwYz',
];

if (!in_array($apiKey, $validKeys)) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

// ---- POST only ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonInput();

// ---- Validate ----
$errors = [];
if (empty($data['first_name'])) $errors[] = 'first_name is required';
if (empty($data['last_name']))  $errors[] = 'last_name is required';
if (empty($data['agent_name'])) $errors[] = 'agent_name is required';
if (empty($data['tours']) && empty($data['transfers'])) {
    $errors[] = 'At least one tour or transfer is required';
}

if (!empty($data['tours'])) {
    foreach ($data['tours'] as $i => $tour) {
        if (empty($tour['tour_date'])) {
            $errors[] = "tours[$i].tour_date is required";
        }
    }
}

if (!empty($data['transfers'])) {
    foreach ($data['transfers'] as $i => $transfer) {
        if (empty($transfer['transfer_date'])) {
            $errors[] = "transfers[$i].transfer_date is required";
        }
    }
}

if (!empty($errors)) {
    jsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
}

$db = getDB();

try {
    $db->beginTransaction();

    // ---- Generate Booking Reference ID ----
    $agentName = $data['agent_name'];
    $prefix = strtoupper(substr(preg_replace('/\s+/', '', $agentName), 0, 3));
    if (empty($prefix)) $prefix = 'TP';
    $year = date('Y');

    $stmt = $db->prepare("
        SELECT reference_id FROM bookings
        WHERE reference_id LIKE ?
        ORDER BY CAST(SUBSTRING_INDEX(reference_id, '-', -1) AS UNSIGNED) DESC
        LIMIT 1
    ");
    $stmt->execute(["%-{$year}-%"]);
    $last = $stmt->fetch();

    $nextSeq = 1;
    if ($last) {
        $parts = explode('-', $last['reference_id']);
        $lastSeq = intval(end($parts));
        $nextSeq = $lastSeq + 1;
    }

    $referenceId = $prefix . '-' . $year . '-' . str_pad($nextSeq, 3, '0', STR_PAD_LEFT);

    // ---- Insert Booking ----
    $paxAdt = intval($data['pax_adt'] ?? 0);
    $paxChd = intval($data['pax_chd'] ?? 0);
    $paxInf = intval($data['pax_inf'] ?? 0);

    $paxParts = [];
    if ($paxAdt > 0) $paxParts[] = "{$paxAdt}A";
    if ($paxChd > 0) $paxParts[] = "{$paxChd}C";
    if ($paxInf > 0) $paxParts[] = "{$paxInf}I";
    $pax = implode('', $paxParts) ?: null;

    $stmt = $db->prepare("INSERT INTO bookings (reference_id, first_name, last_name, agent_name, pax, pax_adt, pax_chd, pax_inf, start_date, end_date, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $referenceId,
        $data['first_name'],
        $data['last_name'],
        $agentName,
        $pax,
        $paxAdt,
        $paxChd,
        $paxInf,
        $data['start_date'] ?? null,
        $data['end_date'] ?? null,
        $data['note'] ?? null,
    ]);
    $bookingId = $db->lastInsertId();

    // ---- Insert Tour Bookings ----
    if (!empty($data['tours'])) {
        foreach ($data['tours'] as $tour) {
            // Generate tour reference ID
            $stmtRef = $db->prepare("
                SELECT reference_id FROM tour_bookings
                WHERE reference_id LIKE ?
                ORDER BY CAST(SUBSTRING_INDEX(reference_id, '-', -1) AS UNSIGNED) DESC
                LIMIT 1
            ");
            $stmtRef->execute(["T-{$year}-%"]);
            $lastTour = $stmtRef->fetch();

            $tourSeq = 1;
            if ($lastTour) {
                $parts = explode('-', $lastTour['reference_id']);
                $tourSeq = intval(end($parts)) + 1;
            }
            $tourRef = 'T-' . $year . '-' . str_pad($tourSeq, 3, '0', STR_PAD_LEFT);

            $stmtTour = $db->prepare("INSERT INTO tour_bookings (booking_id, reference_id, tour_date, tour_pickup_time, tour_type, tour_detail, tour_hotel, tour_room_no, tour_contact_no, province, status, note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)");
            $stmtTour->execute([
                $bookingId,
                $tourRef,
                $tour['tour_date'],
                $tour['pickup_time'] ?? null,
                $tour['tour_type'] ?? null,
                $tour['detail'] ?? null,
                $tour['hotel'] ?? null,
                $tour['room_no'] ?? null,
                $tour['contact_no'] ?? null,
                $tour['province'] ?? null,
                $tour['note'] ?? null,
            ]);
        }
    }

    // ---- Insert Transfer Bookings ----
    if (!empty($data['transfers'])) {
        foreach ($data['transfers'] as $transfer) {
            // Generate transfer reference ID
            $stmtRef = $db->prepare("
                SELECT reference_id FROM transfer_bookings
                WHERE reference_id LIKE ?
                ORDER BY CAST(SUBSTRING_INDEX(reference_id, '-', -1) AS UNSIGNED) DESC
                LIMIT 1
            ");
            $stmtRef->execute(["TR-{$year}-%"]);
            $lastTransfer = $stmtRef->fetch();

            $transferSeq = 1;
            if ($lastTransfer) {
                $parts = explode('-', $lastTransfer['reference_id']);
                $transferSeq = intval(end($parts)) + 1;
            }
            $transferRef = 'TR-' . $year . '-' . str_pad($transferSeq, 3, '0', STR_PAD_LEFT);

            $stmtTransfer = $db->prepare("INSERT INTO transfer_bookings (booking_id, reference_id, transfer_date, transfer_time, transfer_type, transfer_detail, pickup_location, drop_location, transfer_flight, transfer_ftime, province, phone_number, status, note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)");
            $stmtTransfer->execute([
                $bookingId,
                $transferRef,
                $transfer['transfer_date'],
                $transfer['pickup_time'] ?? null,
                $transfer['transfer_type'] ?? null,
                $transfer['detail'] ?? null,
                $transfer['pickup_location'] ?? null,
                $transfer['drop_location'] ?? null,
                $transfer['flight'] ?? null,
                $transfer['flight_time'] ?? null,
                $transfer['province'] ?? null,
                $transfer['phone_number'] ?? null,
                $transfer['note'] ?? null,
            ]);
        }
    }

    $db->commit();

    jsonResponse([
        'success' => true,
        'reference_id' => $referenceId,
        'booking_id' => $bookingId,
        'message' => 'Booking created successfully'
    ], 201);

} catch (Exception $e) {
    $db->rollBack();
    jsonResponse(['error' => 'Failed to create booking: ' . $e->getMessage()], 500);
}
