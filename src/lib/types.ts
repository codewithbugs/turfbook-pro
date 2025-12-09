export interface Turf {
  id: string;
  name: string;
  city: string;
  address: string;
  sports: ('cricket' | 'football')[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  amenities: string[];
  openTime: string;
  closeTime: string;
  featured?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  date: string;
  slots: string[];
  sport: 'cricket' | 'football';
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  turfCount: number;
  imageUrl: string;
}
