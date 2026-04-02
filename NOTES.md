# TP Travel Booking System

## แนวคิด
ระบบนี้ออกแบบโดยอ้างอิงจาก **ExampleBookingWeb** เป็นต้นแบบ แต่ไม่ได้ทำเหมือนทั้งหมด

## สิ่งที่ต่างจาก ExampleBookingWeb

### Database
- เปลี่ยนตาราง `orders` เป็น `bookings`
- FK ใน tour_bookings / transfer_bookings ใช้ `booking_id` แทน `order_id`
- ใช้ MySQL ตรงแทน Supabase

### Backend
- ใช้ PHP REST API แทน Supabase client
- API endpoint: `bookings.tptraveltransfer.com`

### UX/UI
- ธีมขาว-น้ำเงิน (ต้นแบบใช้ธีมมืด)
- Sidebar ออกแบบแบบลอย มี gap รอบตัว ไม่ชิดขอบ
- มี Export Excel (ใช้ ExcelJS) ในหน้า Report
- ไม่มี Print / Capture
