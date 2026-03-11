# TurfBookKaro - API Documentation

## Overview

This document describes the REST API that needs to be built for the TurfBookKaro backend. The frontend currently uses mock data and an in-memory store. This API specification covers all endpoints needed to make the application fully functional.

**Base URL:** `https://api.turfbookkaro.in/v1`

**Authentication:** JWT Bearer tokens via Auth0 or custom authentication.

**Content-Type:** `application/json`

---

## Authentication

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-1",
    "name": "Rahul Sharma",
    "email": "user@example.com",
    "phone": "+91 98765 43210",
    "role": "user",
    "avatar": "https://...",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "password": "securepassword",
  "role": "user"  // "user" or "owner"
}
```

**Response (201):** Same as login response.

### POST /auth/forgot-password
Request password reset.

**Request:** `{ "email": "user@example.com" }`

**Response (200):** `{ "message": "Reset link sent to email" }`

### POST /auth/reset-password
Reset password with token.

**Request:** `{ "token": "reset-token", "password": "newpassword" }`

**Response (200):** `{ "message": "Password updated successfully" }`

### POST /auth/google
OAuth login with Google.

**Request:** `{ "idToken": "google-id-token" }`

**Response (200):** Same as login response.

### POST /auth/phone
OTP-based phone login.

**Request (Step 1):** `{ "phone": "+91 98765 43210" }`
**Response:** `{ "otpSent": true }`

**Request (Step 2):** `{ "phone": "+91 98765 43210", "otp": "123456" }`
**Response:** Same as login response.

---

## Users

### GET /users/me
Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "user-1",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "role": "user",
  "avatar": "https://...",
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### PUT /users/me
Update current user profile.

### GET /users (Admin only)
List all users with pagination and filtering.

**Query Params:** `?page=1&limit=20&role=user&search=rahul`

**Response (200):**
```json
{
  "users": [...],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### PUT /users/:id/role (Admin only)
Update user role.

**Request:** `{ "role": "owner" }`

### PUT /users/:id/status (Admin only)
Activate/deactivate user.

**Request:** `{ "status": "active" }` or `{ "status": "inactive" }`

---

## Cities

### GET /cities
List all available cities.

**Response (200):**
```json
{
  "cities": [
    { "id": "mumbai", "name": "Mumbai", "turfCount": 24, "imageUrl": "https://..." }
  ]
}
```

---

## Turfs

### GET /turfs
List turfs with filtering, sorting, and pagination.

**Query Params:**
- `city` - Filter by city name
- `sport` - Filter by sport type ("cricket" or "football")
- `search` - Search by name or address
- `minPrice` / `maxPrice` - Price range filter
- `sortBy` - "rating", "price_asc", "price_desc", "reviews"
- `page` / `limit` - Pagination
- `featured` - Boolean to filter featured turfs
- `status` - Approval status (admin/owner only): "pending", "approved", "rejected", "changes_requested"

**Response (200):**
```json
{
  "turfs": [
    {
      "id": "turf-1",
      "name": "Green Arena Sports Complex",
      "city": "Mumbai",
      "address": "Andheri West, Mumbai",
      "sports": ["football", "cricket"],
      "pricePerHour": 1500,
      "rating": 4.8,
      "reviewCount": 234,
      "imageUrl": "https://...",
      "amenities": ["Floodlights", "Parking", "Changing Rooms"],
      "openTime": "06:00",
      "closeTime": "23:00",
      "featured": true,
      "ownerId": "owner-1",
      "approvalStatus": "approved",
      "description": "Premium multi-sport turf...",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-06-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### GET /turfs/:id
Get single turf details.

### POST /turfs (Owner only)
Create a new turf (submitted for admin approval).

**Request:**
```json
{
  "name": "My Sports Arena",
  "city": "Mumbai",
  "address": "Andheri East, Mumbai",
  "sports": ["football"],
  "pricePerHour": 1500,
  "amenities": ["Floodlights", "Parking"],
  "openTime": "06:00",
  "closeTime": "22:00",
  "description": "Great venue for football..."
}
```

**Response (201):** Created turf object with `approvalStatus: "pending"`.

### PUT /turfs/:id (Owner only)
Update turf details. Resets approval to "pending".

### DELETE /turfs/:id (Owner/Admin)
Delete a turf.

### PUT /turfs/:id/approve (Admin only)
Approve a turf.

**Response (200):** Updated turf with `approvalStatus: "approved"`.

### PUT /turfs/:id/reject (Admin only)
Reject a turf with comment.

**Request:** `{ "comment": "Reason for rejection" }`

### PUT /turfs/:id/request-changes (Admin only)
Request changes on a turf.

**Request:** `{ "comment": "Please update the address and add more photos" }`

### GET /turfs/:id/owner (Owner only)
Get turfs owned by the authenticated owner.

---

## Time Slots

### GET /turfs/:id/slots
Get available time slots for a turf on a specific date.

**Query Params:** `?date=2026-03-15`

**Response (200):**
```json
{
  "slots": [
    {
      "id": "slot-6",
      "time": "06:00",
      "available": true,
      "price": 1500,
      "blockedByOwner": false
    },
    {
      "id": "slot-7",
      "time": "07:00",
      "available": false,
      "price": 1500,
      "blockedByOwner": false
    }
  ]
}
```

### POST /turfs/:id/slots/block (Owner only)
Block time slots for manual bookings or maintenance.

**Request:**
```json
{
  "date": "2026-03-15",
  "slotIds": ["slot-10", "slot-11"],
  "reason": "Manual booking for walk-in customer"
}
```

### DELETE /turfs/:id/slots/block/:blockId (Owner only)
Unblock previously blocked slots.

---

## Bookings

### GET /bookings
Get bookings based on role:
- **Users:** their own bookings
- **Owners:** bookings for their turfs
- **Admins:** all bookings

**Query Params:**
- `status` - Filter by status
- `search` - Search by customer name, turf name, booking ID
- `dateFrom` / `dateTo` - Date range
- `page` / `limit` - Pagination

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "booking-1",
      "turfId": "turf-1",
      "userId": "user-1",
      "date": "2026-03-15",
      "slots": ["slot-18", "slot-19"],
      "sport": "football",
      "totalAmount": 2700,
      "status": "confirmed",
      "createdAt": "2026-03-10T10:30:00Z",
      "turfName": "Green Arena Sports Complex",
      "customerName": "Rahul Sharma",
      "customerEmail": "rahul@example.com",
      "customerPhone": "+91 98765 43210"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### GET /bookings/:id
Get single booking details.

### POST /bookings
Create a new booking.

**Request:**
```json
{
  "turfId": "turf-1",
  "date": "2026-03-15",
  "slots": ["slot-18", "slot-19"],
  "sport": "football",
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com",
  "customerPhone": "+91 98765 43210",
  "paymentMethod": "upi",
  "paymentDetails": { "upiId": "rahul@upi" }
}
```

**Response (201):**
```json
{
  "booking": { ... },
  "paymentId": "pay_xxx",
  "bookingId": "TRF12345678"
}
```

### PUT /bookings/:id/status (Owner/Admin)
Update booking status.

**Request:** `{ "status": "confirmed" }` or `{ "status": "cancelled" }`

### PUT /bookings/:id/cancel
Cancel a booking (available to user, owner, or admin).

### POST /bookings/batch/confirm (Owner only)
Batch confirm multiple bookings.

**Request:** `{ "bookingIds": ["booking-1", "booking-2"] }`

### POST /bookings/batch/cancel (Owner only)
Batch cancel multiple bookings.

**Request:** `{ "bookingIds": ["booking-3", "booking-4"] }`

---

## Notifications

### GET /notifications
Get notifications for the authenticated user.

**Query Params:** `?unread=true&page=1&limit=20`

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notif-1",
      "title": "Booking Confirmed",
      "message": "Your booking at Green Arena has been confirmed.",
      "type": "booking",
      "read": false,
      "createdAt": "2026-03-10T10:30:00Z",
      "link": "/bookings"
    }
  ],
  "unreadCount": 3,
  "total": 15
}
```

### PUT /notifications/:id/read
Mark a notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

---

## Payments

### POST /payments/initiate
Initiate a payment for a booking.

**Request:**
```json
{
  "bookingId": "booking-1",
  "amount": 2700,
  "method": "upi",
  "details": { "upiId": "name@bank" }
}
```

**Response (200):**
```json
{
  "paymentId": "pay_xxx",
  "status": "processing",
  "redirectUrl": "https://payment-gateway.com/..."
}
```

### GET /payments/:id/status
Check payment status.

### POST /payments/:id/verify
Verify payment completion (webhook or callback).

---

## Analytics (Admin only)

### GET /analytics/overview
Get platform analytics overview.

**Query Params:** `?period=7d` (7d, 30d, 90d, 1y)

**Response (200):**
```json
{
  "totalRevenue": 1250000,
  "totalBookings": 850,
  "averageBookingValue": 1470,
  "conversionRate": 68,
  "growthRate": 15,
  "revenueByDay": [
    { "date": "2026-03-04", "revenue": 45000 },
    { "date": "2026-03-05", "revenue": 52000 }
  ],
  "bookingsByCity": [
    { "city": "Mumbai", "count": 245 },
    { "city": "Bangalore", "count": 198 }
  ],
  "bookingsBySport": [
    { "sport": "Football", "count": 520 },
    { "sport": "Cricket", "count": 330 }
  ],
  "peakHours": [
    { "hour": 18, "bookings": 125 },
    { "hour": 19, "bookings": 140 }
  ],
  "topTurfs": [
    {
      "id": "turf-5",
      "name": "Elite Football Arena",
      "bookings": 145,
      "revenue": 319000,
      "rating": 4.9
    }
  ]
}
```

### GET /analytics/revenue
Detailed revenue analytics.

### GET /analytics/bookings
Detailed booking analytics.

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": [
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `409` - Conflict (e.g., slot already booked)
- `429` - Rate Limited
- `500` - Internal Server Error

---

## Rate Limiting

- Standard endpoints: 100 requests/minute per user
- Auth endpoints: 10 requests/minute per IP
- Payment endpoints: 20 requests/minute per user

---

## WebSocket Events (Future)

For real-time notifications:

```
ws://api.turfbookkaro.in/ws?token=jwt-token
```

Events:
- `booking:created` - New booking notification
- `booking:confirmed` - Booking confirmed
- `booking:cancelled` - Booking cancelled
- `turf:approved` - Turf approved by admin
- `turf:rejected` - Turf rejected by admin
- `notification:new` - New notification

---

## Tech Stack Recommendations

- **Runtime:** Node.js with Express or Fastify
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Auth0 or Passport.js with JWT
- **Payment Gateway:** Razorpay or Cashfree
- **File Storage:** AWS S3 or Cloudinary (for turf images)
- **Cache:** Redis (for session management, slot availability)
- **Queue:** BullMQ (for async notification delivery)
- **Deployment:** AWS/GCP with Docker containers
