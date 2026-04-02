-- =============================================
-- Sample Finance Data for TP Travel Booking
-- =============================================
-- Run this AFTER the main schema (samui_bookings_tptravel.sql)
-- This adds more bookings + booking_finances data
-- =============================================

-- =============================================
-- 1. Additional Bookings (parents)
-- =============================================
INSERT INTO `bookings` (`id`, `reference_id`, `first_name`, `last_name`, `agent_name`, `agent_id`, `pax`, `pax_adt`, `pax_chd`, `pax_inf`, `start_date`, `end_date`, `note`, `completed`, `created_at`, `updated_at`) VALUES
(3, 'TP-20260311-001', 'Michael', 'Johnson', 'Thai Smile Tours', 3, '4A2C', 4, 2, 0, '2026-03-11', '2026-03-13', 'Group trip, 2 families', 0, '2026-03-10 04:00:00', '2026-03-10 04:00:00'),
(4, 'TP-20260311-002', 'Yuki', 'Tanaka', 'Coconut Travel', 4, '2A0C', 2, 0, 0, '2026-03-11', '2026-03-12', 'Honeymoon couple', 0, '2026-03-10 05:00:00', '2026-03-10 05:00:00'),
(5, 'TP-20260312-001', 'Sophie', 'Martin', 'Blue Ocean Agency', 5, '3A1C', 3, 1, 0, '2026-03-12', '2026-03-14', 'French family, English OK', 0, '2026-03-11 03:00:00', '2026-03-11 03:00:00'),
(6, 'TP-20260313-001', 'David', 'Brown', 'Samui Paradise Travel', 1, '2A0C', 2, 0, 0, '2026-03-13', '2026-03-15', 'Repeat customer', 1, '2026-03-12 06:00:00', '2026-03-12 06:00:00'),
(7, 'TP-20260314-001', 'Elena', 'Petrov', 'Island Hopper Co.', 2, '5A3C', 5, 3, 0, '2026-03-14', '2026-03-16', 'Large family group, need big van', 0, '2026-03-13 02:00:00', '2026-03-13 02:00:00');

