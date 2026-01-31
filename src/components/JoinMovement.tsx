import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Lightbulb, HandshakeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const JoinMovement = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Movement
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of a community that's bridging Africa's challenges to real solutions. 
              Whether you're facing a problem, ready to solve one, or want to support innovation, 
              there's a place for you here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Submit a Problem</h3>
              <p className="text-muted-foreground mb-6">
                Share a challenge your community faces. Your voice matters and can spark real change.
              </p>
              <Button asChild className="w-full">
                <Link to="/submit-problem">Get Started</Link>
              </Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Become an Innovator</h3>
              <p className="text-muted-foreground mb-6">
                Browse verified problems and build solutions that create lasting impact across Africa.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Join as Innovator</Link>
              </Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandshakeIcon className="text-primary-light" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Partner With Us</h3>
              <p className="text-muted-foreground mb-6">
                Support the ecosystem as an organization, investor, or mentor guiding the next generation.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Learn More</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
