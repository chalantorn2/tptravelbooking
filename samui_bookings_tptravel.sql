-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 09, 2026 at 08:55 AM
-- Server version: 10.11.14-MariaDB-0+deb12u2-log
-- PHP Version: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `samui_bookings_tptravel`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `agent_name` varchar(255) DEFAULT NULL,
  `agent_id` bigint(20) DEFAULT NULL,
  `pax` varchar(50) DEFAULT NULL,
  `pax_adt` int(11) DEFAULT 0,
  `pax_chd` int(11) DEFAULT 0,
  `pax_inf` int(11) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `reference_id`, `first_name`, `last_name`, `agent_name`, `agent_id`, `pax`, `pax_adt`, `pax_chd`, `pax_inf`, `start_date`, `end_date`, `note`, `completed`, `created_at`, `updated_at`) VALUES
(1, 'TP-20260309-001', 'James', 'Smith', 'Samui Paradise Travel', 1, '2A1C', 2, 1, 0, '2026-03-09', '2026-03-09', 'Family trip from Chaweng hotel', 0, '2026-03-08 03:00:00', '2026-03-08 03:00:00'),
(2, 'TP-20260310-001', 'Anna', 'Mueller', 'Island Hopper Co.', 2, '2A0C1I', 2, 0, 1, '2026-03-10', '2026-03-10', 'Couple with infant, need car seat', 0, '2026-03-09 07:00:00', '2026-03-09 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `booking_finances`
--

CREATE TABLE `booking_finances` (
  `id` bigint(20) NOT NULL,
  `booking_type` varchar(50) NOT NULL,
  `booking_item_id` bigint(20) NOT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `sell` decimal(10,2) DEFAULT 0.00,
  `type` varchar(10) DEFAULT 'all',
  `remark` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `information`
--

CREATE TABLE `information` (
  `id` bigint(20) NOT NULL,
  `category` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `information`
--

INSERT INTO `information` (`id`, `category`, `value`, `description`, `phone`, `active`, `created_at`, `updated_at`) VALUES
(1, 'agent', 'Samui Paradise Travel', 'Tour agency in Chaweng', '077-422-111', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(2, 'agent', 'Island Hopper Co.', 'Boat tour specialist', '077-433-222', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(3, 'agent', 'Thai Smile Tours', 'Full service travel agent', '077-244-333', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(4, 'agent', 'Coconut Travel', 'Budget tours & transfers', '077-955-444', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(5, 'agent', 'Blue Ocean Agency', 'Premium tour packages', '077-366-555', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(6, 'tour_type', 'Snorkeling Trip', 'เที่ยวดำน้ำดูปะการัง', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(7, 'tour_type', 'Island Hopping', 'ทัวร์เกาะ', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(8, 'tour_type', 'Safari Tour', 'ทัวร์ซาฟารี ขับรถชมวิว', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(9, 'tour_type', 'Temple Tour', 'ทัวร์วัดและวัฒนธรรม', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(10, 'tour_type', 'Sunset Cruise', 'ล่องเรือชมพระอาทิตย์ตก', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(11, 'transfer_type', 'Airport Transfer', 'รับส่งสนามบิน', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(12, 'transfer_type', 'Hotel Transfer', 'รับส่งโรงแรม', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(13, 'transfer_type', 'Pier Transfer', 'รับส่งท่าเรือ', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(14, 'transfer_type', 'Private Car', 'รถส่วนตัว', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(15, 'transfer_type', 'Shared Minivan', 'รถตู้ร่วม', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(16, 'province', 'สุราษฎร์ธานี', 'เกาะสมุย เกาะพะงัน เกาะเต่า', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(17, 'province', 'กระบี่', 'อ่าวนาง เกาะพีพี', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(18, 'province', 'ภูเก็ต', 'ป่าตอง กะรน กะตะ', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(19, 'province', 'ชลบุรี', 'พัทยา เกาะล้าน', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(20, 'province', 'เชียงใหม่', 'ดอยสุเทพ เชียงใหม่ไนท์ซาฟารี', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(21, 'place', 'Samui Airport (USM)', 'สนามบินสมุย', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(22, 'place', 'Nathon Pier', 'ท่าเรือหน้าทอน', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(23, 'place', 'Lomprayah Pier', 'ท่าเรือลมพระยา', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(24, 'place', 'Big Buddha Temple', 'วัดพระใหญ่', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(25, 'place', 'Chaweng Beach', 'หาดเฉวง', NULL, 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(26, 'tour_recipient', 'คุณสมชาย', 'ไกด์ทัวร์เกาะ', '081-111-2222', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(27, 'tour_recipient', 'คุณวิชัย', 'ไกด์ทัวร์ซาฟารี', '082-333-4444', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(28, 'tour_recipient', 'คุณนิดา', 'ไกด์ทัวร์วัด', '083-555-6666', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(29, 'tour_recipient', 'คุณเอก', 'ไกด์ดำน้ำ', '084-777-8888', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(30, 'tour_recipient', 'คุณแอน', 'ไกด์ล่องเรือ', '085-999-0000', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(31, 'transfer_recipient', 'คุณประเสริฐ', 'คนขับรถตู้', '086-111-2222', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(32, 'transfer_recipient', 'คุณสุรชัย', 'คนขับรถเก๋ง', '087-333-4444', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(33, 'transfer_recipient', 'คุณอนันต์', 'คนขับรถตู้ VIP', '088-555-6666', 1, '2026-03-08 19:15:32', '2026-03-08 19:15:32'),
(34, 'transfer_recipient', 'คุณมานะ', 'คนขับรถกระบะ', '089-777-8888', 0, '2026-03-08 19:15:32', '2026-03-08 19:43:22'),
(35, 'transfer_recipient', 'คุณธีระ Test', 'คนขับรถ SUV', '080-999-0000', 0, '2026-03-08 19:15:32', '2026-03-08 19:43:25'),
(36, 'transfer_recipient', 'Test', 'TestTestTestTest', 'TestTestTestTest', 0, '2026-03-08 19:17:26', '2026-03-08 19:17:43'),
(37, 'tour_recipient', 'คุณสมชาย', 'ไกด์ทัวร์เกาะ', '081-111-2222', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(38, 'tour_recipient', 'คุณวิชัย', 'ไกด์ทัวร์ซาฟารี', '082-333-4444', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(39, 'tour_recipient', 'คุณนิดา', 'ไกด์ทัวร์วัด', '083-555-6666', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(40, 'tour_recipient', 'คุณเอก', 'ไกด์ดำน้ำ', '084-777-8888', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(41, 'tour_recipient', 'คุณแอน', 'ไกด์ล่องเรือ', '085-999-0000', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(42, 'transfer_recipient', 'คุณประเสริฐ', 'คนขับรถตู้', '086-111-2222', 0, '2026-03-08 19:41:14', '2026-03-08 19:43:27'),
(43, 'transfer_recipient', 'คุณสุรชัย', 'คนขับรถเก๋ง', '087-333-4444', 0, '2026-03-08 19:41:14', '2026-03-08 19:43:29'),
(44, 'transfer_recipient', 'คุณอนันต์', 'คนขับรถตู้ VIP', '088-555-6666', 0, '2026-03-08 19:41:14', '2026-03-08 19:43:32'),
(45, 'transfer_recipient', 'คุณมานะ', 'คนขับรถกระบะ', '089-777-8888', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(46, 'transfer_recipient', 'คุณธีระ', 'คนขับรถ SUV', '080-999-0000', 1, '2026-03-08 19:41:14', '2026-03-08 19:41:14'),
(47, 'driver', 'คุณสมชาย', 'คนขับรถตู้', '081-111-2222', 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12'),
(48, 'driver', 'คุณวิชัย', 'คนขับรถเก๋ง', '082-333-4444', 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12'),
(49, 'driver', 'คุณอนุชา', 'คนขับรถ SUV', '083-555-6666', 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12'),
(50, 'vehicle', 'กท 1234', 'Toyota Commuter', NULL, 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12'),
(51, 'vehicle', 'ขก 5678', 'Toyota Camry', NULL, 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12'),
(52, 'vehicle', 'ชล 9012', 'Toyota Fortuner', NULL, 1, '2026-03-08 19:43:12', '2026-03-08 19:43:12');

-- --------------------------------------------------------

--
-- Table structure for table `tour_bookings`
--

CREATE TABLE `tour_bookings` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `tour_date` date NOT NULL,
  `tour_pickup_time` varchar(255) DEFAULT NULL,
  `tour_type` varchar(255) DEFAULT NULL,
  `tour_detail` text DEFAULT NULL,
  `tour_hotel` varchar(255) DEFAULT NULL,
  `tour_room_no` varchar(100) DEFAULT NULL,
  `tour_contact_no` varchar(50) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `send_to` varchar(255) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT 'not_paid',
  `payment_date` date DEFAULT NULL,
  `payment_note` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `tour_bookings`
--

INSERT INTO `tour_bookings` (`id`, `booking_id`, `reference_id`, `tour_date`, `tour_pickup_time`, `tour_type`, `tour_detail`, `tour_hotel`, `tour_room_no`, `tour_contact_no`, `province`, `send_to`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 'TP-20260309-001-T1', '2026-03-09', '08:00', 'Snorkeling Trip', 'ดำน้ำเกาะเต่า + เกาะนางยวน Full Day', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณเอก', 'not_paid', NULL, NULL, 'pending', 'ลูกค้าแพ้อาหารทะเล แจ้งไกด์ด้วย', '2026-03-08 03:00:00', '2026-03-08 03:00:00'),
(2, 1, 'TP-20260309-001-T2', '2026-03-09', '07:30', 'Island Hopping', 'ทัวร์เกาะอ่างทอง เรือ Speed Boat', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณสมชาย', 'paid', '2026-03-08', 'โอนแล้ว', 'booked', NULL, '2026-03-08 03:05:00', '2026-03-08 03:05:00'),
(3, 1, 'TP-20260309-001-T3', '2026-03-09', '16:30', 'Sunset Cruise', 'ล่องเรือชมพระอาทิตย์ตก พร้อมดินเนอร์', 'Chaweng Regent Beach Resort', '205', '081-234-5678', 'สุราษฎร์ธานี', 'คุณแอน', 'not_paid', NULL, NULL, 'pending', 'ต้องการโต๊ะริมเรือ', '2026-03-08 03:10:00', '2026-03-08 03:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `transfer_bookings`
--

CREATE TABLE `transfer_bookings` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `transfer_date` date NOT NULL,
  `transfer_time` varchar(255) DEFAULT NULL,
  `transfer_type` varchar(255) DEFAULT NULL,
  `transfer_detail` text DEFAULT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `drop_location` varchar(255) DEFAULT NULL,
  `transfer_flight` varchar(100) DEFAULT NULL,
  `transfer_ftime` varchar(255) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `send_to` varchar(255) DEFAULT NULL,
  `car_model` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT 'not_paid',
  `payment_date` date DEFAULT NULL,
  `payment_note` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `transfer_bookings`
--

INSERT INTO `transfer_bookings` (`id`, `booking_id`, `reference_id`, `transfer_date`, `transfer_time`, `transfer_type`, `transfer_detail`, `pickup_location`, `drop_location`, `transfer_flight`, `transfer_ftime`, `province`, `send_to`, `car_model`, `phone_number`, `payment_status`, `payment_date`, `payment_note`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 'TP-20260309-001-X1', '2026-03-09', '06:00', 'Airport Transfer', 'รับจากโรงแรมไปสนามบินสมุย', 'Chaweng Regent Beach Resort', 'Samui Airport (USM)', 'PG512', '09:15', 'สุราษฎร์ธานี', 'คุณประเสริฐ', 'Toyota Camry', '086-111-2222', 'not_paid', NULL, NULL, 'pending', 'ลูกค้ามีกระเป๋าใหญ่ 3 ใบ', '2026-03-08 03:15:00', '2026-03-08 03:15:00'),
(2, 2, 'TP-20260310-001-X1', '2026-03-10', '10:30', 'Airport Transfer', 'รับจากสนามบินสมุยไปโรงแรม', 'Samui Airport (USM)', 'Banyan Tree Samui', 'PG141', '10:00', 'สุราษฎร์ธานี', 'คุณสุรชัย', 'Toyota Fortuner', '087-333-4444', 'paid', '2026-03-09', 'Agent โอนแล้ว', 'booked', 'ต้องการ car seat สำหรับทารก', '2026-03-09 07:05:00', '2026-03-09 07:05:00'),
(3, 2, 'TP-20260310-001-X2', '2026-03-10', '17:00', 'Pier Transfer', 'ส่งจากโรงแรมไปท่าเรือลมพระยา ไปเกาะพะงัน', 'Banyan Tree Samui', 'Lomprayah Pier', NULL, NULL, 'สุราษฎร์ธานี', 'คุณอนันต์', 'Toyota Commuter', '088-555-6666', 'not_paid', NULL, NULL, 'pending', 'เรือออก 18:00 ต้องถึงก่อน 17:30', '2026-03-09 07:10:00', '2026-03-09 07:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `fullname`, `role`, `active`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'dev', 1, '2026-03-08 12:44:33', '2026-03-08 20:06:15'),
(2, 'test', '$2y$10$FM677Nt12NcviEmogOtn3.J38tXQq/PgiTfgPoiSgGpsKer955Cwu', 'Test', 'user', 0, '2026-03-08 18:19:28', '2026-03-08 18:20:41'),
(3, 'tptravel', '$2y$10$H7MipcJt77e5akyhjxstR.21opIoKaTly7JIGOWho.Uy/zaNZ6B/S', 'TP Travel', 'admin', 1, '2026-03-08 20:09:34', '2026-03-08 20:09:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_reference_id_key` (`reference_id`),
  ADD KEY `idx_bookings_created_at` (`created_at`),
  ADD KEY `bookings_agent_id_fkey` (`agent_id`);

--
-- Indexes for table `booking_finances`
--
ALTER TABLE `booking_finances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bf_booking` (`booking_type`,`booking_item_id`);

--
-- Indexes for table `information`
--
ALTER TABLE `information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_information_category` (`category`),
  ADD KEY `idx_information_active` (`active`);

--
-- Indexes for table `tour_bookings`
--
ALTER TABLE `tour_bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tour_bookings_reference_id_key` (`reference_id`),
  ADD KEY `idx_tour_bookings_booking_id` (`booking_id`),
  ADD KEY `idx_tour_bookings_tour_date` (`tour_date`);

--
-- Indexes for table `transfer_bookings`
--
ALTER TABLE `transfer_bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfer_bookings_reference_id_key` (`reference_id`),
  ADD KEY `idx_transfer_bookings_booking_id` (`booking_id`),
  ADD KEY `idx_transfer_bookings_transfer_date` (`transfer_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_key` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_finances`
--
ALTER TABLE `booking_finances`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `information`
--
ALTER TABLE `information`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `tour_bookings`
--
ALTER TABLE `tour_bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfer_bookings`
--
ALTER TABLE `transfer_bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `information` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tour_bookings`
--
ALTER TABLE `tour_bookings`
  ADD CONSTRAINT `tour_bookings_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transfer_bookings`
--
ALTER TABLE `transfer_bookings`
  ADD CONSTRAINT `transfer_bookings_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
