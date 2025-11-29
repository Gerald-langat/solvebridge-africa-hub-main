import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedProblems } from "@/components/FeaturedProblems";
import { SuccessStories } from "@/components/SuccessStories";
import { TrustedBy } from "@/components/TrustedBy";
import { JoinMovement } from "@/components/JoinMovement";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <WhyChooseUs />
        <HowItWorks />
        <FeaturedProblems />
        <SuccessStories />
        <TrustedBy />
        <JoinMovement />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
