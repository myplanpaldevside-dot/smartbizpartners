import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import ClientsSection from "@/components/ClientsSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import TractionSection from "@/components/TractionSection";
import AwardsSection from "@/components/AwardsSection";
import VisionSection from "@/components/VisionSection";
import SocialConnectSection from "@/components/SocialConnectSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SplashScreen isVisible={showSplash} />
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <ClientsSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <StatsSection />
      <TractionSection />
      <AwardsSection />
      <VisionSection />
      <SocialConnectSection />
      <FinalCTA />
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
