import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { store } from '@/lib/store';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock,
  Shield,
  Check,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingDetails {
  turfId: string;
  turfName: string;
  turfAddress: string;
  date: string;
  slots: string[];
  sport: string;
  pricePerHour: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingDetails | null;
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">No booking found</h1>
          <p className="text-muted-foreground mb-6">Please select a turf and time slots first.</p>
          <Link to="/turfs">
            <Button variant="hero">Browse Turfs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all contact details.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    
    // Create booking
    store.createBooking({
      turfId: bookingDetails.turfId,
      userId: 'guest-' + Date.now(),
      date: bookingDetails.date,
      slots: bookingDetails.slots,
      sport: bookingDetails.sport as 'cricket' | 'football',
      totalAmount: bookingDetails.total,
      status: 'confirmed',
      turfName: bookingDetails.turfName,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
    });
    
    toast({
      title: 'Booking Confirmed!',
      description: 'Your turf has been booked successfully.',
    });
    
    navigate('/booking-success', { 
      state: { 
        ...bookingDetails, 
        customerName: name,
        bookingId: 'TRF' + Date.now().toString().slice(-8),
      } 
    });
    setLoading(false);
  };

  const formatSlotTime = (slotId: string) => {
    const hour = parseInt(slotId.replace('slot-', ''));
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-foreground">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        paymentMethod === 'upi' 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="upi" className="font-semibold text-foreground cursor-pointer">UPI Payment</Label>
                        <p className="text-sm text-muted-foreground">Pay using GPay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    
                    <div 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        paymentMethod === 'card' 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="card" className="font-semibold text-foreground cursor-pointer">Credit/Debit Card</Label>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    
                    <div 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        paymentMethod === 'netbanking' 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="netbanking" className="font-semibold text-foreground cursor-pointer">Net Banking</Label>
                        <p className="text-sm text-muted-foreground">All major banks supported</p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {/* Payment Details */}
                  <div className="mt-6">
                    {paymentMethod === 'upi' && (
                      <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input
                          id="upi-id"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="h-12 bg-secondary border-border"
                        />
                      </div>
                    )}
                    
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="h-12 bg-secondary border-border"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-expiry">Expiry Date</Label>
                            <Input
                              id="card-expiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="h-12 bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-cvv">CVV</Label>
                            <Input
                              id="card-cvv"
                              type="password"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="h-12 bg-secondary border-border"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'netbanking' && (
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to your bank's website to complete the payment.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">256-bit SSL encryption for your security</p>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-foreground">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Turf Details */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {bookingDetails.turfName}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{bookingDetails.turfAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(bookingDetails.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatSlotTime(bookingDetails.slots[0])} - {formatSlotTime(`slot-${parseInt(bookingDetails.slots[bookingDetails.slots.length - 1].replace('slot-', '')) + 1}`)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant="sport" className="capitalize">{bookingDetails.sport}</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Duration</span>
                      <span className="text-foreground font-medium">{bookingDetails.slots.length} hour(s)</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Price per hour</span>
                      <span className="text-foreground font-medium">₹{bookingDetails.pricePerHour.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{bookingDetails.subtotal.toLocaleString()}</span>
                    </div>
                    {bookingDetails.discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <div className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          <span>Discount ({(bookingDetails.discount * 100).toFixed(0)}%)</span>
                        </div>
                        <span>-₹{bookingDetails.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-gradient">₹{bookingDetails.total.toLocaleString()}</span>
                  </div>
                  
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay ₹${bookingDetails.total.toLocaleString()}`}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Free cancellation up to 24 hours before
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
