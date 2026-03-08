<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        $stmt = $db->prepare("SELECT id, username, fullname, role, active, created_at, updated_at FROM users WHERE active = 1 ORDER BY created_at DESC");
        $stmt->execute();

        jsonResponse($stmt->fetchAll());
        break;

    case 'POST':
        $data = getJsonInput();

        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $fullname = $data['fullname'] ?? '';
        $role = $data['role'] ?? 'user';

        if (empty($username) || empty($password)) {
            jsonResponse(['error' => 'Username and password are required'], 400);
        }

        // Check duplicate username
        $check = $db->prepare("SELECT id FROM users WHERE username = ?");
        $check->execute([$username]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Username already exists'], 409);
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $db->prepare("INSERT INTO users (username, password_hash, fullname, role, active) VALUES (?, ?, ?, ?, 1)");
        $stmt->execute([$username, $passwordHash, $fullname, $role]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT id, username, fullname, role, active, created_at, updated_at FROM users WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse($stmt->fetch(), 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = $data['id'] ?? null;

        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $fields = [];
        $params = [];

        if (isset($data['username'])) {
            // Check duplicate username (exclude self)
            $check = $db->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
            $check->execute([$data['username'], $id]);
            if ($check->fetch()) {
                jsonResponse(['error' => 'Username already exists'], 409);
            }
            $fields[] = "username = ?";
            $params[] = $data['username'];
        }

        if (isset($data['fullname'])) {
            $fields[] = "fullname = ?";
            $params[] = $data['fullname'];
        }

        if (isset($data['role'])) {
            $fields[] = "role = ?";
            $params[] = $data['role'];
        }

        if (!empty($data['password'])) {
            $fields[] = "password_hash = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $stmt = $db->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        // Soft delete
        $stmt = $db->prepare("UPDATE users SET active = 0 WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
