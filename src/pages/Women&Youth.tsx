import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";


function Women() {
  return (
   <DashboardLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">Women & Youth Empowerment</CardTitle>
              </div>
              <CardDescription>
                We prioritize capacity-building, leadership, and funding access for women- and youth-led innovations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We support women and youth innovators through mentorship, training, funding, and community support.
                Join our network to access resources, partnerships, and opportunities to grow your impact.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card/40">
                  <CardContent>
                    <div className="font-bold text-lg">Capacity Building</div>
                    <p className="text-sm text-muted-foreground">
                      Training sessions and workshops for skills growth.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/40">
                  <CardContent>
                    <div className="font-bold text-lg">Funding Access</div>
                    <p className="text-sm text-muted-foreground">
                      Access grants, investors, and partnership opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/40">
                  <CardContent>
                    <div className="font-bold text-lg">Leadership Programs</div>
                    <p className="text-sm text-muted-foreground">
                      Empowering future leaders to build sustainable innovations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/40">
                  <CardContent>
                    <div className="font-bold text-lg">Community Support</div>
                    <p className="text-sm text-muted-foreground">
                      Join a network of innovators and mentors across Africa.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full" size="lg">
                Join the Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Women


