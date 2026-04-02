-- Migration: Update reference_id format
-- Booking: AGT-YYYY-001, Tour: T-YYYY-001, Transfer: TR-YYYY-001
-- Sequential numbering per year, ordered by id
-- Compatible with phpMyAdmin + MySQL 8.0+

-- ============================================
-- 1. Update bookings reference_id
-- ============================================
UPDATE bookings b
JOIN (
    SELECT id,
           YEAR(created_at) AS yr,
           UPPER(LEFT(REPLACE(COALESCE(agent_name, 'TP'), ' ', ''), 3)) AS prefix,
           ROW_NUMBER() OVER (PARTITION BY YEAR(created_at) ORDER BY id) AS seq
    FROM bookings
) AS ranked ON b.id = ranked.id
SET b.reference_id = CONCAT(ranked.prefix, '-', ranked.yr, '-', LPAD(ranked.seq, 3, '0'));

-- ============================================
-- 2. Update tour_bookings reference_id
-- ============================================
UPDATE tour_bookings tb
JOIN (
    SELECT id,
           YEAR(created_at) AS yr,
           ROW_NUMBER() OVER (PARTITION BY YEAR(created_at) ORDER BY id) AS seq
    FROM tour_bookings
) AS ranked ON tb.id = ranked.id
SET tb.reference_id = CONCAT('T-', ranked.yr, '-', LPAD(ranked.seq, 3, '0'));

-- ============================================
-- 3. Update transfer_bookings reference_id
-- ============================================
UPDATE transfer_bookings trb
JOIN (
    SELECT id,
           YEAR(created_at) AS yr,
           ROW_NUMBER() OVER (PARTITION BY YEAR(created_at) ORDER BY id) AS seq
    FROM transfer_bookings
) AS ranked ON trb.id = ranked.id
SET trb.reference_id = CONCAT('TR-', ranked.yr, '-', LPAD(ranked.seq, 3, '0'));
