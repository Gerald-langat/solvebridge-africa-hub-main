import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const FounderSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Founder Message */}
          <Card className="p-8 md:p-12 mb-16 shadow-medium animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-full aspect-square rounded-2xl bg-gradient-accent overflow-hidden shadow-soft">
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    RW
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Innovation Rooted in{" "}
                  <span className="bg-gradient-accent bg-clip-text text-transparent">
                    Empathy
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  I'm <strong>Rodgers Wambua</strong>, a Data Manager and
                  Business Analyst from Nairobi. SolveBridge Africa was born
                  from the belief that innovation should begin with listening.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  We exist to turn real community problems into data-driven,
                  impactful startups that transform lives across Africa.
                </p>
                <Button variant="outline" className="group">
                  Read Our Story
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Button>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build What Africa{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Truly Needs?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Together, we can transform Africa's innovation ecosystem — one
              problem at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 shadow-glow hover:scale-105 transition-all"
              >
                <Link to="/auth">Submit a Problem</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
              >
                <Link to="/auth">Join as an Innovator</Link>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <Card className="p-8 bg-gradient-subtle shadow-soft">
            <h3 className="text-2xl font-bold text-center mb-8">Get in Touch</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="mailto:rodgerswambua30@gmail.com"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-card transition-colors group"
              >
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">rodgerswambua30@gmail.com</div>
                </div>
              </a>
              <a
                href="tel:+254702660246"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-card transition-colors group"
              >
                <div className="bg-accent/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <Phone className="text-accent" size={24} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">+254 702 660 246</div>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 rounded-lg">
                <div className="bg-primary-light/10 p-3 rounded-full">
                  <MapPin className="text-primary-light" size={24} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">Nairobi, Kenya</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
