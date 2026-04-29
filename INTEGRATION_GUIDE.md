# API Integration Guide for sayhitransfer.com

เอกสารนี้อธิบายวิธีเชื่อมต่อเว็บ sayhitransfer.com เข้ากับระบบ Booking ของ TP Travel

---

## Endpoint

```
POST https://bookings.tptraveltransfer.com/api/public-booking/index.php
```

## Headers

```
Content-Type: application/json
X-API-Key: SHT-2026-xK9mPqR7vL3nBwYz
```

> **สำคัญ:** API Key ต้องเรียกผ่าน **Backend** ของ sayhitransfer.com เท่านั้น ห้ามใส่ใน client-side JavaScript

---

## Request Body

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "agent_name": "sayhitransfer",
  "pax_adt": 2,
  "pax_chd": 1,
  "pax_inf": 0,
  "start_date": "2026-04-15",
  "end_date": "2026-04-15",
  "note": "Customer note here",

  "tours": [
    {
      "tour_date": "2026-04-15",
      "pickup_time": "08:00",
      "tour_type": "Snorkeling Trip",
      "detail": "Full day snorkeling",
      "hotel": "Chaweng Beach Resort",
      "room_no": "101",
      "contact_no": "081-234-5678",
      "province": "สุราษฎร์ธานี",
      "note": ""
    }
  ],

  "transfers": [
    {
      "transfer_date": "2026-04-15",
      "pickup_time": "06:00",
      "transfer_type": "Airport Transfer",
      "detail": "Hotel to airport",
      "pickup_location": "Chaweng Beach Resort",
      "drop_location": "Samui Airport (USM)",
      "flight": "PG512",
      "flight_time": "09:15",
      "province": "สุราษฎร์ธานี",
      "phone_number": "081-234-5678",
      "note": ""
    }
  ]
}
```

> ส่ง `tours` หรือ `transfers` หรือทั้งสองอย่างก็ได้ แต่ต้องมีอย่างน้อย 1 อย่าง

---

## Fields Reference

### Booking (ข้อมูลหลัก)

| Field      | Type    | Required | Description                |
| ---------- | ------- | -------- | -------------------------- |
| first_name | string  | **YES**  | ชื่อลูกค้า                 |
| last_name  | string  | **YES**  | นามสกุลลูกค้า              |
| agent_name | string  | **YES**  | ใส่ `"sayhitransfer"` เสมอ |
| pax_adt    | integer | no       | จำนวนผู้ใหญ่               |
| pax_chd    | integer | no       | จำนวนเด็ก                  |
| pax_inf    | integer | no       | จำนวนทารก                  |
| start_date | string  | no       | วันเริ่ม (YYYY-MM-DD)      |
| end_date   | string  | no       | วันสิ้นสุด (YYYY-MM-DD)    |
| note       | string  | no       | หมายเหตุ                   |
| tours      | array   | \*       | รายการ Tour                |
| transfers  | array   | \*       | รายการ Transfer            |

> \* ต้องมี `tours` หรือ `transfers` อย่างน้อย 1 รายการ

### Tour Object (แต่ละรายการใน `tours`)

| Field       | Type   | Required | Description              |
| ----------- | ------ | -------- | ------------------------ |
| tour_date   | string | **YES**  | วันที่ทัวร์ (YYYY-MM-DD) |
| pickup_time | string | no       | เวลารับ (เช่น "08:00")   |
| tour_type   | string | no       | ประเภททัวร์              |
| detail      | string | no       | รายละเอียด               |
| hotel       | string | no       | ชื่อโรงแรม               |
| room_no     | string | no       | เลขห้อง                  |
| contact_no  | string | no       | เบอร์ติดต่อ              |
| province    | string | no       | จังหวัด                  |
| note        | string | no       | หมายเหตุ                 |

### Transfer Object (แต่ละรายการใน `transfers`)

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| transfer_date   | string | **YES**  | วันที่ (YYYY-MM-DD)              |
| pickup_time     | string | no       | เวลารับ (เช่น "06:00")           |
| transfer_type   | string | no       | ประเภท (เช่น "Airport Transfer") |
| detail          | string | no       | รายละเอียด                       |
| pickup_location | string | no       | จุดรับ                           |
| drop_location   | string | no       | จุดส่ง                           |
| flight          | string | no       | เลขเที่ยวบิน                     |
| flight_time     | string | no       | เวลาบิน                          |
| province        | string | no       | จังหวัด                          |
| phone_number    | string | no       | เบอร์โทร                         |
| note            | string | no       | หมายเหตุ                         |

---

## Responses

### Success (201)

```json
{
  "success": true,
  "reference_id": "TP-20260415-001",
  "booking_id": 123,
  "message": "Booking created successfully"
}
```

> `reference_id` สามารถแสดงให้ลูกค้าเก็บไว้เป็นหมายเลขอ้างอิงได้

### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    "first_name is required",
    "At least one tour or transfer is required"
  ]
}
```

### Unauthorized (401)

```json
{
  "error": "Unauthorized"
}
```

### Server Error (500)

```json
{
  "error": "Failed to create booking: ..."
}
```

---

## ตัวอย่างการเรียก

### Transfer อย่างเดียว

```json
{
  "first_name": "Anna",
  "last_name": "Mueller",
  "agent_name": "sayhitransfer",
  "pax_adt": 2,
  "pax_chd": 0,
  "pax_inf": 1,
  "transfers": [
    {
      "transfer_date": "2026-04-20",
      "pickup_time": "10:00",
      "transfer_type": "Airport Transfer",
      "pickup_location": "Samui Airport (USM)",
      "drop_location": "Banyan Tree Samui",
      "flight": "PG141",
      "flight_time": "09:30",
      "phone_number": "082-345-6789"
    }
  ]
}
```

### Tour อย่างเดียว

```json
{
  "first_name": "James",
  "last_name": "Smith",
  "agent_name": "sayhitransfer",
  "pax_adt": 2,
  "pax_chd": 1,
  "pax_inf": 0,
  "tours": [
    {
      "tour_date": "2026-04-22",
      "pickup_time": "08:00",
      "tour_type": "Snorkeling Trip",
      "detail": "Full day - Koh Tao & Koh Nang Yuan",
      "hotel": "Chaweng Regent Beach Resort",
      "room_no": "205",
      "contact_no": "081-234-5678"
    }
  ]
}
```

### Tour + Transfer รวมกัน

```json
{
  "first_name": "Maria",
  "last_name": "Garcia",
  "agent_name": "sayhitransfer",
  "pax_adt": 3,
  "pax_chd": 0,
  "pax_inf": 0,
  "start_date": "2026-04-25",
  "end_date": "2026-04-27",
  "note": "Group of friends",
  "tours": [
    {
      "tour_date": "2026-04-25",
      "pickup_time": "07:30",
      "tour_type": "Island Hopping",
      "hotel": "Samui Palm Beach Resort"
    },
    {
      "tour_date": "2026-04-26",
      "pickup_time": "16:30",
      "tour_type": "Sunset Cruise",
      "hotel": "Samui Palm Beach Resort"
    }
  ],
  "transfers": [
    {
      "transfer_date": "2026-04-27",
      "pickup_time": "06:00",
      "transfer_type": "Airport Transfer",
      "pickup_location": "Samui Palm Beach Resort",
      "drop_location": "Samui Airport (USM)",
      "flight": "PG512",
      "flight_time": "09:15"
    }
  ]
}
```
