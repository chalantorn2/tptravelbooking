<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;

        if ($id) {
            // Get single booking with tour_bookings and transfer_bookings
            $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
            $stmt->execute([$id]);
            $booking = $stmt->fetch();

            if (!$booking) {
                jsonResponse(['error' => 'Booking not found'], 404);
            }

            $stmt = $db->prepare("SELECT * FROM tour_bookings WHERE booking_id = ?");
            $stmt->execute([$id]);
            $booking['tour_bookings'] = $stmt->fetchAll();

            $stmt = $db->prepare("SELECT * FROM transfer_bookings WHERE booking_id = ?");
            $stmt->execute([$id]);
            $booking['transfer_bookings'] = $stmt->fetchAll();

            jsonResponse($booking);
        } else {
            // Get all bookings with counts
            $startDate = $_GET['start_date'] ?? null;
            $endDate = $_GET['end_date'] ?? null;
            $search = $_GET['search'] ?? null;

            $query = "SELECT b.*,
                (SELECT COUNT(*) FROM tour_bookings tb WHERE tb.booking_id = b.id) as tour_count,
                (SELECT COUNT(*) FROM transfer_bookings trb WHERE trb.booking_id = b.id) as transfer_count
                FROM bookings b";
            $params = [];
            $conditions = [];

            if ($startDate && $endDate) {
                $conditions[] = "b.created_at >= ? AND b.created_at <= ?";
                $params[] = $startDate . ' 00:00:00';
                $params[] = $endDate . ' 23:59:59';
            }

            if ($search) {
                $conditions[] = "(b.reference_id LIKE ? OR b.first_name LIKE ? OR b.last_name LIKE ? OR b.agent_name LIKE ?)";
                $searchTerm = "%$search%";
                $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
            }

            if (!empty($conditions)) {
                $query .= " WHERE " . implode(" AND ", $conditions);
            }

            $query .= " ORDER BY b.created_at DESC";

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $bookings = $stmt->fetchAll();

            jsonResponse(['bookings' => $bookings]);
        }
        break;

    case 'POST':
        $data = getJsonInput();

        $stmt = $db->prepare("INSERT INTO bookings (reference_id, first_name, last_name, agent_name, agent_id, pax, pax_adt, pax_chd, pax_inf, start_date, end_date, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['reference_id'] ?? null,
            $data['first_name'] ?? null,
            $data['last_name'] ?? null,
            $data['agent_name'] ?? null,
            $data['agent_id'] ?? null,
            $data['pax'] ?? null,
            $data['pax_adt'] ?? 0,
            $data['pax_chd'] ?? 0,
            $data['pax_inf'] ?? 0,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
            $data['note'] ?? null,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
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
        $allowedFields = ['reference_id', 'first_name', 'last_name', 'agent_name', 'agent_id', 'pax', 'pax_adt', 'pax_chd', 'pax_inf', 'start_date', 'end_date', 'note', 'completed'];

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
        $stmt = $db->prepare("UPDATE bookings SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
