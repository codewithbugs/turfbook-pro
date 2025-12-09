import { Shield, Clock, Percent, Headphones, Star, Zap } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book your slot in seconds with our seamless booking experience',
  },
  {
    icon: Percent,
    title: 'Multi-Hour Discounts',
    description: 'Get up to 20% off when you book for multiple hours',
  },
  {
    icon: Shield,
    title: 'Verified Venues',
    description: 'All turfs are personally verified for quality and safety',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book anytime, play anytime with extended operating hours',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'FIFA-standard turfs with professional grade equipment',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Dedicated support team to assist you before and after booking',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">TurfBook</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Experience the best turf booking platform in India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
