import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Rodgers Wambua",
    role: "Founder & CEO",
    bio: "Visionary social innovator connecting technology, empathy, and purpose.",
    quote: "Innovation should start where people hurt most.",
    linkedin: "https://www.linkedin.com/in/rodgers-wambua-725763180/",
    image: "../images/rodger.jpg"
  }
];

const advisors = [
  {
    name: "Impact Advisor",
    role: "Strategic Partnerships",
    bio: "Coming Soon",
    linkedin: "https://www.linkedin.com/in/rodgers-wambua-725763180/"
  },
  {
    name: "Technical Lead",
    role: "Technology & Innovation",
    bio: "Technical Lead with a passion for building scalable solutions that drive social impact.",
    linkedin: "https://www.linkedin.com/in/rodgers-wambua-725763180/",
    image: "../images/tech.jpg"
  },
  {
    name: "Program Director",
    role: "Operations & Growth",
    bio: "Coming Soon",
    linkedin: "https://www.linkedin.com/in/rodgers-wambua-725763180/"
  }
];

export default function Team() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Our Team</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Meet the{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Bridge Builders
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The passionate team connecting Africa's problems to solutions
            </p>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <Card className="border-primary/20 shadow-elegant overflow-hidden">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 aspect-square overflow-hidden p-3">
                  <img 
                    src={teamMembers[0].image} 
                    alt={teamMembers[0].name}
                    className="w-full  rounded-full h-full object-cover"
                  />
                </div>
                <CardContent className="md:col-span-3 p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">Founder</Badge>
                  <h2 className="text-4xl font-bold mb-2">{teamMembers[0].name}</h2>
                  <p className="text-xl text-primary font-semibold mb-6">{teamMembers[0].role}</p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {teamMembers[0].bio}
                  </p>
                  <div className="bg-muted/50 border-l-4 border-primary p-6 mb-6 rounded-r">
                    <p className="text-lg italic text-foreground">"{teamMembers[0].quote}"</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-fit hover:bg-primary hover:text-primary-foreground transition-all"
                    asChild
                  >
                    <a href={teamMembers[0].linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect on LinkedIn
                    </a>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Advisors Grid */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Advisory Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders guiding our mission to transform Africa's innovation ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {advisors.map((advisor, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-primary/20"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl text-primary-foreground font-bold">
                             <img 
                    src={advisor.image} 
                    className="w-fit  rounded-full h-fit object-cover"
                  />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{advisor.name}</h3>
                  <p className="text-primary font-semibold mb-4">{advisor.role}</p>
                  <p className="text-muted-foreground mb-6">{advisor.bio}</p>
                  {advisor.bio !== "Coming Soon" && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              We're always looking for passionate individuals to help bridge Africa's innovation gap
            </p>
                <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@solvebridge.africa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-glow hover:scale-105 transition-transform"
                >
                  Get in Touch
                </Button>
              </a>


          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