-- =============================================
-- 2. Additional Tour Bookings
-- =============================================
INSERT INTO `tour_bookings` (`id`, `booking_id`, `reference_id`, `tour_date`, `tour_pickup_time`, `tour_type`, `tour_detail`, `tour_hotel`, `tour_room_no`, `tour_contact_no`, `province`, `send_to`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(4, 3, 'TP-20260311-001-T1', '2026-03-11', '07:00', 'Snorkeling Trip', 'ดำน้ำเกาะเต่า Full Day พร้อมอาหารกลางวัน', 'Bandara Resort & Spa', '401', '092-111-3333', 'สุราษฎร์ธานี', 'คุณเอก', 'paid', '2026-03-10', 'Agent โอนเต็มจำนวน', 'booked', NULL, '2026-03-10 04:05:00', '2026-03-10 04:05:00'),
(5, 3, 'TP-20260311-001-T2', '2026-03-12', '08:30', 'Safari Tour', 'ซาฟารี + ขี่ช้าง + น้ำตก', 'Bandara Resort & Spa', '401', '092-111-3333', 'สุราษฎร์ธานี', 'คุณวิชัย', 'not_paid', NULL, NULL, 'pending', 'เด็กไม่ขี่ช้าง ขอนั่งรถแทน', '2026-03-10 04:10:00', '2026-03-10 04:10:00'),
(6, 3, 'TP-20260311-001-T3', '2026-03-13', '09:00', 'Temple Tour', 'ทัวร์วัด Big Buddha + Wat Plai Laem + Hin Ta Hin Yai', 'Bandara Resort & Spa', '401', '092-111-3333', 'สุราษฎร์ธานี', 'คุณนิดา', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-10 04:15:00', '2026-03-10 04:15:00'),
(7, 4, 'TP-20260311-002-T1', '2026-03-11', '16:00', 'Sunset Cruise', 'ล่องเรือ Sunset Dinner Cruise คู่รัก พร้อมแชมเปญ', 'The Library Samui', '12', '093-444-5555', 'สุราษฎร์ธานี', 'คุณแอน', 'paid', '2026-03-10', 'ชำระเงินสดที่ออฟฟิศ', 'booked', 'ขอโต๊ะ VIP หัวเรือ', '2026-03-10 05:05:00', '2026-03-10 05:05:00'),
(8, 4, 'TP-20260311-002-T2', '2026-03-12', '07:30', 'Island Hopping', 'ทัวร์เกาะพะงัน + เกาะแม่เกาะ Speed Boat', 'The Library Samui', '12', '093-444-5555', 'สุราษฎร์ธานี', 'คุณสมชาย', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-10 05:10:00', '2026-03-10 05:10:00'),
(9, 5, 'TP-20260312-001-T1', '2026-03-12', '08:00', 'Snorkeling Trip', 'ดำน้ำอ่าวทองหยก + เกาะสาม Half Day', 'InterContinental Samui', '308', '094-666-7777', 'สุราษฎร์ธานี', 'คุณเอก', 'paid', '2026-03-11', 'โอนมัดจำ 50%', 'booked', 'เด็กว่ายน้ำไม่เป็น ขอชูชีพ', '2026-03-11 03:05:00', '2026-03-11 03:05:00'),
(10, 5, 'TP-20260312-001-T2', '2026-03-13', '09:00', 'Safari Tour', 'ซาฟารี ATV + Zipline + ชมวิว', 'InterContinental Samui', '308', '094-666-7777', 'สุราษฎร์ธานี', 'คุณวิชัย', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-11 03:10:00', '2026-03-11 03:10:00'),
(11, 6, 'TP-20260313-001-T1', '2026-03-13', '08:00', 'Island Hopping', 'ทัวร์อ่างทอง Speed Boat Full Day', 'Four Seasons Resort', 'Villa 8', '095-888-9999', 'สุราษฎร์ธานี', 'คุณสมชาย', 'paid', '2026-03-12', 'Agent โอนเต็มจำนวน', 'completed', NULL, '2026-03-12 06:05:00', '2026-03-12 06:05:00'),
(12, 6, 'TP-20260313-001-T2', '2026-03-14', '16:30', 'Sunset Cruise', 'ล่องเรือ Red Baron พร้อมดินเนอร์', 'Four Seasons Resort', 'Villa 8', '095-888-9999', 'สุราษฎร์ธานี', 'คุณแอน', 'paid', '2026-03-12', 'Agent โอนเต็มจำนวน', 'completed', NULL, '2026-03-12 06:10:00', '2026-03-12 06:10:00'),
(13, 7, 'TP-20260314-001-T1', '2026-03-14', '07:00', 'Snorkeling Trip', 'ดำน้ำเกาะเต่า + เกาะนางยวน กลุ่มใหญ่', 'Nora Buri Resort', '501-502', '096-000-1111', 'สุราษฎร์ธานี', 'คุณเอก', 'not_paid', NULL, NULL, 'pending', 'กลุ่ม 8 คน ขอเรือลำเดียว', '2026-03-13 02:05:00', '2026-03-13 02:05:00'),
(14, 7, 'TP-20260314-001-T2', '2026-03-15', '08:00', 'Temple Tour', 'ทัวร์วัดรอบเกาะสมุย + ตลาดหน้าทอน', 'Nora Buri Resort', '501-502', '096-000-1111', 'สุราษฎร์ธานี', 'คุณนิดา', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-13 02:10:00', '2026-03-13 02:10:00');

-- =============================================
-- 3. Additional Transfer Bookings
-- =============================================
INSERT INTO `transfer_bookings` (`id`, `booking_id`, `reference_id`, `transfer_date`, `transfer_time`, `transfer_type`, `transfer_detail`, `pickup_location`, `drop_location`, `transfer_flight`, `transfer_ftime`, `province`, `send_to`, `car_model`, `phone_number`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(4, 3, 'TP-20260311-001-X1', '2026-03-11', '05:30', 'Airport Transfer', 'รับจากสนามบินสมุย ไปโรงแรม กลุ่มใหญ่', 'Samui Airport (USM)', 'Bandara Resort & Spa', 'PG131', '06:00', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Commuter', '086-111-2222', 'paid', '2026-03-10', 'Agent โอนแล้ว', 'completed', 'กระเป๋า 6 ใบ ต้องใช้รถตู้', '2026-03-10 04:20:00', '2026-03-10 04:20:00'),
(5, 3, 'TP-20260311-001-X2', '2026-03-13', '14:00', 'Airport Transfer', 'ส่งจากโรงแรมไปสนามบินสมุย', 'Bandara Resort & Spa', 'Samui Airport (USM)', 'PG518', '16:30', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Commuter', '086-111-2222', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-10 04:25:00', '2026-03-10 04:25:00'),
(6, 4, 'TP-20260311-002-X1', '2026-03-11', '11:00', 'Airport Transfer', 'รับจากสนามบิน ไป The Library', 'Samui Airport (USM)', 'The Library Samui', 'PG141', '10:30', 'สุราษฎร์ธานี', 'คุณสุรชัย', 'Toyota Camry', '087-333-4444', 'paid', '2026-03-10', 'ชำระเงินสดแล้ว', 'completed', 'Honeymoon couple ขอดอกไม้ในรถ', '2026-03-10 05:15:00', '2026-03-10 05:15:00'),
(7, 4, 'TP-20260311-002-X2', '2026-03-12', '15:00', 'Hotel Transfer', 'ย้ายโรงแรม The Library ไป W Koh Samui', 'The Library Samui', 'W Koh Samui', NULL, NULL, 'สุราษฎร์ธานี', 'คุณสุรชัย', 'Toyota Camry', '087-333-4444', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-10 05:20:00', '2026-03-10 05:20:00'),
(8, 5, 'TP-20260312-001-X1', '2026-03-12', '09:00', 'Airport Transfer', 'รับจากสนามบินสมุย ไปโรงแรม', 'Samui Airport (USM)', 'InterContinental Samui', 'PG135', '08:30', 'สุราษฎร์ธานี', 'คุณอนันต์', 'Toyota Fortuner', '088-555-6666', 'paid', '2026-03-11', 'Agent โอนแล้ว', 'completed', 'มี car seat สำหรับเด็ก', '2026-03-11 03:15:00', '2026-03-11 03:15:00'),
(9, 5, 'TP-20260312-001-X2', '2026-03-14', '12:00', 'Airport Transfer', 'ส่งจากโรงแรมไปสนามบิน', 'InterContinental Samui', 'Samui Airport (USM)', 'PG520', '14:45', 'สุราษฎร์ธานี', 'คุณอนันต์', 'Toyota Fortuner', '088-555-6666', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-11 03:20:00', '2026-03-11 03:20:00'),
(10, 6, 'TP-20260313-001-X1', '2026-03-13', '10:00', 'Pier Transfer', 'รับจากท่าเรือลมพระยา ไป Four Seasons', 'Lomprayah Pier', 'Four Seasons Resort', NULL, NULL, 'สุราษฎร์ธานี', 'คุณมานะ', 'Toyota Camry', '089-777-8888', 'paid', '2026-03-12', 'Agent โอนแล้ว', 'completed', NULL, '2026-03-12 06:15:00', '2026-03-12 06:15:00'),
(11, 6, 'TP-20260313-001-X2', '2026-03-15', '08:00', 'Airport Transfer', 'ส่งจาก Four Seasons ไปสนามบิน', 'Four Seasons Resort', 'Samui Airport (USM)', 'PG512', '10:15', 'สุราษฎร์ธานี', 'คุณมานะ', 'Toyota Camry', '089-777-8888', 'paid', '2026-03-12', 'Agent โอนรวม', 'booked', NULL, '2026-03-12 06:20:00', '2026-03-12 06:20:00'),
(12, 7, 'TP-20260314-001-X1', '2026-03-14', '05:00', 'Airport Transfer', 'รับจากสนามบิน กลุ่มใหญ่ 8 คน', 'Samui Airport (USM)', 'Nora Buri Resort', 'PG131', '05:30', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Commuter', '086-111-2222', 'not_paid', NULL, NULL, 'pending', 'ต้องใช้รถตู้ กระเป๋าเยอะ', '2026-03-13 02:15:00', '2026-03-13 02:15:00'),
(13, 7, 'TP-20260314-001-X2', '2026-03-16', '13:00', 'Airport Transfer', 'ส่งจากโรงแรมไปสนามบิน กลุ่มใหญ่', 'Nora Buri Resort', 'Samui Airport (USM)', 'PG524', '15:30', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Commuter', '086-111-2222', 'not_paid', NULL, NULL, 'pending', NULL, '2026-03-13 02:20:00', '2026-03-13 02:20:00');

-- =============================================
-- 4. Booking Finances (Cost/Sell data)
-- =============================================

-- Tour finances (สำหรับ tour_bookings ทั้งหมด)
INSERT INTO `booking_finances` (`id`, `booking_type`, `booking_item_id`, `cost`, `sell`, `type`, `remark`, `created_at`, `updated_at`) VALUES
-- Tour ID 1: Snorkeling Trip (James Smith) - not_paid
(1, 'tour', 1, 1200.00, 1800.00, 'all', 'ดำน้ำเกาะเต่า Full Day', '2026-03-08 03:00:00', '2026-03-08 03:00:00'),
(2, 'tour', 1, 400.00, 600.00, 'chd', 'เด็ก 1 คน ราคาพิเศษ', '2026-03-08 03:00:00', '2026-03-08 03:00:00'),

-- Tour ID 2: Island Hopping (James Smith) - paid
(3, 'tour', 2, 1500.00, 2200.00, 'all', 'ทัวร์อ่างทอง Speed Boat', '2026-03-08 03:05:00', '2026-03-08 03:05:00'),
(4, 'tour', 2, 500.00, 800.00, 'chd', 'เด็ก 1 คน', '2026-03-08 03:05:00', '2026-03-08 03:05:00'),

-- Tour ID 3: Sunset Cruise (James Smith) - not_paid
(5, 'tour', 3, 2000.00, 3500.00, 'all', 'ล่องเรือ Sunset + ดินเนอร์ 2 ผู้ใหญ่', '2026-03-08 03:10:00', '2026-03-08 03:10:00'),
(6, 'tour', 3, 800.00, 1200.00, 'chd', 'เด็ก 1 คน พร้อมอาหาร', '2026-03-08 03:10:00', '2026-03-08 03:10:00'),

-- Tour ID 4: Snorkeling Trip (Michael Johnson) - paid
(7, 'tour', 4, 2400.00, 3600.00, 'adt', 'ผู้ใหญ่ 4 คน x 900', '2026-03-10 04:05:00', '2026-03-10 04:05:00'),
(8, 'tour', 4, 600.00, 1000.00, 'chd', 'เด็ก 2 คน x 500', '2026-03-10 04:05:00', '2026-03-10 04:05:00'),

-- Tour ID 5: Safari Tour (Michael Johnson) - not_paid
(9, 'tour', 5, 3200.00, 4800.00, 'adt', 'ซาฟารี 4 ผู้ใหญ่', '2026-03-10 04:10:00', '2026-03-10 04:10:00'),
(10, 'tour', 5, 1000.00, 1600.00, 'chd', 'เด็ก 2 คน', '2026-03-10 04:10:00', '2026-03-10 04:10:00'),

-- Tour ID 6: Temple Tour (Michael Johnson) - not_paid
(11, 'tour', 6, 1800.00, 2800.00, 'all', 'ทัวร์วัดรอบเกาะ 6 คน', '2026-03-10 04:15:00', '2026-03-10 04:15:00'),

-- Tour ID 7: Sunset Cruise (Yuki Tanaka) - paid
(12, 'tour', 7, 3500.00, 5500.00, 'all', 'ล่องเรือ VIP คู่รัก + แชมเปญ', '2026-03-10 05:05:00', '2026-03-10 05:05:00'),

-- Tour ID 8: Island Hopping (Yuki Tanaka) - not_paid
(13, 'tour', 8, 1400.00, 2200.00, 'all', 'ทัวร์เกาะพะงัน 2 คน', '2026-03-10 05:10:00', '2026-03-10 05:10:00'),

-- Tour ID 9: Snorkeling Half Day (Sophie Martin) - paid (advance 50%)
(14, 'tour', 9, 1800.00, 2700.00, 'adt', 'ผู้ใหญ่ 3 คน x 900', '2026-03-11 03:05:00', '2026-03-11 03:05:00'),
(15, 'tour', 9, 350.00, 550.00, 'chd', 'เด็ก 1 คน', '2026-03-11 03:05:00', '2026-03-11 03:05:00'),

-- Tour ID 10: Safari ATV (Sophie Martin) - not_paid
(16, 'tour', 10, 2400.00, 3600.00, 'adt', '3 ผู้ใหญ่ ATV + Zipline', '2026-03-11 03:10:00', '2026-03-11 03:10:00'),
(17, 'tour', 10, 600.00, 1000.00, 'chd', 'เด็ก 1 คน Zipline only', '2026-03-11 03:10:00', '2026-03-11 03:10:00'),

-- Tour ID 11: Island Hopping (David Brown) - paid
(18, 'tour', 11, 1500.00, 2400.00, 'all', 'ทัวร์อ่างทอง 2 คน', '2026-03-12 06:05:00', '2026-03-12 06:05:00'),

-- Tour ID 12: Sunset Cruise (David Brown) - paid
(19, 'tour', 12, 2500.00, 4000.00, 'all', 'Red Baron Dinner Cruise 2 คน', '2026-03-12 06:10:00', '2026-03-12 06:10:00'),

-- Tour ID 13: Snorkeling (Elena Petrov) - not_paid
(20, 'tour', 13, 4000.00, 6000.00, 'adt', '5 ผู้ใหญ่ ดำน้ำเกาะเต่า', '2026-03-13 02:05:00', '2026-03-13 02:05:00'),
(21, 'tour', 13, 1200.00, 1800.00, 'chd', '3 เด็ก', '2026-03-13 02:05:00', '2026-03-13 02:05:00'),

-- Tour ID 14: Temple Tour (Elena Petrov) - not_paid
(22, 'tour', 14, 2000.00, 3200.00, 'all', 'ทัวร์วัดรอบเกาะ 8 คน', '2026-03-13 02:10:00', '2026-03-13 02:10:00'),

-- =============================================
-- Transfer finances (สำหรับ transfer_bookings ทั้งหมด)
-- =============================================

-- Transfer ID 1: Airport Transfer (James Smith) - not_paid
(23, 'transfer', 1, 600.00, 900.00, 'all', 'สนามบิน-โรงแรม Camry', '2026-03-08 03:15:00', '2026-03-08 03:15:00'),

-- Transfer ID 2: Airport Transfer (Anna Mueller) - paid
(24, 'transfer', 2, 800.00, 1200.00, 'all', 'สนามบิน-Banyan Tree Fortuner', '2026-03-09 07:05:00', '2026-03-09 07:05:00'),

-- Transfer ID 3: Pier Transfer (Anna Mueller) - not_paid
(25, 'transfer', 3, 700.00, 1100.00, 'all', 'โรงแรม-ท่าเรือลมพระยา Commuter', '2026-03-09 07:10:00', '2026-03-09 07:10:00'),

-- Transfer ID 4: Airport Transfer (Michael Johnson) - paid
(26, 'transfer', 4, 900.00, 1400.00, 'all', 'สนามบิน-Bandara Commuter กลุ่มใหญ่', '2026-03-10 04:20:00', '2026-03-10 04:20:00'),

-- Transfer ID 5: Airport Transfer (Michael Johnson) - not_paid
(27, 'transfer', 5, 900.00, 1400.00, 'all', 'Bandara-สนามบิน Commuter', '2026-03-10 04:25:00', '2026-03-10 04:25:00'),

-- Transfer ID 6: Airport Transfer (Yuki Tanaka) - paid
(28, 'transfer', 6, 600.00, 950.00, 'all', 'สนามบิน-The Library Camry', '2026-03-10 05:15:00', '2026-03-10 05:15:00'),

-- Transfer ID 7: Hotel Transfer (Yuki Tanaka) - not_paid
(29, 'transfer', 7, 500.00, 800.00, 'all', 'ย้ายโรงแรม Camry', '2026-03-10 05:20:00', '2026-03-10 05:20:00'),

-- Transfer ID 8: Airport Transfer (Sophie Martin) - paid
(30, 'transfer', 8, 800.00, 1200.00, 'all', 'สนามบิน-InterContinental Fortuner', '2026-03-11 03:15:00', '2026-03-11 03:15:00'),

-- Transfer ID 9: Airport Transfer (Sophie Martin) - not_paid
(31, 'transfer', 9, 800.00, 1200.00, 'all', 'InterContinental-สนามบิน Fortuner', '2026-03-11 03:20:00', '2026-03-11 03:20:00'),

-- Transfer ID 10: Pier Transfer (David Brown) - paid
(32, 'transfer', 10, 500.00, 800.00, 'all', 'ท่าเรือ-Four Seasons Camry', '2026-03-12 06:15:00', '2026-03-12 06:15:00'),

-- Transfer ID 11: Airport Transfer (David Brown) - paid
(33, 'transfer', 11, 600.00, 950.00, 'all', 'Four Seasons-สนามบิน Camry', '2026-03-12 06:20:00', '2026-03-12 06:20:00'),

-- Transfer ID 12: Airport Transfer (Elena Petrov) - not_paid
(34, 'transfer', 12, 1200.00, 1800.00, 'all', 'สนามบิน-Nora Buri Commuter กลุ่มใหญ่', '2026-03-13 02:15:00', '2026-03-13 02:15:00'),

-- Transfer ID 13: Airport Transfer (Elena Petrov) - not_paid
(35, 'transfer', 13, 1200.00, 1800.00, 'all', 'Nora Buri-สนามบิน Commuter', '2026-03-13 02:20:00', '2026-03-13 02:20:00');

-- =============================================
-- Update AUTO_INCREMENT values
-- =============================================
ALTER TABLE `bookings` AUTO_INCREMENT = 8;
ALTER TABLE `tour_bookings` AUTO_INCREMENT = 15;
ALTER TABLE `transfer_bookings` AUTO_INCREMENT = 14;
ALTER TABLE `booking_finances` AUTO_INCREMENT = 36;
