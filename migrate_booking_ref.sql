-- Add booking_ref column to tour_bookings and transfer_bookings
ALTER TABLE tour_bookings ADD COLUMN booking_ref VARCHAR(100) NULL AFTER reference_id;
ALTER TABLE transfer_bookings ADD COLUMN booking_ref VARCHAR(100) NULL AFTER reference_id;
