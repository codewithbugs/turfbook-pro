import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { FeaturedTurfs } from '@/components/FeaturedTurfs';
import { CitySelector } from '@/components/CitySelector';
import { WhyChooseUs } from '@/components/WhyChooseUs';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedTurfs />
      <CitySelector />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
