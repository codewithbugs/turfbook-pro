# TurfBook Pro — Backend Development Guide

## Overview

This document outlines how to build a production backend for TurfBook Pro. The frontend is currently a fully functional React SPA with mock data and Auth0 integration ready. The backend needs to replace the in-memory store with persistent APIs.

---

## Recommended Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Node.js 20+ with TypeScript | Same language as frontend, shared types |
| **Framework** | Express.js or Fastify | Mature, well-documented, large ecosystem |
| **Database** | PostgreSQL | Relational data (users, turfs, bookings), ACID compliance |
| **ORM** | Prisma or Drizzle ORM | Type-safe queries, migrations, excellent DX |
| **Auth** | Auth0 (JWT verification) | Already integrated on frontend |
| **File Storage** | AWS S3 / Cloudinary | Turf images, user avatars |
| **Cache** | Redis | Session caching, slot availability cache |
| **Search** | PostgreSQL full-text or Elasticsearch | City/turf search with filters |
| **Payments** | Razorpay / Stripe India | Real payment processing |
| **Email/SMS** | SendGrid + Twilio / MSG91 | Booking confirmations, OTP |
| **Deployment** | Railway / Render / AWS ECS | Easy Node.js deployment |

---

## Database Schema (PostgreSQL + Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  OWNER
  ADMIN
}

enum SportType {
  CRICKET
  FOOTBALL
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum TurfApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  CHANGES_REQUESTED
}

model User {
  id        String   @id @default(cuid())
  auth0Id   String   @unique // Auth0 sub claim
  name      String
  email     String   @unique
  phone     String?
  role      UserRole @default(USER)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  bookings      Booking[]
  ownedTurfs    Turf[]        @relation("TurfOwner")
  blockedSlots  BlockedSlot[]

  @@index([auth0Id])
  @@index([email])
}

model City {
  id        String @id @default(cuid())
  name      String @unique
  state     String
  imageUrl  String?
  turfs     Turf[]
}

model Turf {
  id              String              @id @default(cuid())
  name            String
  address         String
  cityId          String
  city            City                @relation(fields: [cityId], references: [id])
  sports          SportType[]
  pricePerHour    Int                 // in paisa (₹1500 = 150000)
  rating          Float               @default(0)
  reviewCount     Int                 @default(0)
  imageUrls       String[]
  amenities       String[]
  openTime        String              // "06:00"
  closeTime       String              // "23:00"
  featured        Boolean             @default(false)
  ownerId         String
  owner           User                @relation("TurfOwner", fields: [ownerId], references: [id])
  approvalStatus  TurfApprovalStatus  @default(PENDING)
  adminComment    String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  // Relations
  bookings      Booking[]
  blockedSlots  BlockedSlot[]

  @@index([cityId])
  @@index([ownerId])
  @@index([approvalStatus])
}

model Booking {
  id            String        @id @default(cuid())
  turfId        String
  turf          Turf          @relation(fields: [turfId], references: [id])
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  date          DateTime      @db.Date
  slots         String[]      // ["slot-18", "slot-19"]
  sport         SportType
  totalAmount   Int           // in paisa
  status        BookingStatus @default(PENDING)
  paymentId     String?       // Razorpay/Stripe payment ID
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([turfId, date])
  @@index([userId])
  @@index([status])
}

model BlockedSlot {
  id        String   @id @default(cuid())
  turfId    String
  turf      Turf     @relation(fields: [turfId], references: [id])
  date      DateTime @db.Date
  slotIds   String[]
  reason    String
  blockedBy String
  user      User     @relation(fields: [blockedBy], references: [id])
  createdAt DateTime @default(now())

  @@index([turfId, date])
}
```

---

## API Endpoints

### Authentication (handled by Auth0)

Auth0 handles all authentication. The backend only verifies JWTs.

```
Middleware: verifyJwt() — validates Auth0 JWT on every protected request
Middleware: requireRole('admin') — checks role claim from JWT
```

### Public Endpoints (no auth required)

```
GET    /api/cities                        — List all cities with turf counts
GET    /api/turfs                         — List approved turfs (with filters: city, sport, price range, search)
GET    /api/turfs/:id                     — Get turf details
GET    /api/turfs/:id/slots?date=YYYY-MM-DD — Get available slots for a date
```

### User Endpoints (auth required, role: USER)

```
GET    /api/me                            — Get current user profile
PATCH  /api/me                            — Update profile (name, phone)
GET    /api/me/bookings                   — List user's bookings
POST   /api/bookings                      — Create a new booking
POST   /api/bookings/:id/cancel           — Cancel a booking
```

### Owner Endpoints (auth required, role: OWNER)

```
GET    /api/owner/turfs                   — List owner's turfs
POST   /api/owner/turfs                   — Submit new turf (status: PENDING)
PATCH  /api/owner/turfs/:id               — Update turf (resets to PENDING)
DELETE /api/owner/turfs/:id               — Delete own turf

