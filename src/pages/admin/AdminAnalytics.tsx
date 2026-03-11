import { useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { store } from '@/lib/store';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Calendar,
  IndianRupee,
  MapPin,
  Activity,
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const AdminAnalytics = () => {
  const bookings = store.getBookings();
  const turfs = store.getTurfs();

  // Revenue over last 7 days
  const revenueData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toISOString().split('T')[0];
      const dayBookings = bookings.filter(
        (b) => b.date.startsWith(key) && (b.status === 'confirmed' || b.status === 'completed')
      );
      return {
        name: days[date.getDay()],
        revenue: dayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
        bookings: dayBookings.length,
      };
    });
  }, [bookings]);

  // Bookings by status
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [bookings]);

  // Sport distribution
  const sportData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const sport = b.sport || 'Other';
      counts[sport] = (counts[sport] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [bookings]);

  // City distribution
  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    turfs.forEach((t) => {
      counts[t.city] = (counts[t.city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, turfs: value }))
      .sort((a, b) => b.turfs - a.turfs);
  }, [turfs]);

  // Monthly trend (mock data for last 6 months)
  const monthlyTrend = useMemo(() => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    return months.map((month, i) => ({
      name: month,
      users: 120 + i * 45 + Math.floor(Math.random() * 30),
      bookings: 80 + i * 25 + Math.floor(Math.random() * 20),
      revenue: (15000 + i * 8000 + Math.floor(Math.random() * 5000)),
    }));
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Analytics"
        subtitle="Platform insights and performance metrics"
      />

      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold font-display text-foreground">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +22% vs last month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold font-display text-foreground">{bookings.length}</p>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +15% vs last month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Turfs</p>
                  <p className="text-2xl font-bold font-display text-foreground">
                    {turfs.filter((t) => t.approvalStatus === 'approved').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {turfs.length} total registered
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                  <p className="text-2xl font-bold font-display text-foreground">
                    ₹{bookings.length > 0 ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Healthy
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Revenue (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Monthly Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="bookings" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                  <span className="text-muted-foreground">Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--accent))' }} />
                  <span className="text-muted-foreground">Bookings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sport Distribution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Sport Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={sportData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sportData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Turfs by City */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Turfs by City</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="turfs" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
