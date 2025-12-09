import { Link } from 'react-router-dom';
import { cities } from '@/lib/data';
import { MapPin, ArrowRight } from 'lucide-react';

export const CitySelector = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Available in <span className="text-gradient">6 Cities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Find the perfect turf in your city
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city, index) => (
            <Link
              key={city.id}
              to={`/turfs?city=${city.name}`}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative bg-card border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{city.name}</h3>
                <p className="text-sm text-muted-foreground">{city.turfCount} turfs</p>
                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
