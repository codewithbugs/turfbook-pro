import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useStore, store } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

const Bookings = () => {
  const { user } = useAuth();
  const { bookings: bookingState, turfs } = useStore();

  const bookings = useMemo(() => {
    const userId = user?.id || '';
    if (!userId) return [];

    return store
      .getUserBookings(userId)
      .map((booking) => {
        const turf = turfs.find((t) => t.id === booking.turfId);
        const firstSlot = booking.slots[0];
        const lastSlot = booking.slots[booking.slots.length - 1];
        const firstHour = parseInt(firstSlot?.replace('slot-', '') || '0', 10);
        const lastHour = parseInt(lastSlot?.replace('slot-', '') || '0', 10) + 1;
        const timeRange = `${firstHour.toString().padStart(2, '0')}:00 - ${lastHour
          .toString()
          .padStart(2, '0')}:00`;

        return {
          id: booking.id,
          turfId: booking.turfId,
          turfName: booking.turfName,
          address: turf?.address || 'Address unavailable',
          date: booking.date,
          time: timeRange,
          sport: booking.sport,
          amount: booking.totalAmount,
          status: booking.status,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user?.id, bookingState, turfs]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="accent">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const bookingSummary = useMemo(() => {
    return {
      total: bookings.length,
      upcoming: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const handleCancel = (bookingId: string) => {
    store.cancelBooking(bookingId);
    toast({ title: 'Booking cancelled', description: 'Your booking was cancelled successfully.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              My <span className="text-gradient">Bookings</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              View and manage your turf bookings
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-display text-2xl font-bold text-foreground">{bookingSummary.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                  <p className="font-display text-2xl font-bold text-foreground">{bookingSummary.upcoming}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="font-display text-2xl font-bold text-foreground">{bookingSummary.cancelled}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {booking.turfName}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.address}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground font-display">
                            ₹{booking.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">{booking.sport}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/turf/${booking.turfId}`}>
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          </Link>
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No bookings yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by browsing and booking your first turf
              </p>
              <Link to="/turfs">
                <Button variant="hero">Browse Turfs</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bookings;
