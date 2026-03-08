SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- ตาราง: users
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password_hash` TEXT NOT NULL,
  `fullname` VARCHAR(255) NULL,
  `role` VARCHAR(50) NULL DEFAULT 'user',
  `active` TINYINT(1) NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  CONSTRAINT `users_role_check` CHECK (`role` IN ('user', 'admin', 'dev'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง: information (master data)
CREATE TABLE `information` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(100) NOT NULL,
  `value` TEXT NOT NULL,
  `description` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_information_category` (`category`),
  INDEX `idx_information_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง: bookings (เปลี่ยนจาก orders)
CREATE TABLE `bookings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `reference_id` VARCHAR(255) NULL,
  `first_name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `agent_name` VARCHAR(255) NULL,
  `agent_id` BIGINT NULL,
  `pax` VARCHAR(50) NULL,
  `pax_adt` INT NULL DEFAULT 0,
  `pax_chd` INT NULL DEFAULT 0,
  `pax_inf` INT NULL DEFAULT 0,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `note` TEXT NULL,
  `completed` TINYINT(1) NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookings_reference_id_key` (`reference_id`),
  INDEX `idx_bookings_created_at` (`created_at`),
  CONSTRAINT `bookings_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `information` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง: tour_bookings
CREATE TABLE `tour_bookings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NULL,
  `reference_id` VARCHAR(255) NULL,
  `tour_date` DATE NOT NULL,
  `tour_pickup_time` VARCHAR(255) NULL,
  `tour_type` VARCHAR(255) NULL,
  `tour_detail` TEXT NULL,
  `tour_hotel` VARCHAR(255) NULL,
  `tour_room_no` VARCHAR(100) NULL,
  `tour_contact_no` VARCHAR(50) NULL,
  `province` VARCHAR(100) NULL,
  `send_to` VARCHAR(255) NULL,
  `payment_status` VARCHAR(50) NULL DEFAULT 'not_paid',
  `payment_date` DATE NULL,
  `payment_note` TEXT NULL,
  `status` VARCHAR(50) NULL DEFAULT 'pending',
  `note` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tour_bookings_reference_id_key` (`reference_id`),
  INDEX `idx_tour_bookings_booking_id` (`booking_id`),
  INDEX `idx_tour_bookings_tour_date` (`tour_date`),
  CONSTRAINT `tour_bookings_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tour_bookings_payment_status_check` CHECK (`payment_status` IN ('paid', 'not_paid')),
  CONSTRAINT `tour_bookings_status_check` CHECK (`status` IN ('pending', 'booked', 'in_progress', 'completed', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง: transfer_bookings
CREATE TABLE `transfer_bookings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NULL,
  `reference_id` VARCHAR(255) NULL,
  `transfer_date` DATE NOT NULL,
  `transfer_time` VARCHAR(255) NULL,
  `transfer_type` VARCHAR(255) NULL,
  `transfer_detail` TEXT NULL,
  `pickup_location` VARCHAR(255) NULL,
  `drop_location` VARCHAR(255) NULL,
  `transfer_flight` VARCHAR(100) NULL,
  `transfer_ftime` VARCHAR(255) NULL,
  `province` VARCHAR(100) NULL,
  `send_to` VARCHAR(255) NULL,
  `car_model` VARCHAR(255) NULL,
  `phone_number` VARCHAR(50) NULL,
  `payment_status` VARCHAR(50) NULL DEFAULT 'not_paid',
  `payment_date` DATE NULL,
  `payment_note` TEXT NULL,
  `status` VARCHAR(50) NULL DEFAULT 'pending',
  `note` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transfer_bookings_reference_id_key` (`reference_id`),
  INDEX `idx_transfer_bookings_booking_id` (`booking_id`),
  INDEX `idx_transfer_bookings_transfer_date` (`transfer_date`),
  CONSTRAINT `transfer_bookings_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transfer_bookings_payment_status_check` CHECK (`payment_status` IN ('paid', 'not_paid')),
  CONSTRAINT `transfer_bookings_status_check` CHECK (`status` IN ('pending', 'booked', 'in_progress', 'completed', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง: booking_finances (ข้อมูลการเงิน - หลายบรรทัดต่อ 1 tour/transfer)
CREATE TABLE `booking_finances` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_type` VARCHAR(50) NOT NULL,
  `booking_item_id` BIGINT NOT NULL,
  `cost` DECIMAL(10, 2) NULL DEFAULT 0,
  `sell` DECIMAL(10, 2) NULL DEFAULT 0,
  `type` VARCHAR(10) NULL DEFAULT 'all',
  `remark` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_bf_booking` (`booking_type`, `booking_item_id`),
  CONSTRAINT `bf_booking_type_check` CHECK (`booking_type` IN ('tour', 'transfer')),
  CONSTRAINT `bf_type_check` CHECK (`type` IN ('all', 'adt', 'chd'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`username`, `password_hash`, `fullname`, `role`, `active`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', 1);

COMMIT;
