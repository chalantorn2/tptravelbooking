-- Migration: ปรับปรุงโครงสร้าง DB
-- รันใน phpMyAdmin

-- ============================================
-- 1. ลบตารางที่ไม่ใช้แล้ว
-- ============================================
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `vouchers`;
DROP TABLE IF EXISTS `sequences`;

-- ============================================
-- 2. tour_bookings: ลบคอลัมน์ซ้ำซ้อน + เพิ่ม province
-- ============================================
ALTER TABLE `tour_bookings`
  DROP COLUMN `pax`,
  DROP COLUMN `pax_adt`,
  DROP COLUMN `pax_chd`,
  DROP COLUMN `pax_inf`,
  DROP COLUMN `cost_price`,
  DROP COLUMN `selling_price`,
  DROP COLUMN `voucher_created`,
  ADD COLUMN `province` VARCHAR(100) NULL AFTER `tour_contact_no`;

-- ============================================
-- 3. transfer_bookings: ลบคอลัมน์ซ้ำซ้อน + เพิ่ม province
-- ============================================
ALTER TABLE `transfer_bookings`
  DROP COLUMN `pax`,
  DROP COLUMN `pax_adt`,
  DROP COLUMN `pax_chd`,
  DROP COLUMN `pax_inf`,
  DROP COLUMN `cost_price`,
  DROP COLUMN `selling_price`,
  DROP COLUMN `voucher_created`,
  ADD COLUMN `province` VARCHAR(100) NULL AFTER `transfer_ftime`;

-- ============================================
-- 4. สร้างตาราง booking_finances
-- ============================================
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
