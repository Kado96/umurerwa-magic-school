import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import NewsTickerBar from "@/components/NewsTickerBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <ContactSection />
      <Footer />
      <NewsTickerBar />
    </div>
  );
};

export default Index;
