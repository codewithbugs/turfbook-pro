import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore, store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { BookingDetailsModal } from '@/components/admin/BookingDetailsModal';
import { BookingWithDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const OwnerBookings = () => {
  const { turfs, bookings } = useStore();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  const myBookings = useMemo(() => {
    let result = store.getBookingsForOwnerTurfs(user?.id || '');

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (timeFilter === 'week') cutoff.setDate(now.getDate() - 7);
      else cutoff.setMonth(now.getMonth() - 1);
      result = result.filter((b) => new Date(b.createdAt) >= cutoff);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.turfName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [turfs, bookings, user?.id, searchQuery, statusFilter, timeFilter]);

  const statusCounts = useMemo(() => {
    const all = store.getBookingsForOwnerTurfs(user?.id || '');
    return {
      all: all.length,
      pending: all.filter((b) => b.status === 'pending').length,
      confirmed: all.filter((b) => b.status === 'confirmed').length,
      completed: all.filter((b) => b.status === 'completed').length,
      cancelled: all.filter((b) => b.status === 'cancelled').length,
    };
  }, [turfs, bookings, user?.id]);

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    store.updateBookingStatus(id, status);
    toast({
      title: status === 'confirmed' ? 'Booking confirmed' : 'Booking cancelled',
      description: `Booking has been ${status}.`,
    });
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">Manage bookings for your turfs</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by customer, turf, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-secondary border-border"
          />
        </div>

        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((t) => (
            <Button
              key={t}
              variant={timeFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(t)}
            >
              {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All Time'}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status} ({statusCounts[status]})
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      {myBookings.length > 0 ? (
        <div className="space-y-3">
          {myBookings.map((booking) => (
            <Card
              key={booking.id}
              className="border-border cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setSelectedBooking(booking)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{booking.id}</span>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'pending'
                            ? 'accent'
                            : booking.status === 'cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.turfName} &middot;{' '}
                      {new Date(booking.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      &middot; {booking.sport}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-foreground">
                      ₹{booking.totalAmount.toLocaleString()}
                    </span>
                    {booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(booking.id, 'confirmed');
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(booking.id, 'cancelled');
                          }}
                        >
                          <XCircle className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    )}
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
            No bookings found
          </h3>
          <p className="text-muted-foreground">
            {statusFilter !== 'all' || timeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Bookings will appear here when customers book your turfs'}
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          open={!!selectedBooking}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={(status) =>
            handleUpdateStatus(selectedBooking.id, status as 'confirmed' | 'cancelled')
          }
        />
      )}
    </div>
  );
};

export default OwnerBookings;
