# TurfBookKaro - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Guide](#setup-guide)
3. [Architecture](#architecture)
4. [User Roles & Workflows](#user-roles--workflows)
5. [Navigation Structure](#navigation-structure)
6. [Testing Guide](#testing-guide)
7. [Mock Authentication](#mock-authentication)
8. [Feature Details](#feature-details)

---

## Project Overview

**TurfBookKaro** is India's premier sports turf booking platform. It enables users to discover and book cricket and football turfs across major Indian cities, while providing turf owners with management tools and administrators with platform oversight.

### Key Features

- **Users:** Browse turfs, search/filter by city/sport/price, multi-slot booking with discounts, booking management, notifications
- **Turf Owners:** Add/edit turfs, manage bookings (confirm/reject), block slots manually, view analytics
- **Admins:** Approve/reject turf submissions, manage users, view platform analytics, configure settings

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router DOM v6 |
| State | Custom in-memory store with hooks |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Auth | Auth0 (production) / Mock auth (development) |
| Notifications | Sonner + shadcn Toast |

---

## Setup Guide

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+ or pnpm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd turfbook-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start development server with HMR |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint for code quality |

### Environment Variables (Optional)

For Auth0 integration, create a `.env` file:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.turfbookkaro.in
```

Without these, the app uses mock authentication (recommended for development).

---

## Architecture

### Directory Structure

```
src/
├── assets/          # Static assets (images)
├── components/      # Reusable UI components
│   ├── admin/       # Admin-specific components
│   ├── owner/       # Owner-specific components
│   └── ui/          # shadcn/ui base components
├── hooks/           # Custom React hooks
├── lib/             # Core logic
│   ├── auth-context.tsx  # Authentication provider
│   ├── auth0-config.ts   # Auth0 configuration
│   ├── data.ts           # Mock data (turfs, cities, slots)
│   ├── store.ts          # In-memory state management
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── pages/           # Route page components
│   ├── admin/       # Admin pages
│   └── owner/       # Owner pages
├── App.tsx          # Root component with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

### State Management

The app uses a custom `Store` class (`src/lib/store.ts`) that acts as an in-memory state manager:

- **Turfs:** CRUD operations, approval workflow
- **Bookings:** Create, update status, cancel, batch operations
- **Blocked Slots:** Owner-managed slot blocking
- **Notifications:** In-app notification system

Components subscribe to state changes via the `useStore()` hook, which triggers re-renders when state updates.

### Routing

```
Public Routes:
  /                    → Home page
  /turfs               → Browse turfs
  /turf/:id            → Turf detail & booking
  /auth                → Login / Register

Protected (User):
  /bookings            → My bookings
  /checkout            → Payment page
  /booking-success     → Confirmation page

Protected (Owner):
  /owner               → Owner dashboard
  /owner/turfs         → Manage turfs
  /owner/bookings      → Manage bookings
  /owner/slots         → Slot management

Protected (Admin):
  /admin               → Admin dashboard
  /admin/turfs         → Approve/manage turfs
  /admin/bookings      → View all bookings
  /admin/users         → User management
  /admin/analytics     → Platform analytics
  /admin/settings      → Platform settings
```

---

## User Roles & Workflows

### 1. Regular User (Player)

**Workflow:**
1. Browse turfs on homepage or /turfs page
2. Filter by city, sport, price range
3. Click a turf to view details
4. Select date from calendar
5. Select one or more time slots (multi-slot booking)
6. Review booking summary with discount calculation
7. Proceed to checkout
8. Fill contact details and payment info
9. Complete payment
10. Receive booking confirmation
11. View and manage bookings in "My Bookings"

**Discount Structure:**
- 2+ hours: 10% off
- 3+ hours: 15% off
- 4+ hours: 20% off

### 2. Turf Owner

**Workflow:**
1. Register as owner (role: "owner")
2. Add turf via Owner Dashboard → My Turfs → "Add New Turf"
3. Fill turf details (name, city, address, sports, price, amenities, hours)
4. Turf is submitted with `approvalStatus: "pending"`
5. Wait for admin approval
6. Once approved, turf appears in browse listings
7. View bookings for owned turfs
8. Confirm or reject pending bookings
9. Block slots manually for walk-ins or maintenance
10. View analytics (revenue, booking trends)

**If admin requests changes:**
- Owner sees admin feedback
- Can edit turf and resubmit for approval

### 3. Admin

**Workflow:**
1. Login as admin
2. Dashboard shows platform overview, pending approvals
3. Review and approve/reject/request changes on turf submissions
4. View all bookings across the platform
5. Manage users (view, change roles, deactivate)
6. View platform analytics (revenue, trends, top turfs)
7. Configure platform settings (notifications, booking rules, maintenance mode)

---

## Navigation Structure

### Main Navigation (Navbar)
- **Logo:** TurfBookKaro (links to /)
- **Links:** Home, Browse Turfs, My Bookings (user only)
- **Actions:** City selector, Notifications bell (with unread count), Dashboard button (owner/admin), User dropdown, Book a Turf CTA

### Owner Sidebar
- Dashboard → /owner
- My Turfs → /owner/turfs
- Bookings → /owner/bookings
- Slot Management → /owner/slots
- Exit Dashboard → /

### Admin Sidebar
- Dashboard → /admin
- Manage Turfs → /admin/turfs (with pending count badge)
- Bookings → /admin/bookings
- Users → /admin/users
- Analytics → /admin/analytics
- Settings → /admin/settings
- Exit Admin → /

---

## Testing Guide

### Manual Testing Scenarios

#### Test as a Regular User

1. **Browse & Search:**
   - Visit `/turfs`
   - Test city filter dropdown
   - Test sport filter dropdown
   - Test search by turf name
   - Test price range filter
   - Test sort options (rating, price)
   - Verify "Clear Filters" resets all

2. **Booking Flow:**
   - Click "Book Now" on any turf card
   - On turf detail page, select a future date
   - Select 2+ time slots (verify discount appears)
   - Click "Proceed to Checkout"
   - Fill contact info
   - Select payment method (UPI/Card/Net Banking)
   - Complete payment
   - Verify success page shows correct details
   - Check booking appears in "My Bookings"

3. **Booking Management:**
   - Go to "My Bookings"
   - Verify summary cards show correct counts
   - Test tab filters (All, Upcoming, Completed, Cancelled)
   - Cancel a pending/confirmed booking
   - Click "Book Again" on any booking

#### Test as Turf Owner

1. **Login:** Use email containing "owner" (e.g., `owner@example.com`) with any 6+ char password

2. **Dashboard:**
   - Verify stats cards show correct data
   - Check weekly bookings chart renders
   - Verify recent bookings list

3. **Turf Management:**
   - Go to "My Turfs"
   - Click "Add New Turf"
   - Fill form and submit
   - Verify turf appears with "Pending Approval" badge
   - Edit an existing turf
   - Delete a turf

4. **Booking Management:**
   - Go to "Bookings"
   - Confirm a pending booking
   - Reject/cancel a pending booking
   - Test search and filters

5. **Slot Management:**
   - Go to "Slot Management"
   - Select a turf
   - Select a date
   - Select available slots
   - Block selected slots with a reason
   - Unblock previously blocked slots

#### Test as Admin

1. **Login:** Use email containing "admin" (e.g., `admin@example.com`) with any 6+ char password

2. **Dashboard:**
   - Verify platform stats
   - Check pending turf approval alerts
   - Test quick action buttons

3. **Turf Approval:**
   - Go to "Manage Turfs"
   - Filter by "Pending"
   - Approve a turf (verify it becomes visible to users)
   - Request changes on a turf (add comment)
   - Reject a turf (add reason)

4. **User Management:**
   - Go to "Users"
   - Search for users
   - Filter by role
   - View user details

5. **Analytics:**
   - Go to "Analytics"
   - Test date range filters
   - Verify charts render with data

6. **Settings:**
   - Go to "Settings"
   - Modify settings
   - Save and verify toast notification

### Automated Testing (Future)

Recommended testing setup:

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add to vite.config.ts:
# test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.ts' }

# Run tests
npm run test
```

**Recommended test coverage:**
- Unit tests for `store.ts` (all CRUD operations)
- Unit tests for `calculateDiscount()` and `generateTimeSlots()`
- Component tests for Navbar, TurfCard, BookingCard
- Integration tests for booking flow
- Auth tests for role-based access control

---

## Mock Authentication

The app supports two auth modes:

### 1. Mock Auth (Default - No Auth0 config)

Login via the `/auth` page with any email + password (min 6 chars):

| Email Pattern | Role | Redirects To |
|---------------|------|-------------|
| Contains "admin" (e.g., `admin@test.com`) | Admin | `/admin` |
| Contains "owner" (e.g., `owner@test.com`) | Owner | `/owner` |
| Any other email (e.g., `user@test.com`) | User | `/` |

**Quick test accounts:**
- `admin@turfbookkaro.in` / `password` → Admin
- `owner@turfbookkaro.in` / `password` → Turf Owner
- `rahul@example.com` / `password` → Regular User

Mock auth persists to localStorage as `turfbookkaro_user`.

### 2. Auth0 (Production)

Set environment variables `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`. The app will use real Auth0 login flow with role claims.

---

## Feature Details

### Multi-Slot Booking
Users can select multiple consecutive or non-consecutive time slots. The pricing system automatically calculates discounts based on the number of hours booked. The discount is shown in real-time on the booking summary.

### Notification System
In-app notifications appear in the navbar bell icon. Different notification types (booking, approval, system, info) are visually distinguished. Unread count is shown as a badge.

### Slot Management (Owner)
Owners can block slots for:
- Walk-in/offline bookings
- Maintenance
- Private events
- Any custom reason

Blocked slots appear as unavailable to users on the booking page.

### Turf Approval Workflow
1. Owner submits turf → Status: `pending`
2. Admin reviews → Options: Approve, Reject (with reason), Request Changes (with feedback)
3. If changes requested → Owner edits and resubmits → Back to `pending`
4. If approved → Turf visible to public
5. If rejected → Owner can edit and resubmit

### Platform Analytics (Admin)
- Revenue trends over time
- Booking distribution by city
- Sport popularity comparison
- Peak booking hours
- Top performing turfs by revenue and bookings
