import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { turfs } from '@/lib/data';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Turfs', value: '6', icon: MapPin, change: '+2 this month' },
    { label: 'Total Bookings', value: '1,234', icon: Calendar, change: '+15% vs last month' },
    { label: 'Active Users', value: '5,678', icon: Users, change: '+320 this week' },
    { label: 'Revenue', value: '₹4.5L', icon: DollarSign, change: '+22% vs last month' },
  ];

  const recentBookings = [
    { id: '1', customer: 'Rahul Sharma', turf: 'Green Arena', date: 'Today, 6 PM', amount: '₹3,000', status: 'confirmed' },
    { id: '2', customer: 'Priya Patel', turf: 'Premier Turf Club', date: 'Today, 8 PM', amount: '₹3,600', status: 'pending' },
    { id: '3', customer: 'Amit Kumar', turf: 'Cricket Pitch Pro', date: 'Tomorrow, 10 AM', amount: '₹4,000', status: 'confirmed' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'turfs', label: 'Manage Turfs', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your turfs, bookings, and analytics
              </p>
            </div>
            <Button variant="hero" className="mt-4 md:mt-0 gap-2">
              <Plus className="w-4 h-4" />
              Add New Turf
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <Card key={stat.label} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-primary" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-foreground font-display mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-primary mt-2">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Bookings */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{booking.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.turf} • {booking.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-foreground">{booking.amount}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'success' : 'accent'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'turfs' && (
            <div className="space-y-4">
              {turfs.map((turf) => (
                <Card key={turf.id} variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {turf.name}
                          </h3>
                          {turf.featured && <Badge variant="accent">Featured</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {turf.city}
                          </div>
                          <div>₹{turf.pricePerHour}/hr</div>
                          <div className="flex gap-1">
                            {turf.sports.map((sport) => (
                              <Badge key={sport} variant="sport" className="capitalize text-xs">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Connect to database to view all bookings</p>
                  <Button variant="outline" className="mt-4">
                    Connect Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
