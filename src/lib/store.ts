import { Turf, Booking, TimeSlot } from './types';
import { turfs as initialTurfs, cities as initialCities, generateTimeSlots, calculateDiscount } from './data';

// Extended types for admin functionality
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface BookingWithDetails extends Booking {
  turfName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

// Store state
interface StoreState {
  turfs: Turf[];
  bookings: BookingWithDetails[];
  currentUser: User | null;
  isAuthenticated: boolean;
}

// Initial mock bookings with details
const mockBookings: BookingWithDetails[] = [
  {
    id: 'booking-1',
    turfId: 'turf-1',
    userId: 'user-1',
    date: '2024-12-10',
    slots: ['slot-18', 'slot-19'],
    sport: 'football',
    totalAmount: 2700,
    status: 'confirmed',
    createdAt: '2024-12-08T10:30:00Z',
    turfName: 'Green Arena Sports Complex',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
  },
  {
    id: 'booking-2',
    turfId: 'turf-2',
    userId: 'user-2',
    date: '2024-12-11',
    slots: ['slot-9', 'slot-10', 'slot-11'],
    sport: 'football',
    totalAmount: 4590,
    status: 'pending',
    createdAt: '2024-12-08T14:15:00Z',
    turfName: 'Premier Turf Club',
    customerName: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 87654 32109',
  },
  {
    id: 'booking-3',
    turfId: 'turf-3',
    userId: 'user-3',
    date: '2024-12-12',
    slots: ['slot-10', 'slot-11'],
    sport: 'cricket',
    totalAmount: 3600,
    status: 'confirmed',
    createdAt: '2024-12-07T09:00:00Z',
    turfName: 'Cricket Pitch Pro',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 76543 21098',
  },
  {
    id: 'booking-4',
    turfId: 'turf-4',
    userId: 'user-4',
    date: '2024-12-09',
    slots: ['slot-17', 'slot-18', 'slot-19', 'slot-20'],
    sport: 'football',
    totalAmount: 5120,
    status: 'completed',
    createdAt: '2024-12-05T16:45:00Z',
    turfName: 'Sports Hub Bangalore',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha@example.com',
    customerPhone: '+91 65432 10987',
  },
  {
    id: 'booking-5',
    turfId: 'turf-1',
    userId: 'user-5',
    date: '2024-12-08',
    slots: ['slot-6', 'slot-7'],
    sport: 'cricket',
    totalAmount: 2700,
    status: 'cancelled',
    createdAt: '2024-12-04T11:20:00Z',
    turfName: 'Green Arena Sports Complex',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@example.com',
    customerPhone: '+91 54321 09876',
  },
];

// Simple in-memory store (without backend)
class Store {
  private state: StoreState = {
    turfs: [...initialTurfs],
    bookings: [...mockBookings],
    currentUser: null,
    isAuthenticated: false,
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

  // Auth methods
  login(email: string, password: string): { success: boolean; error?: string } {
    // Mock authentication
    if (email && password.length >= 6) {
      const isAdmin = email.includes('admin');
      this.state = {
        ...this.state,
        currentUser: {
          id: 'user-' + Date.now(),
          name: isAdmin ? 'Admin User' : 'John Doe',
          email,
          phone: '+91 98765 43210',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
      };
      this.notify();
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  register(name: string, email: string, phone: string, password: string): { success: boolean; error?: string } {
    if (name && email && phone && password.length >= 6) {
      this.state = {
        ...this.state,
        currentUser: {
          id: 'user-' + Date.now(),
          name,
          email,
          phone,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
      };
      this.notify();
      return { success: true };
    }
    return { success: false, error: 'Please fill all fields correctly' };
  }

  logout() {
    this.state = {
      ...this.state,
      currentUser: null,
      isAuthenticated: false,
    };
    this.notify();
  }

  // Turf methods
  getTurfs() {
    return this.state.turfs;
  }

  getTurfById(id: string) {
    return this.state.turfs.find((t) => t.id === id);
  }

  addTurf(turf: Omit<Turf, 'id'>) {
    const newTurf: Turf = {
      ...turf,
      id: 'turf-' + Date.now(),
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
        t.id === id ? { ...t, ...updates } : t
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

  // Booking methods
  getBookings() {
    return this.state.bookings;
  }

  getUserBookings(userId: string) {
    return this.state.bookings.filter((b) => b.userId === userId);
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

  updateBookingStatus(id: string, status: Booking['status']) {
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
}

export const store = new Store();

import { useState, useEffect } from 'react';

// Custom hook for using store
export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getState()));
    return () => { unsubscribe(); };
  }, []);

  return state;
}
