<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonInput();
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    jsonResponse(['error' => 'Username and password are required'], 400);
}

$db = getDB();

$stmt = $db->prepare("SELECT * FROM users WHERE username = ? AND active = 1");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['error' => 'Invalid username or account is disabled'], 401);
}

if (!password_verify($password, $user['password_hash'])) {
    jsonResponse(['error' => 'Invalid password'], 401);
}

// Return user data without password
unset($user['password_hash']);

jsonResponse([
    'success' => true,
    'user' => $user
]);
