import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Launch() {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Countdown Timer
  useEffect(() => {
    const targetDate = new Date("2026-03-01T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email.");
    }

    if (!email.includes("@")) {
      return toast.error("Please enter a valid email.");
    }

    const { error } = await supabase.from("subscribers").insert({ email });

    if (error) {
      toast.error("Subscription failed. Try again later.");
      return;
    }

    toast.success("Thank you for subscribing! We'll keep you updated.");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Rocket className="h-24 w-24 mx-auto text-primary animate-bounce" />

            <h1 className="text-5xl md:text-6xl font-bold">
              We're Building Africa's Future
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
              One Problem at a Time
            </p>

            <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid grid-cols-4 gap-4 mb-8 sm:grid-cols-2">
                  {[
                    { label: "Days", value: countdown.days },
                    { label: "Hours", value: countdown.hours },
                    { label: "Minutes", value: countdown.minutes },
                    { label: "Seconds", value: countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-4xl font-bold text-primary">
                        {item.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email for updates"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg">
                    Notify Me
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    1,000+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Problems to Solve
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    200+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Innovators Ready
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    50+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Partner Organizations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
