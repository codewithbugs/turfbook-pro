import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BookingDetailsModal } from '@/components/admin/BookingDetailsModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { store, useStore, BookingWithDetails } from '@/lib/store';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar,
  MapPin,
  User,
  IndianRupee,
  Eye,
  Check,
  X,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookings } = useStore();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = 
        booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
        booking.turfName.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, search, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    store.updateBookingStatus(id, status);
    toast({
      title: status === 'confirmed' ? 'Booking Confirmed' : 'Booking Cancelled',
      description: `Booking has been ${status}.`,
    });
    setSelectedBooking(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="accent">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatSlotTime = (slotId: string) => {
    const hour = parseInt(slotId.replace('slot-', ''));
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const statusTabs = [
    { value: '', label: 'All', count: statusCounts.all },
    { value: 'pending', label: 'Pending', count: statusCounts.pending },
    { value: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
    { value: 'completed', label: 'Completed', count: statusCounts.completed },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Bookings" 
        subtitle={`${bookings.length} total bookings`}
      />
      
      <main className="p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  statusFilter === tab.value
                    ? "bg-primary-foreground/20"
                    : "bg-muted"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, turf, or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>
        
        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <Card 
              key={booking.id} 
              className="border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{booking.id}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{booking.turfName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {new Date(booking.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold">₹{booking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No bookings found
            </h3>
            <p className="text-muted-foreground">
              {search || statusFilter ? 'Try adjusting your filters' : 'Bookings will appear here'}
            </p>
          </div>
        )}
      </main>
      
      {/* Booking Details Modal */}
      <BookingDetailsModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default AdminBookings;
