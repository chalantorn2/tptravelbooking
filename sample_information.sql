-- Sample data for information table
-- ข้อมูลตัวอย่างทุกประเภท อย่างละ 5 รายการ

-- Agent
INSERT INTO `information` (`category`, `value`, `description`, `phone`) VALUES
('agent', 'Samui Paradise Travel', 'Tour agency in Chaweng', '077-422-111'),
('agent', 'Island Hopper Co.', 'Boat tour specialist', '077-433-222'),
('agent', 'Thai Smile Tours', 'Full service travel agent', '077-244-333'),
('agent', 'Coconut Travel', 'Budget tours & transfers', '077-955-444'),
('agent', 'Blue Ocean Agency', 'Premium tour packages', '077-366-555');

-- ประเภททัวร์ (tour_type)
INSERT INTO `information` (`category`, `value`, `description`) VALUES
('tour_type', 'Snorkeling Trip', 'เที่ยวดำน้ำดูปะการัง'),
('tour_type', 'Island Hopping', 'ทัวร์เกาะ'),
('tour_type', 'Safari Tour', 'ทัวร์ซาฟารี ขับรถชมวิว'),
('tour_type', 'Temple Tour', 'ทัวร์วัดและวัฒนธรรม'),
('tour_type', 'Sunset Cruise', 'ล่องเรือชมพระอาทิตย์ตก');

-- ประเภทรถรับส่ง (transfer_type)
INSERT INTO `information` (`category`, `value`, `description`) VALUES
('transfer_type', 'Airport Transfer', 'รับส่งสนามบิน'),
('transfer_type', 'Hotel Transfer', 'รับส่งโรงแรม'),
('transfer_type', 'Pier Transfer', 'รับส่งท่าเรือ'),
('transfer_type', 'Private Car', 'รถส่วนตัว'),
('transfer_type', 'Shared Minivan', 'รถตู้ร่วม');

-- จังหวัด (province)
INSERT INTO `information` (`category`, `value`, `description`) VALUES
('province', 'สุราษฎร์ธานี', 'เกาะสมุย เกาะพะงัน เกาะเต่า'),
('province', 'กระบี่', 'อ่าวนาง เกาะพีพี'),
('province', 'ภูเก็ต', 'ป่าตอง กะรน กะตะ'),
('province', 'ชลบุรี', 'พัทยา เกาะล้าน'),
('province', 'เชียงใหม่', 'ดอยสุเทพ เชียงใหม่ไนท์ซาฟารี');

-- สถานที่ (place)
INSERT INTO `information` (`category`, `value`, `description`) VALUES
('place', 'Samui Airport (USM)', 'สนามบินสมุย'),
('place', 'Nathon Pier', 'ท่าเรือหน้าทอน'),
('place', 'Lomprayah Pier', 'ท่าเรือลมพระยา'),
('place', 'Big Buddha Temple', 'วัดพระใหญ่'),
('place', 'Chaweng Beach', 'หาดเฉวง');

-- ผู้รับทัวร์ (tour_recipient)
INSERT INTO `information` (`category`, `value`, `description`, `phone`) VALUES
('tour_recipient', 'คุณสมชาย', 'ไกด์ทัวร์เกาะ', '081-111-2222'),
('tour_recipient', 'คุณวิชัย', 'ไกด์ทัวร์ซาฟารี', '082-333-4444'),
('tour_recipient', 'คุณนิดา', 'ไกด์ทัวร์วัด', '083-555-6666'),
('tour_recipient', 'คุณเอก', 'ไกด์ดำน้ำ', '084-777-8888'),
('tour_recipient', 'คุณแอน', 'ไกด์ล่องเรือ', '085-999-0000');

-- ผู้รับรถรับส่ง (transfer_recipient)
INSERT INTO `information` (`category`, `value`, `description`, `phone`) VALUES
('transfer_recipient', 'คุณประเสริฐ', 'คนขับรถตู้', '086-111-2222'),
('transfer_recipient', 'คุณสุรชัย', 'คนขับรถเก๋ง', '087-333-4444'),
('transfer_recipient', 'คุณอนันต์', 'คนขับรถตู้ VIP', '088-555-6666'),
('transfer_recipient', 'คุณมานะ', 'คนขับรถกระบะ', '089-777-8888'),
('transfer_recipient', 'คุณธีระ', 'คนขับรถ SUV', '080-999-0000');
