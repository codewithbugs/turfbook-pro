import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">TurfBook</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              India's premier platform for booking sports turfs. Play cricket, football, and more.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/turfs" className="text-muted-foreground hover:text-primary transition-colors">Browse Turfs</Link></li>
              <li><Link to="/bookings" className="text-muted-foreground hover:text-primary transition-colors">My Bookings</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Partner With Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Cities</h3>
            <ul className="space-y-2">
              <li><Link to="/turfs?city=Mumbai" className="text-muted-foreground hover:text-primary transition-colors">Mumbai</Link></li>
              <li><Link to="/turfs?city=Delhi" className="text-muted-foreground hover:text-primary transition-colors">Delhi</Link></li>
              <li><Link to="/turfs?city=Bangalore" className="text-muted-foreground hover:text-primary transition-colors">Bangalore</Link></li>
              <li><Link to="/turfs?city=Chennai" className="text-muted-foreground hover:text-primary transition-colors">Chennai</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                support@turfbook.in
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1" />
                123 Sports Complex, Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TurfBook. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
