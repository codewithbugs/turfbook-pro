import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TurfCard } from '@/components/TurfCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { store } from '@/lib/store';
import { useStore } from '@/lib/store';
import { cities } from '@/lib/data';
import { Search, MapPin, Trophy, SlidersHorizontal } from 'lucide-react';

const Turfs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { turfs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const cityFilter = searchParams.get('city') || '';
  const sportFilter = searchParams.get('sport') || '';

  const setCityFilter = (city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city) params.set('city', city);
    else params.delete('city');
    setSearchParams(params);
  };

  const setSportFilter = (sport: string) => {
    const params = new URLSearchParams(searchParams);
    if (sport) params.set('sport', sport);
    else params.delete('sport');
    setSearchParams(params);
  };

  const filteredTurfs = useMemo(() => {
    return turfs.filter((turf) => {
      // Only show approved turfs to users
      if (turf.approvalStatus !== 'approved') return false;
      if (cityFilter && turf.city !== cityFilter) return false;
      if (sportFilter && !turf.sports.includes(sportFilter as any)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          turf.name.toLowerCase().includes(q) ||
          turf.address.toLowerCase().includes(q) ||
          turf.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [turfs, cityFilter, sportFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse <span className="text-gradient">Turfs</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find and book the perfect turf for your game
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search turfs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Sports</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                </select>
              </div>

              <Button
                variant="outline"
                className="h-12 gap-2"
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredTurfs.length}</span> turfs
            </p>
          </div>

          {filteredTurfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTurfs.map((turf, index) => (
                <TurfCard
                  key={turf.id}
                  turf={turf}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No turfs found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Turfs;
