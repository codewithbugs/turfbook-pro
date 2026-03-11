import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { mockLogin } from '@/lib/auth-context';
import { User, UserRole } from '@/lib/types';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, ArrowLeft, Smartphone } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithGoogle, loginWithPhone } = useAuth();
  const initialMode = searchParams.get('mode') || 'login';
  const from = (location.state as any)?.from || '/';

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode as any);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>('user');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const getMockIdentityFromEmail = (value: string): { id: string; role: UserRole; name: string } => {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('admin')) return { id: 'admin-1', role: 'admin', name: 'Admin User' };
    if (normalized === 'owner@example.com' || normalized.includes('owner')) {
      return { id: 'owner-1', role: 'owner', name: 'Turf Owner' };
    }
    if (normalized === 'rahul@example.com') return { id: 'user-1', role: 'user', name: 'Rahul Sharma' };
    return { id: 'user-1', role: 'user', name: 'Demo User' };
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    if (email && password.length >= 6) {
      const identity = getMockIdentityFromEmail(email);

      const user: User = {
        id: identity.id,
        name: identity.name,
        email,
        phone: '+91 98765 43210',
        role: identity.role,
        createdAt: new Date().toISOString(),
      };
      mockLogin(user);
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });

      // Navigate based on role
      if (identity.role === 'admin') navigate('/admin');
      else if (identity.role === 'owner') navigate('/owner');
      else navigate(from);
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleMockRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Minimum 6 characters.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const user: User = {
      id: selectedRole === 'owner' ? `owner-${Date.now()}` : `user-${Date.now()}`,
      name,
      email,
      phone,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };
    mockLogin(user);
    toast({ title: 'Account created!', description: 'Welcome to TurfBookKaro.' });

    if (selectedRole === 'owner') navigate('/owner');
    else navigate('/');
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: 'Reset link sent!', description: 'Check your email for password reset instructions.' });
    setMode('login');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-accent/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_40%)]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-2xl">T</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">TurfBookKaro</span>
          </Link>

          <div className="mt-20">
            <h1 className="font-display text-5xl font-bold text-foreground mb-6 leading-tight">
              Book Premium
              <br />
              <span className="text-gradient">Sports Turfs</span>
              <br />
              Instantly
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Join thousands of players booking cricket and football turfs across India.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border">
            <p className="text-3xl font-bold text-foreground font-display">150+</p>
            <p className="text-sm text-muted-foreground">Premium Turfs</p>
          </div>
          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border">
            <p className="text-3xl font-bold text-foreground font-display">50K+</p>
            <p className="text-sm text-muted-foreground">Happy Players</p>
          </div>
          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border">
            <p className="text-3xl font-bold text-foreground font-display">6</p>
            <p className="text-sm text-muted-foreground">Major Cities</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-2xl">T</span>
              </div>
              <span className="font-display font-bold text-2xl text-foreground">TurfBookKaro</span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-elevated bg-card/80 backdrop-blur-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="font-display text-2xl font-bold text-foreground">
                {mode === 'login' && 'Welcome back'}
                {mode === 'register' && 'Create an account'}
                {mode === 'forgot' && 'Reset password'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {mode === 'login' && 'Sign in with your email, phone, or Google'}
                {mode === 'register' && 'Enter your details to get started'}
                {mode === 'forgot' && "Enter your email and we'll send you a reset link"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {mode === 'login' && (
                <div className="space-y-4">
                  {/* Social login buttons */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={loginWithGoogle}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={loginWithPhone}
                  >
                    <Smartphone className="w-5 h-5" />
                    Continue with Phone
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleMockLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 bg-secondary border-border"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Demo: use <code className="text-primary">owner@</code> for turf owner, <code className="text-primary">admin@</code> for admin
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-foreground">Password</Label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 bg-secondary border-border"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setMode('register')} className="text-primary hover:underline font-medium">
                      Sign up
                    </button>
                  </p>
                </div>
              )}

              {mode === 'register' && (
                <form onSubmit={handleMockRegister} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-foreground">I want to</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('user')}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selectedRole === 'user'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <UserIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold text-foreground text-sm">Book Turfs</p>
                        <p className="text-xs text-muted-foreground">As a player</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('owner')}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selectedRole === 'owner'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold text-foreground text-sm">List My Turf</p>
                        <p className="text-xs text-muted-foreground">As an owner</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      {selectedRole === 'owner' ? 'Business / Full Name' : 'Full Name'}
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={selectedRole === 'owner' ? 'Sports Arena Pvt. Ltd.' : 'John Doe'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 bg-secondary border-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to TurfBookKaro's{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
