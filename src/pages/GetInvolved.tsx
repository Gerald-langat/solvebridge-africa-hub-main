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
import { FileText, Users, HandshakeIcon, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const actionTiles = [
  {
    icon: FileText,
    title: "Submit a Problem",
    description: "Share a challenge you'd pay to see solved.",
    action: "Submit Problem",
    link: "/submit-problem",
    color: "from-primary/20 to-primary/10"
  },
  {
    icon: Users,
    title: "Join as a Founder",
    description: "Find a problem that fits your skills and build a solution.",
    action: "Sign Up",
    link: "/auth",
    color: "from-secondary/20 to-secondary/10"
  },
  {
    icon: HandshakeIcon,
    title: "Partner or Donate",
    description: "Support our mission through funding or expertise.",
    action: "Get in Touch",
    link: "#contact-form",
    color: "from-accent/20 to-accent/10"
  }
];

export default function GetInvolved() {
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
            {actionTiles.map((tile, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 overflow-hidden border-primary/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tile.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{tile.title}</CardTitle>
                  <CardDescription className="text-base pt-2">
                    {tile.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button 
                    asChild 
                    variant="default"
                    className="w-full group-hover:shadow-glow transition-all"
                  >
                    <Link to={tile.link}>
                      {tile.action}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Sidebar */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto" id="contact-form">
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
                      <a href="mailto:hello@solvebridge.africa" className="text-sm text-primary hover:underline">
                        hello@solvebridge.africa
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">+254 7XX XXX XXX</p>
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
