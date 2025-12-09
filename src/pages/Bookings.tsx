import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookings = () => {
  // Mock bookings data - would come from database
  const bookings = [
    {
      id: '1',
      turfName: 'Green Arena Sports Complex',
      address: 'Andheri West, Mumbai',
      date: '2024-01-15',
      time: '18:00 - 20:00',
      sport: 'Football',
      amount: 2700,
      status: 'confirmed',
    },
    {
      id: '2',
      turfName: 'Premier Turf Club',
      address: 'Powai, Mumbai',
      date: '2024-01-18',
      time: '09:00 - 11:00',
      sport: 'Football',
      amount: 3240,
      status: 'pending',
    },
  ];

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
                          <p className="text-sm text-muted-foreground">{booking.sport}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
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
