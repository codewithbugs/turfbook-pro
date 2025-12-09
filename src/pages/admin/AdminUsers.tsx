import { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Users,
  Mail,
  Phone,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock users data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    role: 'user',
    bookingsCount: 12,
    totalSpent: 45000,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    role: 'user',
    bookingsCount: 8,
    totalSpent: 28000,
    createdAt: '2024-02-20',
    status: 'active',
  },
  {
    id: 'user-3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    role: 'user',
    bookingsCount: 5,
    totalSpent: 15000,
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@turfbook.in',
    phone: '+91 99999 99999',
    role: 'admin',
    bookingsCount: 0,
    totalSpent: 0,
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: 'user-5',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    phone: '+91 65432 10987',
    role: 'user',
    bookingsCount: 3,
    totalSpent: 9000,
    createdAt: '2024-04-05',
    status: 'inactive',
  },
];

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Users" 
        subtitle={`${mockUsers.length} registered users`}
      />
      
      <main className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-secondary border border-border text-foreground"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        
        {/* Users Table/Grid */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Bookings</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Total Spent</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-foreground">{user.bookingsCount}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="font-semibold text-foreground">
                          ₹{user.totalSpent.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === 'admin' ? 'accent' : 'secondary'} className="capitalize">
                            {user.role}
                          </Badge>
                          {user.status === 'inactive' && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Bookings</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No users found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