GET    /api/owner/bookings                — Bookings for owner's turfs
PATCH  /api/owner/bookings/:id/status     — Confirm or cancel a booking

GET    /api/owner/turfs/:id/blocked-slots — Get blocked slots
POST   /api/owner/turfs/:id/block-slots   — Block time slots
DELETE /api/owner/blocked-slots/:id       — Unblock slots

GET    /api/owner/analytics               — Revenue, booking stats, charts data
```

### Admin Endpoints (auth required, role: ADMIN)

```
GET    /api/admin/turfs                   — All turfs (with approval filter)
PATCH  /api/admin/turfs/:id/approve       — Approve a turf
PATCH  /api/admin/turfs/:id/reject        — Reject with comment
PATCH  /api/admin/turfs/:id/request-changes — Request changes with comment
DELETE /api/admin/turfs/:id               — Delete any turf

GET    /api/admin/bookings                — All bookings across platform
GET    /api/admin/users                   — All users with role filter
PATCH  /api/admin/users/:id/role          — Change user role
PATCH  /api/admin/users/:id/status        — Activate/deactivate user

GET    /api/admin/analytics               — Platform-wide analytics
GET    /api/admin/settings                — Get platform settings
PATCH  /api/admin/settings                — Update platform settings
```

---

## Auth0 Setup Guide

### 1. Create Auth0 Application

1. Sign up at [auth0.com](https://auth0.com)
2. Create a new **Single Page Application**
3. Set Allowed Callback URLs: `http://localhost:8080, https://yourdomain.com`
4. Set Allowed Logout URLs: `http://localhost:8080, https://yourdomain.com`
5. Set Allowed Web Origins: `http://localhost:8080, https://yourdomain.com`

### 2. Enable Connections

In Auth0 Dashboard → Authentication → Social:
- **Google** — Enable Google OAuth2
- **SMS** — Enable passwordless SMS (Twilio)
- **Email** — Enable email/password (default Database connection)

### 3. Create API

1. Go to Applications → APIs → Create API
2. Set Identifier: `https://api.turfbook.in`
3. Set Signing Algorithm: RS256

### 4. Set Up Roles (Auth0 Actions)

Create a **Post Login Action** to attach roles to the JWT:

```javascript
// Auth0 Action: Add Roles to Token
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://turfbook.in/roles';

  // Get roles from user metadata or Auth0 roles
  const roles = event.authorization?.roles || ['user'];

  api.idToken.setCustomClaim(namespace, roles);
  api.accessToken.setCustomClaim(namespace, roles);
};
```

### 5. Frontend Configuration

