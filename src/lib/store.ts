import { Turf, Booking, BookingWithDetails, TimeSlot, BlockedSlot, User, TurfApprovalStatus, BookingStatus, Notification } from './types';
import { turfs as initialTurfs, generateTimeSlots } from './data';
import { mockLogin } from './auth-context';

// Re-export for backward compat
export type { BookingWithDetails } from './types';

// Store state
interface StoreState {
  turfs: Turf[];
  bookings: BookingWithDetails[];
  blockedSlots: BlockedSlot[];
  notifications: Notification[];
}

// Initial mock bookings with details
const mockBookings: BookingWithDetails[] = [
  {
    id: 'booking-1',
    turfId: 'turf-1',
    userId: 'user-1',
    date: '2026-03-15',
    slots: ['slot-18', 'slot-19'],
    sport: 'football',
    totalAmount: 2700,
    status: 'confirmed',
    createdAt: '2026-03-08T10:30:00Z',
    turfName: 'Green Arena Sports Complex',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
  },
  {
    id: 'booking-2',
    turfId: 'turf-2',
    userId: 'user-2',
    date: '2026-03-18',
    slots: ['slot-9', 'slot-10', 'slot-11'],
    sport: 'football',
    totalAmount: 4590,
    status: 'pending',
    createdAt: '2026-03-08T14:15:00Z',
    turfName: 'Premier Turf Club',
    customerName: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 87654 32109',
  },
  {
    id: 'booking-3',
    turfId: 'turf-3',
    userId: 'user-3',
    date: '2026-03-20',
    slots: ['slot-10', 'slot-11'],
    sport: 'cricket',
    totalAmount: 3600,
    status: 'confirmed',
    createdAt: '2026-03-07T09:00:00Z',
    turfName: 'Cricket Pitch Pro',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 76543 21098',
  },
  {
    id: 'booking-4',
    turfId: 'turf-4',
    userId: 'user-4',
    date: '2026-03-09',
    slots: ['slot-17', 'slot-18', 'slot-19', 'slot-20'],
    sport: 'football',
    totalAmount: 5120,
    status: 'completed',
    createdAt: '2026-03-05T16:45:00Z',
    turfName: 'Sports Hub Bangalore',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha@example.com',
    customerPhone: '+91 65432 10987',
  },
  {
    id: 'booking-5',
    turfId: 'turf-1',
    userId: 'user-5',
    date: '2026-03-08',
    slots: ['slot-6', 'slot-7'],
    sport: 'cricket',
    totalAmount: 2700,
    status: 'cancelled',
    createdAt: '2026-03-04T11:20:00Z',
    turfName: 'Green Arena Sports Complex',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@example.com',
    customerPhone: '+91 54321 09876',
  },
  {
    id: 'booking-6',
    turfId: 'turf-5',
    userId: 'user-6',
    date: '2026-03-22',
    slots: ['slot-14', 'slot-15'],
    sport: 'football',
    totalAmount: 4400,
    status: 'pending',
    createdAt: '2026-03-09T08:30:00Z',
    turfName: 'Elite Football Arena',
    customerName: 'Deepak Nair',
    customerEmail: 'deepak@example.com',
    customerPhone: '+91 91234 56780',
  },
  {
    id: 'booking-7',
    turfId: 'turf-6',
    userId: 'user-7',
    date: '2026-03-16',
    slots: ['slot-8', 'slot-9', 'slot-10'],
    sport: 'cricket',
    totalAmount: 4200,
    status: 'confirmed',
    createdAt: '2026-03-06T12:00:00Z',
    turfName: 'Chennai Cricket Ground',
    customerName: 'Kavitha Rajan',
    customerEmail: 'kavitha@example.com',
    customerPhone: '+91 81234 56789',
  },
  {
    id: 'booking-8',
    turfId: 'turf-7',
    userId: 'user-8',
    date: '2026-03-25',
    slots: ['slot-16', 'slot-17'],
    sport: 'football',
    totalAmount: 3400,
    status: 'pending',
    createdAt: '2026-03-09T17:45:00Z',
    turfName: 'Hyderabad Sports Village',
    customerName: 'Arjun Mehta',
    customerEmail: 'arjun@example.com',
    customerPhone: '+91 72345 67890',
  },
  {
    id: 'booking-9',
    turfId: 'turf-8',
    userId: 'user-9',
    date: '2026-03-07',
    slots: ['slot-18', 'slot-19', 'slot-20'],
    sport: 'football',
    totalAmount: 3900,
    status: 'completed',
    createdAt: '2026-03-02T10:00:00Z',
    turfName: 'Pune Football Club',
    customerName: 'Meera Joshi',
    customerEmail: 'meera@example.com',
    customerPhone: '+91 63456 78901',
  },
  {
    id: 'booking-10',
    turfId: 'turf-10',
    userId: 'user-10',
    date: '2026-03-28',
    slots: ['slot-7', 'slot-8'],
    sport: 'cricket',
    totalAmount: 3800,
    status: 'confirmed',
    createdAt: '2026-03-10T09:15:00Z',
    turfName: 'South Delhi Sports Arena',
    customerName: 'Rohan Gupta',
    customerEmail: 'rohan@example.com',
    customerPhone: '+91 99876 54321',
  },
];

