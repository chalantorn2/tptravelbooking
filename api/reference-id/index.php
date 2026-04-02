<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$type = $_GET['type'] ?? null; // booking, tour, transfer

if (!$type || !in_array($type, ['booking', 'tour', 'transfer'])) {
    jsonResponse(['error' => 'type must be booking, tour, or transfer'], 400);
}

$year = date('Y');

if ($type === 'booking') {
    $agentName = $_GET['agent_name'] ?? 'TP';
    $prefix = strtoupper(substr(preg_replace('/\s+/', '', $agentName), 0, 3));
    if (empty($prefix)) $prefix = 'TP';

    // Get max sequence number for this year across all agents
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
    jsonResponse(['reference_id' => $referenceId]);

} elseif ($type === 'tour') {
    $stmt = $db->prepare("
        SELECT reference_id FROM tour_bookings
        WHERE reference_id LIKE ?
        ORDER BY CAST(SUBSTRING_INDEX(reference_id, '-', -1) AS UNSIGNED) DESC
        LIMIT 1
    ");
    $stmt->execute(["T-{$year}-%"]);
    $last = $stmt->fetch();

    $nextSeq = 1;
    if ($last) {
        $parts = explode('-', $last['reference_id']);
        $lastSeq = intval(end($parts));
        $nextSeq = $lastSeq + 1;
    }

    $referenceId = 'T-' . $year . '-' . str_pad($nextSeq, 3, '0', STR_PAD_LEFT);
    jsonResponse(['reference_id' => $referenceId]);

} elseif ($type === 'transfer') {
    $stmt = $db->prepare("
        SELECT reference_id FROM transfer_bookings
        WHERE reference_id LIKE ?
        ORDER BY CAST(SUBSTRING_INDEX(reference_id, '-', -1) AS UNSIGNED) DESC
        LIMIT 1
    ");
    $stmt->execute(["TR-{$year}-%"]);
    $last = $stmt->fetch();

    $nextSeq = 1;
    if ($last) {
        $parts = explode('-', $last['reference_id']);
        $lastSeq = intval(end($parts));
        $nextSeq = $lastSeq + 1;
    }

    $referenceId = 'TR-' . $year . '-' . str_pad($nextSeq, 3, '0', STR_PAD_LEFT);
    jsonResponse(['reference_id' => $referenceId]);
}
