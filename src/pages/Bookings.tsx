import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Search,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useStore, store } from '@/lib/store';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TabFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const Bookings = () => {
  const { user } = useAuth();
  const { bookings: bookingState, turfs } = useStore();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Apply tab filter
    switch (activeTab) {
      case 'upcoming':
        filtered = filtered.filter((b) => b.status === 'pending' || b.status === 'confirmed');
        break;
      case 'completed':
        filtered = filtered.filter((b) => b.status === 'completed');
        break;
      case 'cancelled':
        filtered = filtered.filter((b) => b.status === 'cancelled');
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((b) => b.turfName.toLowerCase().includes(query));
    }

    return filtered;
  }, [bookings, activeTab, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="accent">Pending</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
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
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const handleCancel = (bookingId: string) => {
    store.cancelBooking(bookingId);
    toast({ title: 'Booking cancelled', description: 'Your booking was cancelled successfully.' });
  };

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

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

          {/* Summary Cards */}
          {bookings.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {bookingSummary.total}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {bookingSummary.upcoming}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {bookingSummary.completed}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {bookingSummary.cancelled}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs + Search */}
          {bookings.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'hero' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by turf name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-secondary border-border"
                />
              </div>
            </div>
          )}

          {/* Booking Cards */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
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
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span className="capitalize">{booking.sport}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground font-display">
                            ₹{booking.amount.toLocaleString()}
                          </p>
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
          ) : bookings.length > 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No matching bookings
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
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
