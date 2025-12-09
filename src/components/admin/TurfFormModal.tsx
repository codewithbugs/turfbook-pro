import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Turf } from '@/lib/types';
import { cities } from '@/lib/data';

interface TurfFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (turf: Omit<Turf, 'id'> | Turf) => void;
  turf?: Turf | null;
}

const defaultTurf: Omit<Turf, 'id'> = {
  name: '',
  city: '',
  address: '',
  sports: [],
  pricePerHour: 1000,
  rating: 4.5,
  reviewCount: 0,
  imageUrl: '/placeholder.svg',
  amenities: [],
  openTime: '06:00',
  closeTime: '22:00',
  featured: false,
};

const amenitiesList = [
  'Floodlights',
  'Parking',
  'Changing Rooms',
  'Cafeteria',
  'Equipment Rental',
  'Practice Nets',
  'Coaching',
  'Refreshments',
  'VIP Lounge',
  'First Aid',
];

export const TurfFormModal = ({ open, onClose, onSave, turf }: TurfFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Turf, 'id'>>(defaultTurf);

  useEffect(() => {
    if (turf) {
      setFormData(turf);
    } else {
      setFormData(defaultTurf);
    }
  }, [turf, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (turf) {
      onSave({ ...formData, id: turf.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  const toggleSport = (sport: 'cricket' | 'football') => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {turf ? 'Edit Turf' : 'Add New Turf'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Turf Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Green Arena Sports Complex"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Andheri West, Mumbai"
              required
            />
          </div>
          
          {/* Pricing & Timing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Hour (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) })}
                min={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openTime">Open Time</Label>
              <Input
                id="openTime"
                type="time"
                value={formData.openTime}
                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="closeTime">Close Time</Label>
              <Input
                id="closeTime"
                type="time"
                value={formData.closeTime}
                onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                required
              />
            </div>
          </div>
          
          {/* Sports */}
          <div className="space-y-3">
            <Label>Sports Available</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.sports.includes('cricket')}
                  onCheckedChange={() => toggleSport('cricket')}
                />
                <span>Cricket</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.sports.includes('football')}
                  onCheckedChange={() => toggleSport('football')}
                />
                <span>Football</span>
              </label>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
            />
            <span>Mark as Featured</span>
          </label>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              {turf ? 'Update Turf' : 'Add Turf'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
