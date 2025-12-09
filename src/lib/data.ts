import { Turf, City, TimeSlot } from './types';

export const cities: City[] = [
  { id: 'mumbai', name: 'Mumbai', turfCount: 24, imageUrl: '/placeholder.svg' },
  { id: 'delhi', name: 'Delhi', turfCount: 18, imageUrl: '/placeholder.svg' },
  { id: 'bangalore', name: 'Bangalore', turfCount: 31, imageUrl: '/placeholder.svg' },
  { id: 'chennai', name: 'Chennai', turfCount: 15, imageUrl: '/placeholder.svg' },
  { id: 'hyderabad', name: 'Hyderabad', turfCount: 22, imageUrl: '/placeholder.svg' },
  { id: 'pune', name: 'Pune', turfCount: 19, imageUrl: '/placeholder.svg' },
];

export const turfs: Turf[] = [
  {
    id: 'turf-1',
    name: 'Green Arena Sports Complex',
    city: 'Mumbai',
    address: 'Andheri West, Mumbai',
    sports: ['football', 'cricket'],
    pricePerHour: 1500,
    rating: 4.8,
    reviewCount: 234,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
    openTime: '06:00',
    closeTime: '23:00',
    featured: true,
  },
  {
    id: 'turf-2',
    name: 'Premier Turf Club',
    city: 'Mumbai',
    address: 'Powai, Mumbai',
    sports: ['football'],
    pricePerHour: 1800,
    rating: 4.9,
    reviewCount: 156,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Equipment Rental'],
    openTime: '05:00',
    closeTime: '22:00',
    featured: true,
  },
  {
    id: 'turf-3',
    name: 'Cricket Pitch Pro',
    city: 'Delhi',
    address: 'Dwarka, Delhi',
    sports: ['cricket'],
    pricePerHour: 2000,
    rating: 4.7,
    reviewCount: 189,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'Practice Nets', 'Coaching'],
    openTime: '06:00',
    closeTime: '21:00',
    featured: true,
  },
  {
    id: 'turf-4',
    name: 'Sports Hub Bangalore',
    city: 'Bangalore',
    address: 'Koramangala, Bangalore',
    sports: ['football', 'cricket'],
    pricePerHour: 1600,
    rating: 4.6,
    reviewCount: 312,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Refreshments'],
    openTime: '06:00',
    closeTime: '23:00',
  },
  {
    id: 'turf-5',
    name: 'Elite Football Arena',
    city: 'Bangalore',
    address: 'Indiranagar, Bangalore',
    sports: ['football'],
    pricePerHour: 2200,
    rating: 4.9,
    reviewCount: 445,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'VIP Lounge', 'Pro Equipment'],
    openTime: '05:00',
    closeTime: '00:00',
    featured: true,
  },
  {
    id: 'turf-6',
    name: 'Chennai Cricket Ground',
    city: 'Chennai',
    address: 'Adyar, Chennai',
    sports: ['cricket'],
    pricePerHour: 1400,
    rating: 4.5,
    reviewCount: 178,
    imageUrl: '/placeholder.svg',
    amenities: ['Floodlights', 'Parking', 'Practice Nets'],
    openTime: '06:00',
    closeTime: '22:00',
  },
];

export const generateTimeSlots = (date: Date, pricePerHour: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  for (let hour = 6; hour <= 22; hour++) {
    const isPast = isToday && hour <= now.getHours();
    const isBooked = Math.random() > 0.7;
    
    slots.push({
      id: `slot-${hour}`,
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: !isPast && !isBooked,
      price: pricePerHour,
    });
  }
  
  return slots;
};

export const calculateDiscount = (hours: number): number => {
  if (hours >= 4) return 0.20; // 20% off for 4+ hours
  if (hours >= 3) return 0.15; // 15% off for 3 hours
  if (hours >= 2) return 0.10; // 10% off for 2 hours
  return 0;
};
