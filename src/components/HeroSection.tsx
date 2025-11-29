import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Users } from "lucide-react";
import heroImage from "@/assets/hero-collaboration.jpg";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African innovators collaborating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <Lightbulb size={60} className="text-primary" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Users size={60} className="text-accent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Africa's Changemakers —{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Bridging Real Problems to Real Solutions
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            SolveBridge Africa helps innovators, founders, and communities uncover real challenges people face — and turn them into impactful, sustainable startup ideas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 shadow-glow hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              <Link to="/explore">
                Discover Problems
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              <Link to="/auth">Join as a Founder</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              <Link to="/partners">Partner with Us</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Problems", value: "100+" },
              { label: "Innovators", value: "200+" },
              { label: "MVPs Built", value: "20+" },
              { label: "Partnerships", value: "50+" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-soft border border-border">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
