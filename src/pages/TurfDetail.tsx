import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { store, useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { generateTimeSlots, calculateDiscount } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import {
  MapPin,
  Clock,
  Star,
  Trophy,
  ChevronLeft,
  Check,
  Percent,
  Wifi,
  ParkingMeter,
  Lightbulb,
  ShirtIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, React.ElementType> = {
  Floodlights: Lightbulb,
  Parking: ParkingMeter,
  'Changing Rooms': ShirtIcon,
  WiFi: Wifi,
};

const TurfDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { turfs } = useStore();
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<'cricket' | 'football'>('football');

  const turf = turfs.find((t) => t.id === id);

  useEffect(() => {
    if (turf && turf.sports.length > 0 && !turf.sports.includes(selectedSport)) {
      setSelectedSport(turf.sports[0]);
    }
  }, [turf, selectedSport]);

  const timeSlots = useMemo(() => {
    if (!turf || !selectedDate) return [];
    return generateTimeSlots(selectedDate, turf.pricePerHour);
  }, [turf, selectedDate]);

  if (!turf) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Turf not found</h1>
          <Link to="/turfs">
            <Button variant="hero">Browse Turfs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((s) => s !== slotId) : [...prev, slotId]
    );
  };

  const discount = calculateDiscount(selectedSlots.length);
  const subtotal = selectedSlots.length * turf.pricePerHour;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to book a turf.',
        variant: 'destructive',
      });
      navigate('/auth', { state: { from: `/turf/${turf.id}` } });
      return;
    }

    if (selectedSlots.length === 0) {
      toast({
        title: 'Select time slots',
        description: 'Please select at least one time slot.',
        variant: 'destructive',
      });
      return;
    }

    navigate('/checkout', {
      state: {
        turfId: turf.id,
        turfName: turf.name,
        turfAddress: turf.address,
        date: selectedDate.toISOString(),
        slots: selectedSlots.sort(),
        sport: selectedSport,
        pricePerHour: turf.pricePerHour,
        subtotal,
        discount,
        discountAmount,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4" />
            Back to Turfs
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    {turf.sports.map((sport) => (
                      <Badge key={sport} variant="sport" className="capitalize">
                        {sport}
                      </Badge>
                    ))}
                    {turf.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    {turf.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {turf.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      {turf.rating} ({turf.reviewCount} reviews)
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Venue Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-secondary text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Hours</p>
                      <p className="font-semibold text-foreground">
                        {turf.openTime} - {turf.closeTime}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary text-center">
                      <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Sports</p>
                      <p className="font-semibold text-foreground capitalize">
                        {turf.sports.join(', ')}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary text-center">
                      <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold text-foreground">{turf.rating}/5</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary text-center">
                      <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-foreground">
                        ₹{turf.pricePerHour.toLocaleString()}/hr
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {turf.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sport Selection */}
              {turf.sports.length > 1 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Select Sport</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {turf.sports.map((sport) => (
                        <Button
                          key={sport}
                          variant={selectedSport === sport ? 'hero' : 'outline'}
                          className="capitalize flex-1"
                          onClick={() => setSelectedSport(sport)}
                        >
                          <Trophy className="w-4 h-4 mr-2" />
                          {sport}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Time Slots */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Select Time Slots
                    {selectedSlots.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({selectedSlots.length} selected)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => toggleSlot(slot.id)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all',
                          !slot.available && 'opacity-40 cursor-not-allowed bg-secondary border-border',
                          slot.available &&
                            !selectedSlots.includes(slot.id) &&
                            'border-border hover:border-primary/50 cursor-pointer',
                          selectedSlots.includes(slot.id) &&
                            'border-primary bg-primary/10 ring-1 ring-primary'
                        )}
                      >
                        <p className="font-semibold text-foreground text-sm">{slot.time}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{slot.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Calendar */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setSelectedSlots([]);
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-xl"
                    />
                  </CardContent>
                </Card>

                {/* Booking Summary */}
                {selectedSlots.length > 0 && (
                  <Card className="border-primary/50 shadow-glow">
                    <CardHeader>
                      <CardTitle className="font-display text-lg">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Duration</span>
                          <span className="text-foreground font-medium">
                            {selectedSlots.length} hour(s)
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-primary">
                            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                            <span>-₹{discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-gradient">₹{total.toLocaleString()}</span>
                      </div>
                      <Button
                        variant="hero"
                        size="xl"
                        className="w-full"
                        onClick={handleBooking}
                      >
                        {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Book'}
                      </Button>
                      {discount > 0 && (
                        <p className="text-xs text-primary text-center">
                          You're saving ₹{discountAmount.toLocaleString()} with multi-hour discount!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TurfDetail;
