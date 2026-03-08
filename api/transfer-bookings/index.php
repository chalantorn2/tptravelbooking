<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        $date = $_GET['date'] ?? null;
        $bookingId = $_GET['booking_id'] ?? null;
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;

        if ($date) {
            $stmt = $db->prepare("
                SELECT tb.*, b.first_name, b.last_name, b.agent_name, b.agent_id, b.reference_id as booking_reference_id, b.pax_adt as booking_pax_adt, b.pax_chd as booking_pax_chd, b.pax_inf as booking_pax_inf
                FROM transfer_bookings tb
                LEFT JOIN bookings b ON tb.booking_id = b.id
                WHERE tb.transfer_date = ?
                ORDER BY tb.transfer_time ASC
            ");
            $stmt->execute([$date]);
            jsonResponse($stmt->fetchAll());
        } elseif ($bookingId) {
            $stmt = $db->prepare("SELECT * FROM transfer_bookings WHERE booking_id = ?");
            $stmt->execute([$bookingId]);
            jsonResponse($stmt->fetchAll());
        } elseif ($startDate && $endDate) {
            $stmt = $db->prepare("SELECT DISTINCT transfer_date FROM transfer_bookings WHERE transfer_date >= ? AND transfer_date <= ?");
            $stmt->execute([$startDate, $endDate]);
            jsonResponse($stmt->fetchAll());
        } else {
            jsonResponse(['error' => 'date, booking_id, or date range is required'], 400);
        }
        break;

    case 'POST':
        $data = getJsonInput();

        $stmt = $db->prepare("INSERT INTO transfer_bookings (booking_id, reference_id, transfer_date, transfer_time, transfer_type, transfer_detail, pickup_location, drop_location, transfer_flight, transfer_ftime, province, send_to, car_model, phone_number, status, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['booking_id'] ?? null,
            $data['reference_id'] ?? null,
            $data['transfer_date'],
            $data['transfer_time'] ?? null,
            $data['transfer_type'] ?? null,
            $data['transfer_detail'] ?? null,
            $data['pickup_location'] ?? null,
            $data['drop_location'] ?? null,
            $data['transfer_flight'] ?? null,
            $data['transfer_ftime'] ?? null,
            $data['province'] ?? null,
            $data['send_to'] ?? null,
            $data['car_model'] ?? null,
            $data['phone_number'] ?? null,
            $data['status'] ?? 'pending',
            $data['note'] ?? null,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM transfer_bookings WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch(), 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = $data['id'] ?? $_GET['id'] ?? null;

        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $fields = [];
        $params = [];
        $allowedFields = ['booking_id', 'reference_id', 'transfer_date', 'transfer_time', 'transfer_type', 'transfer_detail', 'pickup_location', 'drop_location', 'transfer_flight', 'transfer_ftime', 'province', 'send_to', 'car_model', 'phone_number', 'payment_status', 'payment_date', 'payment_note', 'status', 'note'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $stmt = $db->prepare("UPDATE transfer_bookings SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("DELETE FROM transfer_bookings WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
