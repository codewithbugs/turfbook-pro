import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingWithDetails } from '@/lib/store';
import { Calendar, Clock, MapPin, User, Mail, Phone, Trophy, IndianRupee } from 'lucide-react';

interface BookingDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: BookingWithDetails | null;
  onUpdateStatus: (id: string, status: 'confirmed' | 'cancelled') => void;
}

export const BookingDetailsModal = ({ open, onClose, booking, onUpdateStatus }: BookingDetailsModalProps) => {
  if (!booking) return null;

  const formatSlotTime = (slotId: string) => {
    const hour = parseInt(slotId.replace('slot-', ''));
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'accent';
      case 'cancelled': return 'destructive';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-xl">Booking Details</DialogTitle>
            <Badge variant={getStatusVariant(booking.status) as any} className="capitalize">
              {booking.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking ID */}
          <div className="p-4 rounded-xl bg-secondary">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="font-mono font-bold text-lg text-foreground">{booking.id}</p>
          </div>
          
          {/* Turf Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Turf Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{booking.turfName}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Trophy className="w-4 h-4" />
                <span className="capitalize">{booking.sport}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Date & Time */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Date & Time</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {formatSlotTime(booking.slots[0])} - {formatSlotTime(`slot-${parseInt(booking.slots[booking.slots.length - 1].replace('slot-', '')) + 1}`)}
                </span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Customer Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{booking.customerPhone}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Amount */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Total Amount</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              ₹{booking.totalAmount.toLocaleString()}
            </span>
          </div>
          
          {/* Booked on */}
          <p className="text-sm text-muted-foreground">
            Booked on: {new Date(booking.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        
        <DialogFooter className="gap-2">
          {booking.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                className="text-destructive hover:text-destructive"
              >
                Cancel Booking
              </Button>
              <Button 
                variant="hero"
                onClick={() => onUpdateStatus(booking.id, 'confirmed')}
              >
                Confirm Booking
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <Button 
              variant="outline" 
              onClick={() => onUpdateStatus(booking.id, 'cancelled')}
              className="text-destructive hover:text-destructive"
            >
              Cancel Booking
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
