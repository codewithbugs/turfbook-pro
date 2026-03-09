export type UserRole = 'user' | 'owner' | 'admin';
export type SportType = 'cricket' | 'football';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type TurfApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Turf {
  id: string;
  name: string;
  city: string;
  address: string;
  sports: SportType[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  amenities: string[];
  openTime: string;
  closeTime: string;
  featured?: boolean;
  ownerId: string;
  approvalStatus: TurfApprovalStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
  blockedByOwner?: boolean;
  blockedReason?: string;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  date: string;
  slots: string[];
  sport: SportType;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingWithDetails extends Booking {
  turfName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface City {
  id: string;
  name: string;
  turfCount: number;
  imageUrl: string;
}

export interface BlockedSlot {
  id: string;
  turfId: string;
  date: string;
  slotIds: string[];
  reason: string;
  createdAt: string;
}
