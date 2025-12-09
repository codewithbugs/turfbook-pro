import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Zap } from 'lucide-react';
import { Turf } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TurfCardProps {
  turf: Turf;
  className?: string;
}

export const TurfCard = ({ turf, className }: TurfCardProps) => {
  return (
    <Card variant="elevated" className={cn("overflow-hidden group", className)}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {turf.featured && (
            <Badge variant="accent" className="text-xs">Featured</Badge>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex gap-1">
          {turf.sports.map((sport) => (
            <Badge key={sport} variant="sport" className="text-xs capitalize">
              {sport}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold text-foreground">{turf.rating}</span>
          <span className="text-xs text-muted-foreground">({turf.reviewCount})</span>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {turf.name}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{turf.address}</span>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{turf.openTime} - {turf.closeTime}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {turf.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
              {amenity}
            </span>
          ))}
          {turf.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
              +{turf.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-foreground font-display">
              ₹{turf.pricePerHour.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </div>
          <Link to={`/turf/${turf.id}`}>
            <Button variant="hero" size="sm">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
