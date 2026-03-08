<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        $category = $_GET['category'] ?? null;

        if ($category) {
            $stmt = $db->prepare("SELECT * FROM information WHERE category = ? AND active = 1 ORDER BY value ASC");
            $stmt->execute([$category]);
        } else {
            $stmt = $db->prepare("SELECT * FROM information WHERE active = 1 ORDER BY category, value ASC");
            $stmt->execute();
        }

        jsonResponse($stmt->fetchAll());
        break;

    case 'POST':
        $data = getJsonInput();

        $stmt = $db->prepare("INSERT INTO information (category, value, description, phone, active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['category'],
            $data['value'],
            $data['description'] ?? null,
            $data['phone'] ?? null,
            $data['active'] ?? 1,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM information WHERE id = ?");
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
        $allowedFields = ['category', 'value', 'description', 'phone', 'active'];

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
        $stmt = $db->prepare("UPDATE information SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        // Soft delete
        $stmt = $db->prepare("UPDATE information SET active = 0 WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