// Initial mock notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed',
    message: 'Your booking at Green Arena Sports Complex on Mar 15 has been confirmed.',
    type: 'booking',
    read: false,
    createdAt: '2026-03-08T10:35:00Z',
    link: '/bookings',
  },
  {
    id: 'notif-2',
    title: 'New Booking Request',
    message: 'Priya Patel has requested a booking at Premier Turf Club for Mar 18. Please review and approve.',
    type: 'booking',
    read: false,
    createdAt: '2026-03-08T14:20:00Z',
    link: '/bookings',
  },
  {
    id: 'notif-3',
    title: 'Turf Approved',
    message: 'Your turf "Hyderabad Sports Village" has been approved by the admin and is now live.',
    type: 'approval',
    read: true,
    createdAt: '2026-03-07T11:00:00Z',
    link: '/owner/turfs',
  },
  {
    id: 'notif-4',
    title: 'Booking Completed',
    message: 'The booking at Sports Hub Bangalore on Mar 9 has been marked as completed. Thank you!',
    type: 'booking',
    read: true,
    createdAt: '2026-03-09T22:00:00Z',
    link: '/bookings',
  },
  {
    id: 'notif-5',
    title: 'Scheduled Maintenance',
    message: 'TurfBookKaro will undergo scheduled maintenance on Mar 30 from 2:00 AM to 4:00 AM IST.',
    type: 'system',
    read: false,
    createdAt: '2026-03-10T06:00:00Z',
  },
  {
    id: 'notif-6',
    title: 'Welcome to TurfBookKaro!',
    message: 'Thanks for joining TurfBookKaro. Explore turfs near you and book your first slot today.',
    type: 'info',
    read: true,
    createdAt: '2026-03-01T00:00:00Z',
    link: '/turfs',
  },
];

// Simple in-memory store
class Store {
  private state: StoreState = {
    turfs: [...initialTurfs],
    bookings: [...mockBookings],
    blockedSlots: [],
    notifications: [...mockNotifications],
  };

  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getState() {
    return this.state;
  }

  // Mock login helper (for demo without Auth0 configured)
  mockLoginAs(role: 'user' | 'owner' | 'admin', name?: string, email?: string) {
    const defaultId = role === 'admin' ? 'admin-1' : role === 'owner' ? 'owner-1' : 'user-1';
    const user: User = {
      id: defaultId,
      name: name || (role === 'admin' ? 'Admin User' : role === 'owner' ? 'Turf Owner' : 'John Doe'),
      email: email || `${role}@turfbookkaro.in`,
      phone: '+91 98765 43210',
      role,
      createdAt: new Date().toISOString(),
    };
    mockLogin(user);
    return user;
  }

  // Turf methods
  getTurfs() {
    return this.state.turfs;
  }