Copy `.env.example` to `.env` and fill in:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.turfbook.in
```

---

## Backend JWT Verification

```typescript
// middleware/auth.ts
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const verifyJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export const requireRole = (...roles: string[]) => {
  return (req, res, next) => {
    const userRoles = req.auth?.['https://turfbook.in/roles'] || [];
    if (!roles.some(role => userRoles.includes(role))) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

---

## Key Implementation Notes

### 1. Slot Availability

Slots should be computed dynamically, not stored:

```typescript
function getAvailableSlots(turfId: string, date: Date) {
  const turf = await prisma.turf.findUnique({ where: { id: turfId } });
  const bookings = await prisma.booking.findMany({
    where: { turfId, date, status: { in: ['CONFIRMED', 'PENDING'] } },
  });
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: { turfId, date },
  });

  const bookedSlotIds = new Set(bookings.flatMap(b => b.slots));
  const blockedSlotIds = new Set(blockedSlots.flatMap(b => b.slotIds));

  // Generate hourly slots from openTime to closeTime
  const slots = [];
  for (let hour = parseHour(turf.openTime); hour < parseHour(turf.closeTime); hour++) {
    const slotId = `slot-${hour}`;
    slots.push({
      id: slotId,
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: !bookedSlotIds.has(slotId) && !blockedSlotIds.has(slotId),
      price: turf.pricePerHour,
      blockedByOwner: blockedSlotIds.has(slotId),
    });
  }
  return slots;
}
```

### 2. Booking Flow (Race Condition Prevention)

Use database transactions with row-level locking:

```typescript
async function createBooking(data) {
  return prisma.$transaction(async (tx) => {
    // Lock the booking rows for this turf+date
    const existingBookings = await tx.$queryRaw`
      SELECT slots FROM "Booking"
      WHERE "turfId" = ${data.turfId}
        AND date = ${data.date}
        AND status IN ('CONFIRMED', 'PENDING')
      FOR UPDATE
    `;

    const bookedSlots = new Set(existingBookings.flatMap(b => b.slots));
    const conflict = data.slots.some(s => bookedSlots.has(s));

    if (conflict) {
      throw new Error('One or more slots are no longer available');
    }

    return tx.booking.create({ data });
  });
}
```

### 3. Payment Integration (Razorpay)

```typescript
// POST /api/bookings — Create order + booking
async function createBookingWithPayment(req, res) {
  // 1. Validate slots availability
  // 2. Create Razorpay order
  const order = await razorpay.orders.create({
    amount: totalAmount, // in paisa
    currency: 'INR',
    receipt: `booking_${Date.now()}`,
  });

  // 3. Create booking with PENDING status
  const booking = await prisma.booking.create({
    data: { ...bookingData, status: 'PENDING', paymentId: order.id },
  });

  // 4. Return order details to frontend
  res.json({ booking, razorpayOrderId: order.id });
}

// POST /api/bookings/:id/verify-payment — Verify Razorpay signature
async function verifyPayment(req, res) {
  const { razorpay_payment_id, razorpay_signature } = req.body;
  // Verify signature
  // Update booking status to CONFIRMED
}
```

### 4. Real-time Updates (Optional)

For live slot availability and booking notifications:

```typescript
// Use Socket.io or Server-Sent Events
io.on('connection', (socket) => {
  socket.on('watch-turf', (turfId) => {
    socket.join(`turf:${turfId}`);
  });
});

// When a booking is created
io.to(`turf:${booking.turfId}`).emit('slot-booked', {
  date: booking.date,
  slots: booking.slots,
});
```

---

## Project Structure (Backend)

```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/
│   │   ├── public.ts         # Public endpoints (turfs, cities)
│   │   ├── user.ts           # User endpoints (bookings, profile)
│   │   ├── owner.ts          # Owner endpoints (CRUD turfs, slots)
│   │   └── admin.ts          # Admin endpoints (approvals, users)
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification + role checks
│   │   ├── validation.ts     # Zod request validation
│   │   └── errorHandler.ts   # Global error handler
│   ├── services/
│   │   ├── turf.service.ts   # Turf business logic
│   │   ├── booking.service.ts # Booking + payment logic
│   │   ├── user.service.ts   # User management
│   │   └── analytics.service.ts
│   ├── utils/
│   │   ├── slots.ts          # Slot generation + availability
│   │   └── discount.ts       # Discount calculation
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts           # Seed data
├── package.json
├── tsconfig.json
└── .env
```

---

## Migration Steps (Frontend → Backend)

1. **Set up backend project** with Express + Prisma + Auth0 middleware
2. **Run database migrations** — `npx prisma migrate dev`
3. **Seed initial data** — cities, demo turfs, demo users
4. **Replace `store.ts` calls** in frontend with API calls using React Query:

```typescript
// Before (mock):
const turfs = store.getApprovedTurfs();

// After (API):
const { data: turfs } = useQuery({
  queryKey: ['turfs', filters],
  queryFn: () => fetch('/api/turfs?' + params).then(r => r.json()),
});
```

5. **Add Auth0 access token** to API requests:

```typescript
const { getAccessTokenSilently } = useAuth0();

const fetchWithAuth = async (url: string) => {
  const token = await getAccessTokenSilently();
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
```

6. **Replace mock login** — remove `mockLogin()` calls, use Auth0 redirect flow
7. **Integrate Razorpay** — replace simulated payment with real checkout
8. **Deploy** — backend to Railway/Render, frontend to Vercel/Netlify

---

## Environment Variables (Backend)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/turfbook

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.turfbook.in

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Email/SMS
SENDGRID_API_KEY=xxx
TWILIO_SID=xxx
TWILIO_AUTH_TOKEN=xxx

# File Storage
AWS_S3_BUCKET=turfbook-images
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

---

## Testing Strategy

| Layer | Tool | What to test |
|-------|------|-------------|
| Unit tests | Vitest/Jest | Services, utility functions, discount logic |
| API tests | Supertest | All endpoints, auth middleware, validation |
| Integration | Prisma + test DB | Database queries, transactions, race conditions |
| E2E | Playwright/Cypress | Full user flows (browse → book → pay → confirm) |

---

## Deployment Checklist

- [ ] Set up PostgreSQL database (Supabase / Neon / RDS)
- [ ] Configure Auth0 production tenant
- [ ] Set up Razorpay production keys
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting (express-rate-limit)
- [ ] Enable request logging (morgan / pino)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure SSL certificates
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Run database migrations in production
- [ ] Seed production data (cities at minimum)
