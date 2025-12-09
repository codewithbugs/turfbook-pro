import { turfs } from '@/lib/data';
import { TurfCard } from './TurfCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedTurfs = () => {
  const featuredTurfs = turfs.filter((t) => t.featured).slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="text-gradient">Turfs</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Top-rated venues handpicked for the best playing experience
            </p>
          </div>
          <Link to="/turfs" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2">
              View All Turfs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTurfs.map((turf, index) => (
            <div
              key={turf.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TurfCard turf={turf} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
