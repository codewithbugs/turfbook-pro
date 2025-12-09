import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Trophy, Users, Calendar } from 'lucide-react';
import heroImage from '@/assets/hero-turf.jpg';
import { cities } from '@/lib/data';

export const Hero = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (selectedSport) params.set('sport', selectedSport);
    navigate(`/turfs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium sports turf facility"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 animate-float hidden lg:block">
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Premium Turfs</p>
              <p className="text-xs text-muted-foreground">100+ Venues</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/3 left-10 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">50K+ Players</p>
              <p className="text-xs text-muted-foreground">Trusted Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Book Your Game Today</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Play on{' '}
            <span className="text-gradient">Premium Turfs</span>
            <br />
            Near You
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Book cricket and football turfs instantly across major cities. 
            Get exclusive discounts on multi-hour bookings.
          </p>

          {/* Search Box */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-elevated animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Sport</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                </select>
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full gap-2"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
                Find Turfs
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground font-display">150+</p>
              <p className="text-sm text-muted-foreground">Premium Turfs</p>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground font-display">6</p>
              <p className="text-sm text-muted-foreground">Major Cities</p>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground font-display">50K+</p>
              <p className="text-sm text-muted-foreground">Happy Players</p>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground font-display">20%</p>
              <p className="text-sm text-muted-foreground">Multi-Hour Discount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};