  getApprovedTurfs() {
    return this.state.turfs.filter((t) => t.approvalStatus === 'approved');
  }

  getTurfsByOwner(ownerId: string) {
    return this.state.turfs.filter((t) => t.ownerId === ownerId);
  }

  getPendingTurfs() {
    return this.state.turfs.filter((t) => t.approvalStatus === 'pending');
  }

  getTurfById(id: string) {
    return this.state.turfs.find((t) => t.id === id);
  }

  addTurf(turf: Omit<Turf, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTurf: Turf = {
      ...turf,
      id: 'turf-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    this.state = {
      ...this.state,
      turfs: [...this.state.turfs, newTurf],
    };
    this.notify();
    return newTurf;
  }

  updateTurf(id: string, updates: Partial<Turf>) {
    this.state = {
      ...this.state,
      turfs: this.state.turfs.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    };
    this.notify();
  }

  deleteTurf(id: string) {
    this.state = {
      ...this.state,
      turfs: this.state.turfs.filter((t) => t.id !== id),
    };
    this.notify();
  }

  // Admin turf approval
  approveTurf(id: string) {
    this.updateTurf(id, { approvalStatus: 'approved', adminComment: undefined });
  }

  rejectTurf(id: string, comment: string) {
    this.updateTurf(id, { approvalStatus: 'rejected', adminComment: comment });
  }

  requestChanges(id: string, comment: string) {
    this.updateTurf(id, { approvalStatus: 'changes_requested', adminComment: comment });
  }

  // Booking methods
  getBookings() {
    return this.state.bookings;
  }

  getUserBookings(userId: string) {
    return this.state.bookings.filter((b) => b.userId === userId);
  }

  getBookingsForOwnerTurfs(ownerId: string) {
    const ownerTurfIds = this.getTurfsByOwner(ownerId).map((t) => t.id);
    return this.state.bookings.filter((b) => ownerTurfIds.includes(b.turfId));
  }

  createBooking(booking: Omit<BookingWithDetails, 'id' | 'createdAt'>): BookingWithDetails {
    const newBooking: BookingWithDetails = {
      ...booking,
      id: 'booking-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.state = {
      ...this.state,
      bookings: [...this.state.bookings, newBooking],
    };
    this.notify();
    return newBooking;
  }

  updateBookingStatus(id: string, status: BookingStatus) {
    this.state = {
      ...this.state,
      bookings: this.state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    };
    this.notify();
  }

  cancelBooking(id: string) {
    this.updateBookingStatus(id, 'cancelled');
  }

  // Blocked slots (owner manual booking / slot blocking)
  getBlockedSlots(turfId: string) {
    return this.state.blockedSlots.filter((s) => s.turfId === turfId);
  }

  blockSlots(turfId: string, date: string, slotIds: string[], reason: string) {
    const blocked: BlockedSlot = {
      id: 'block-' + Date.now(),
      turfId,
      date,
      slotIds,
      reason,
      createdAt: new Date().toISOString(),
    };
    this.state = {
      ...this.state,
      blockedSlots: [...this.state.blockedSlots, blocked],
    };
    this.notify();
    return blocked;
  }

  unblockSlots(blockId: string) {
    this.state = {
      ...this.state,
      blockedSlots: this.state.blockedSlots.filter((s) => s.id !== blockId),
    };
    this.notify();
  }

  // Notification methods
  getNotifications() {
    return this.state.notifications;
  }

  getUnreadCount() {
    return this.state.notifications.filter((n) => !n.read).length;
  }

  markAsRead(id: string) {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    };
    this.notify();
  }

  markAllAsRead() {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) => ({ ...n, read: true })),
    };
    this.notify();
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: 'notif-' + Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.state = {
      ...this.state,
      notifications: [newNotification, ...this.state.notifications],
    };
    this.notify();
    return newNotification;
  }
}

export const store = new Store();

import { useState, useEffect } from 'react';

// Custom hook for using store
export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState({ ...store.getState() }));
    return () => { unsubscribe(); };
  }, []);

  return state;
}
