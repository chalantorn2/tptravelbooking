<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonInput();
$userId = $data['user_id'] ?? null;

if (!$userId) {
    jsonResponse(['error' => 'User ID is required'], 400);
}

$db = getDB();

$stmt = $db->prepare("SELECT id, username, fullname, role, active FROM users WHERE id = ? AND active = 1");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['error' => 'User not found or inactive'], 404);
}

jsonResponse([
    'success' => true,
    'user' => $user
]);
