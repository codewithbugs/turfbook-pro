import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { store } from '@/lib/store';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const bookings = store.getBookings();
  const turfs = store.getTurfs();
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { 
      label: 'Total Turfs', 
      value: turfs.length.toString(), 
      change: '+2 this month',
      changeType: 'positive' as const,
      icon: MapPin 
    },
    { 
      label: 'Total Bookings', 
      value: bookings.length.toString(), 
      change: '+15% vs last month',
      changeType: 'positive' as const,
      icon: Calendar 
    },
    { 
      label: 'Pending Bookings', 
      value: pendingBookings.length.toString(), 
      change: 'Needs attention',
      changeType: 'neutral' as const,
      icon: Clock 
    },
    { 
      label: 'Revenue', 
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`, 
      change: '+22% vs last month',
      changeType: 'positive' as const,
      icon: IndianRupee 
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
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your turfs."
      />
      
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display">
                <Clock className="w-5 h-5 text-primary" />
                Recent Bookings
              </CardTitle>
              <Link to="/admin/bookings">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.turfName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-foreground">₹{booking.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
                
                {recentBookings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions & Performance */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-display">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Link to="/admin/turfs">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Add New Turf</span>
                  </Button>
                </Link>
                <Link to="/admin/bookings">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>View Bookings</span>
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span>Manage Users</span>
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>View Analytics</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Pending Attention */}
            {pendingBookings.length > 0 && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {pendingBookings.length} Pending Booking{pendingBookings.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">Requires your attention</p>
                      </div>
                    </div>
                    <Link to="/admin/bookings?status=pending">
                      <Button variant="hero" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
