import { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Settings,
  Building2,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Save
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'TurfBook',
    supportEmail: 'support@turfbook.in',
    supportPhone: '+91 98765 43210',
    emailNotifications: true,
    smsNotifications: true,
    autoConfirmBookings: false,
    maintenanceMode: false,
    defaultCurrency: 'INR',
    bookingAdvanceDays: 7,
    cancellationHours: 24,
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Settings" 
        subtitle="Manage your platform settings"
      />
      
      <main className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* General Settings */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="font-display">General Settings</CardTitle>
              </div>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Platform Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select
                    id="currency"
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Settings */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle className="font-display">Contact Information</CardTitle>
              </div>
              <CardDescription>Support contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notification Settings */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle className="font-display">Notifications</CardTitle>
              </div>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send booking confirmations via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Send booking updates via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Booking Settings */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <CardTitle className="font-display">Booking Settings</CardTitle>
              </div>
              <CardDescription>Configure booking behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-confirm Bookings</p>
                  <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
                </div>
                <Switch
                  checked={settings.autoConfirmBookings}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoConfirmBookings: checked })}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advanceDays">Advance Booking (Days)</Label>
                  <Input
                    id="advanceDays"
                    type="number"
                    value={settings.bookingAdvanceDays}
                    onChange={(e) => setSettings({ ...settings, bookingAdvanceDays: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">How many days in advance can users book</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationHours">Free Cancellation (Hours)</Label>
                  <Input
                    id="cancellationHours"
                    type="number"
                    value={settings.cancellationHours}
                    onChange={(e) => setSettings({ ...settings, cancellationHours: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Hours before booking for free cancellation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* System Settings */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="font-display">System</CardTitle>
              </div>
              <CardDescription>Advanced system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="hero" onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
