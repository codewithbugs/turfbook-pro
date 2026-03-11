import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "@/lib/auth-context";
import { auth0Config } from "@/lib/auth0-config";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Turfs from "./pages/Turfs";
import TurfDetail from "./pages/TurfDetail";
import Bookings from "./pages/Bookings";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTurfs from "./pages/admin/AdminTurfs";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

// Owner pages
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerTurfs from "./pages/owner/OwnerTurfs";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerSlots from "./pages/owner/OwnerSlots";

const queryClient = new QueryClient();

const App = () => (
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    authorizationParams={auth0Config.authorizationParams}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes — accessible to everyone */}
              <Route path="/" element={<Index />} />
              <Route path="/turfs" element={<Turfs />} />
              <Route path="/turf/:id" element={<TurfDetail />} />
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes — require authentication */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-success"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingSuccess />
                  </ProtectedRoute>
                }
              />

              {/* Owner Routes — require 'owner' role */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OwnerDashboard />} />
                <Route path="turfs" element={<OwnerTurfs />} />
                <Route path="bookings" element={<OwnerBookings />} />
                <Route path="slots" element={<OwnerSlots />} />
              </Route>

              {/* Admin Routes — require 'admin' role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="turfs" element={<AdminTurfs />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Auth0Provider>
);

export default App;
