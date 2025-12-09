import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Share2,
  ArrowRight,
  Trophy
} from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const bookingDetails = location.state;
  
  if (!bookingDetails) {
    return <Navigate to="/" replace />;
  }

  const formatSlotTime = (slotId: string) => {
    const hour = parseInt(slotId.replace('slot-', ''));
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-32 h-32 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your turf has been booked successfully
          </p>
        </div>
        
        {/* Booking Details Card */}
        <Card className="border-border shadow-elevated overflow-hidden mb-6">
          <div className="bg-gradient-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Booking ID</p>
                <p className="text-primary-foreground font-mono font-bold text-lg">
                  {bookingDetails.bookingId}
                </p>
              </div>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                Confirmed
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            {/* Turf Info */}
            <div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-1">
                {bookingDetails.turfName}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{bookingDetails.turfAddress}</span>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Date</span>
                </div>
                <p className="font-semibold text-foreground">
                  {new Date(bookingDetails.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Time</span>
                </div>
                <p className="font-semibold text-foreground">
                  {formatSlotTime(bookingDetails.slots[0])} - {formatSlotTime(`slot-${parseInt(bookingDetails.slots[bookingDetails.slots.length - 1].replace('slot-', '')) + 1}`)}
                </p>
              </div>
            </div>
            
            {/* Sport & Amount */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <p className="font-semibold text-foreground capitalize">{bookingDetails.sport}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-display font-bold text-xl text-foreground">
                  ₹{bookingDetails.total.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Customer Info */}
            <div className="text-sm text-muted-foreground">
              <p>Confirmation sent to: <span className="text-foreground">{bookingDetails.customerName}</span></p>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
          
          <Link to="/bookings" className="block">
            <Button variant="secondary" className="w-full gap-2">
              View My Bookings
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to="/" className="block">
            <Button variant="ghost" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{' '}
          <a href="#" className="text-primary hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess;
