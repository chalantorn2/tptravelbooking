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
            // Get tour bookings by date with booking (parent) data
            $stmt = $db->prepare("
                SELECT tb.*, b.first_name, b.last_name, b.agent_name, b.agent_id, b.reference_id as booking_reference_id, b.pax_adt as booking_pax_adt, b.pax_chd as booking_pax_chd, b.pax_inf as booking_pax_inf
                FROM tour_bookings tb
                LEFT JOIN bookings b ON tb.booking_id = b.id
                WHERE tb.tour_date = ?
                ORDER BY tb.tour_pickup_time ASC
            ");
            $stmt->execute([$date]);
            jsonResponse($stmt->fetchAll());
        } elseif ($bookingId) {
            $stmt = $db->prepare("SELECT * FROM tour_bookings WHERE booking_id = ?");
            $stmt->execute([$bookingId]);
            jsonResponse($stmt->fetchAll());
        } elseif (isset($_GET['list'])) {
            // Get all tour bookings with booking data and finance totals (for Payment page)
            $sql = "
                SELECT tb.*, b.first_name, b.last_name, b.agent_name, b.agent_id,
                       b.reference_id as booking_reference_id,
                       b.pax_adt, b.pax_chd, b.pax_inf,
                       b.pax_adt as booking_pax_adt, b.pax_chd as booking_pax_chd, b.pax_inf as booking_pax_inf,
                       COALESCE(SUM(bf.cost), 0) as cost_price,
                       COALESCE(SUM(bf.sell), 0) as selling_price
                FROM tour_bookings tb
                LEFT JOIN bookings b ON tb.booking_id = b.id
                LEFT JOIN booking_finances bf ON bf.booking_type = 'tour' AND bf.booking_item_id = tb.id
            ";
            $params = [];
            $where = [];

            if ($startDate && $endDate) {
                $where[] = "tb.tour_date >= ? AND tb.tour_date <= ?";
                $params[] = $startDate;
                $params[] = $endDate;
            }

            if (!empty($where)) {
                $sql .= " WHERE " . implode(' AND ', $where);
            }

            $sql .= " GROUP BY tb.id ORDER BY tb.tour_date DESC, tb.tour_pickup_time ASC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            jsonResponse($stmt->fetchAll());
        } elseif ($startDate && $endDate) {
            // Get tour dates in range (for calendar highlights)
            $stmt = $db->prepare("SELECT DISTINCT tour_date FROM tour_bookings WHERE tour_date >= ? AND tour_date <= ?");
            $stmt->execute([$startDate, $endDate]);
            jsonResponse($stmt->fetchAll());
        } else {
            jsonResponse(['error' => 'date, booking_id, or date range is required'], 400);
        }
        break;

    case 'POST':
        $data = getJsonInput();

        $stmt = $db->prepare("INSERT INTO tour_bookings (booking_id, reference_id, booking_ref, tour_date, tour_pickup_time, tour_type, tour_detail, tour_hotel, tour_room_no, tour_contact_no, province, send_to, status, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['booking_id'] ?? null,
            $data['reference_id'] ?? null,
            $data['booking_ref'] ?? null,
            $data['tour_date'],
            $data['tour_pickup_time'] ?? null,
            $data['tour_type'] ?? null,
            $data['tour_detail'] ?? null,
            $data['tour_hotel'] ?? null,
            $data['tour_room_no'] ?? null,
            $data['tour_contact_no'] ?? null,
            $data['province'] ?? null,
            $data['send_to'] ?? null,
            $data['status'] ?? 'pending',
            $data['note'] ?? null,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM tour_bookings WHERE id = ?");
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
        $allowedFields = ['booking_id', 'reference_id', 'booking_ref', 'tour_date', 'tour_pickup_time', 'tour_type', 'tour_detail', 'tour_hotel', 'tour_room_no', 'tour_contact_no', 'province', 'send_to', 'payment_status', 'payment_date', 'payment_note', 'status', 'note'];

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
        $stmt = $db->prepare("UPDATE tour_bookings SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("DELETE FROM tour_bookings WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
