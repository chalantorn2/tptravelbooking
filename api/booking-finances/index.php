<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        $bookingType = $_GET['booking_type'] ?? null;
        $bookingItemId = $_GET['booking_item_id'] ?? null;

        if ($bookingType && $bookingItemId) {
            $stmt = $db->prepare("SELECT * FROM booking_finances WHERE booking_type = ? AND booking_item_id = ? ORDER BY id ASC");
            $stmt->execute([$bookingType, $bookingItemId]);
            jsonResponse($stmt->fetchAll());
        } else {
            jsonResponse(['error' => 'booking_type and booking_item_id are required'], 400);
        }
        break;

    case 'POST':
        $data = getJsonInput();

        if (empty($data['booking_type']) || empty($data['booking_item_id'])) {
            jsonResponse(['error' => 'booking_type and booking_item_id are required'], 400);
        }

        $stmt = $db->prepare("INSERT INTO booking_finances (booking_type, booking_item_id, cost, sell, type, remark) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['booking_type'],
            $data['booking_item_id'],
            $data['cost'] ?? 0,
            $data['sell'] ?? 0,
            $data['type'] ?? 'all',
            $data['remark'] ?? null,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM booking_finances WHERE id = ?");
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
        $allowedFields = ['cost', 'sell', 'type', 'remark'];

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
        $stmt = $db->prepare("UPDATE booking_finances SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("DELETE FROM booking_finances WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
