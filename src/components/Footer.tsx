import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

const quickLinks = [
  { label: 'Browse Turfs', href: '/turfs' },
  { label: 'My Bookings', href: '/bookings' },
  { label: 'Partner With Us', href: '/partner' },
  { label: 'About Us', href: '/about' },
];

const cities = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TK</span>
              </div>
              <span className="text-xl font-bold text-white">
                TurfBook
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Karo
                </span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's premier platform for booking sports turfs. Play cricket, football, and
              more at TurfBookKaro.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Cities</h3>
            <ul className="space-y-2.5">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    to={`/turfs?city=${encodeURIComponent(city)}`}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="h-3 w-3" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@turfbookkaro.in"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  support@turfbookkaro.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 TurfBookKaro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/refund"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
