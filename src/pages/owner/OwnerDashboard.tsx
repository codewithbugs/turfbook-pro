import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  AlertCircle,
  Eye,
  Settings2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b'];

const OwnerDashboard = () => {
  const { turfs, bookings } = useStore();
  const { user } = useAuth();
  const ownerId = user?.id || '';

  const myTurfs = useMemo(() => store.getTurfsByOwner(ownerId), [turfs, ownerId]);
  const myBookings = useMemo(() => store.getBookingsForOwnerTurfs(ownerId), [bookings, ownerId]);

  const stats = useMemo(() => {
    const confirmed = myBookings.filter((b) => b.status === 'confirmed' || b.status === 'completed');
    const pending = myBookings.filter((b) => b.status === 'pending');
    const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingTurfs = myTurfs.filter((t) => t.approvalStatus === 'pending' || t.approvalStatus === 'changes_requested');

    return {
      totalTurfs: myTurfs.length,
      totalBookings: myBookings.length,
      totalRevenue,
      pendingBookings: pending.length,
      pendingTurfs: pendingTurfs.length,
    };
  }, [myTurfs, myBookings]);

  // Weekly booking data for chart (last 7 days)
  const weeklyData = useMemo(() => {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().split('T')[0];
      const dayBookings = myBookings.filter((b) => b.date.startsWith(key));
      return {
        name: dayLabels[date.getDay()],
        bookings: dayBookings.length,
        revenue: dayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      };
    });
    return result;
  }, [myBookings]);

  // Sport distribution
  const sportData = useMemo(() => {
    const football = myBookings.filter((b) => b.sport === 'football').length;
    const cricket = myBookings.filter((b) => b.sport === 'cricket').length;
    return [
      { name: 'Football', value: football || 3 },
      { name: 'Cricket', value: cricket || 2 },
    ];
  }, [myBookings]);

  const recentBookings = useMemo(
    () =>
      [...myBookings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [myBookings]
  );

  const handleConfirm = (id: string) => {
    store.updateBookingStatus(id, 'confirmed');
  };

  const handleCancel = (id: string) => {
    store.updateBookingStatus(id, 'cancelled');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Owner'}
          </p>
        </div>
      </div>

      {/* Pending Approval Alert */}
      {stats.pendingTurfs > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-foreground">
            You have <span className="font-semibold">{stats.pendingTurfs}</span> turf(s) pending admin approval.
          </p>
          <Link to="/owner/turfs" className="ml-auto">
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="My Turfs"
          value={stats.totalTurfs.toString()}
          change="+2 this month"
          changeType="positive"
          icon={MapPin}
        />
        <StatsCard
          label="Total Bookings"
          value={stats.totalBookings.toString()}
          change="+12% vs last month"
          changeType="positive"
          icon={Calendar}
        />
        <StatsCard
          label="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change="+8% vs last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          label="Pending Bookings"
          value={stats.pendingBookings.toString()}
          change="Needs action"
          changeType="neutral"
          icon={Clock}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/owner/turfs">
          <Button variant="hero" className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Turf
          </Button>
        </Link>
        <Link to="/owner/bookings">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            View Bookings
          </Button>
        </Link>
        <Link to="/owner/slots">
          <Button variant="outline" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Manage Slots
          </Button>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bookings Chart */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sport Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Sport Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {sportData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {sportData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Recent Bookings</CardTitle>
          <Link to="/owner/bookings">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                >
                  <div>
                    <p className="font-semibold text-foreground">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.turfName} &middot;{' '}
                      {new Date(booking.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-foreground">
                      ₹{booking.totalAmount.toLocaleString()}
                    </span>
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
                    {booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1 h-7 px-2 text-xs"
                          onClick={() => handleConfirm(booking.id)}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-7 px-2 text-xs"
                          onClick={() => handleCancel(booking.id)}
                        >
                          <XCircle className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No bookings yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
