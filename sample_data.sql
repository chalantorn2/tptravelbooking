-- Sample data for bookings, tour_bookings, transfer_bookings
-- Booking 1: 9 Mar 2026 - 3 tours, 1 transfer
-- Booking 2: 10 Mar 2026 - 0 tours, 2 transfers

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- ============================================
-- Booking 1: Mr. James Smith (agent: Samui Paradise Travel)
-- วันที่ 9 มีนาคม 2026 | 3 tours + 1 transfer
-- ============================================
INSERT INTO `bookings` (`id`, `reference_id`, `first_name`, `last_name`, `agent_name`, `agent_id`, `pax`, `pax_adt`, `pax_chd`, `pax_inf`, `start_date`, `end_date`, `note`, `completed`, `created_at`, `updated_at`) VALUES
(1, 'TP-20260309-001', 'James', 'Smith', 'Samui Paradise Travel', 1, '2A1C', 2, 1, 0, '2026-03-09', '2026-03-09', 'Family trip from Chaweng hotel', 0, '2026-03-08 10:00:00', '2026-03-08 10:00:00');

-- Tour 1: Snorkeling Trip
INSERT INTO `tour_bookings` (`id`, `booking_id`, `reference_id`, `tour_date`, `tour_pickup_time`, `tour_type`, `tour_detail`, `tour_hotel`, `tour_room_no`, `tour_contact_no`, `province`, `send_to`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 'TP-20260309-001-T1', '2026-03-09', '08:00', 'Snorkeling Trip', 'ดำน้ำเกาะเต่า + เกาะนางยวน Full Day', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณเอก', 'not_paid', NULL, NULL, 'pending', 'ลูกค้าแพ้อาหารทะเล แจ้งไกด์ด้วย', '2026-03-08 10:00:00', '2026-03-08 10:00:00');

-- Tour 2: Island Hopping
INSERT INTO `tour_bookings` (`id`, `booking_id`, `reference_id`, `tour_date`, `tour_pickup_time`, `tour_type`, `tour_detail`, `tour_hotel`, `tour_room_no`, `tour_contact_no`, `province`, `send_to`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(2, 1, 'TP-20260309-001-T2', '2026-03-09', '07:30', 'Island Hopping', 'ทัวร์เกาะอ่างทอง เรือ Speed Boat', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณสมชาย', 'paid', '2026-03-08', 'โอนแล้ว', 'booked', NULL, '2026-03-08 10:05:00', '2026-03-08 10:05:00');

-- Tour 3: Sunset Cruise
INSERT INTO `tour_bookings` (`id`, `booking_id`, `reference_id`, `tour_date`, `tour_pickup_time`, `tour_type`, `tour_detail`, `tour_hotel`, `tour_room_no`, `tour_contact_no`, `province`, `send_to`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(3, 1, 'TP-20260309-001-T3', '2026-03-09', '16:30', 'Sunset Cruise', 'ล่องเรือชมพระอาทิตย์ตก พร้อมดินเนอร์', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณแอน', 'not_paid', NULL, NULL, 'pending', 'ต้องการโต๊ะริมเรือ', '2026-03-08 10:10:00', '2026-03-08 10:10:00');

-- Transfer 1: Airport Transfer
INSERT INTO `transfer_bookings` (`id`, `booking_id`, `reference_id`, `transfer_date`, `transfer_time`, `transfer_type`, `transfer_detail`, `pickup_location`, `drop_location`, `transfer_flight`, `transfer_ftime`, `province`, `send_to`, `car_model`, `phone_number`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 'TP-20260309-001-X1', '2026-03-09', '06:00', 'Airport Transfer', 'รับจากโรงแรมไปสนามบินสมุย', 'Chaweng Regent Beach Resort', 'Samui Airport (USM)', 'PG512', '09:15', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Camry', '086-111-2222', 'not_paid', NULL, NULL, 'pending', 'ลูกค้ามีกระเป๋าใหญ่ 3 ใบ', '2026-03-08 10:15:00', '2026-03-08 10:15:00');

-- ============================================
-- Booking 2: Ms. Anna Mueller (agent: Island Hopper Co.)
-- วันที่ 10 มีนาคม 2026 | 0 tours + 2 transfers
-- ============================================
INSERT INTO `bookings` (`id`, `reference_id`, `first_name`, `last_name`, `agent_name`, `agent_id`, `pax`, `pax_adt`, `pax_chd`, `pax_inf`, `start_date`, `end_date`, `note`, `completed`, `created_at`, `updated_at`) VALUES
(2, 'TP-20260310-001', 'Anna', 'Mueller', 'Island Hopper Co.', 2, '2A0C1I', 2, 0, 1, '2026-03-10', '2026-03-10', 'Couple with infant, need car seat', 0, '2026-03-09 14:00:00', '2026-03-09 14:00:00');

-- Transfer 1: Airport Transfer (arrival)
INSERT INTO `transfer_bookings` (`id`, `booking_id`, `reference_id`, `transfer_date`, `transfer_time`, `transfer_type`, `transfer_detail`, `pickup_location`, `drop_location`, `transfer_flight`, `transfer_ftime`, `province`, `send_to`, `car_model`, `phone_number`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(2, 2, 'TP-20260310-001-X1', '2026-03-10', '10:30', 'Airport Transfer', 'รับจากสนามบินสมุยไปโรงแรม', 'Samui Airport (USM)', 'Banyan Tree Samui', 'PG141', '10:00', 'สุราษฎร์ธานี', 'คุณสุรชัย', 'Toyota Fortuner', '087-333-4444', 'paid', '2026-03-09', 'Agent โอนแล้ว', 'booked', 'ต้องการ car seat สำหรับทารก', '2026-03-09 14:05:00', '2026-03-09 14:05:00');

-- Transfer 2: Pier Transfer (evening)
INSERT INTO `transfer_bookings` (`id`, `booking_id`, `reference_id`, `transfer_date`, `transfer_time`, `transfer_type`, `transfer_detail`, `pickup_location`, `drop_location`, `transfer_flight`, `transfer_ftime`, `province`, `send_to`, `car_model`, `phone_number`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(3, 2, 'TP-20260310-001-X2', '2026-03-10', '17:00', 'Pier Transfer', 'ส่งจากโรงแรมไปท่าเรือลมพระยา ไปเกาะพะงัน', 'Banyan Tree Samui', 'Lomprayah Pier', NULL, NULL, 'สุราษฎร์ธานี', 'คุณอนันต์', 'Toyota Commuter', '088-555-6666', 'not_paid', NULL, NULL, 'pending', 'เรือออก 18:00 ต้องถึงก่อน 17:30', '2026-03-09 14:10:00', '2026-03-09 14:10:00');

COMMIT;
