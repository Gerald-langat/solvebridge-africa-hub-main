import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileText, Users, HandshakeIcon, MapPin, Mail, Phone, ArrowRight, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";


export default function GetInvolved() {
  const contactRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiry_type: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for reaching out to SolveBridge Africa — we'll respond soon.");
    setFormData({ name: "", email: "", organization: "", inquiry_type: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Get Involved</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Join the Movement —{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Be Part of Africa's Innovation Bridge
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Action Tiles */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
           {/* submit a problem */}
              <Card 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 overflow-hidden border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 from-secondary/20 to-secondary/10 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Submit a Problem</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Share a challenge you'd pay to see solved.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button 
                    asChild 
                    variant="default"
                    className="w-full group-hover:shadow-glow transition-all z-50"
                  >
                    <Link to="/submit-problem">
                      Submit a Problem
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
           {/* Join as a Founder */}
           
           <Card 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 overflow-hidden border-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 from-secondary/20 to-secondary/10 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Join as a Founder</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Find a problem that fits your skills and build a solution.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button 
                    asChild 
                    variant="default"
                    className="w-full group-hover:shadow-glow transition-all z-50"
                  >
                    <Link to="/explore">
                     Explore
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            {/* Partner or Donate */}
              <Card 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 overflow-hidden border-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 from-secondary/20 to-secondary/10 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HandshakeIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Partner or Donate</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Support our mission through funding or expertise.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                 <div
                    onClick={() => {
                      contactRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="bg-gradient-primary flex items-center justify-center px-4 py-2 rounded-md text-white font-medium cursor-pointer w-full text-center hover:shadow-glow transition-all"
                  >
                    <ArrowDown className="mr-2 w-4 h-4" />
                    <span>Get in Touch</span>
                  </div>
                  <div ref={contactRef}></div>
                </CardContent>
              </Card>
          </div>

          {/* Contact Form and Sidebar */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="lg:col-span-2 border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-3xl">Get in Touch</CardTitle>
                <CardDescription className="text-base">
                  Have questions or want to collaborate? We'd love to hear from you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Organization (Optional)</label>
                    <Input
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Inquiry Type *</label>
                    <Select 
                      value={formData.inquiry_type} 
                      onValueChange={(val) => setFormData({ ...formData, inquiry_type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full shadow-glow">
                    Send Message
                    <ArrowRight className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Nairobi Operations Office</p>
                      <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Delaware Global HQ</p>
                      <p className="text-sm text-muted-foreground">United States</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a href="mailto:solvebridgeafrica@gmail.com" className="text-sm text-primary hover:underline">
                        solvebridgeafrica@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">+254 702660246</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="border-primary/20 overflow-hidden">
                <div className="aspect-square bg-gradient-subtle flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
