import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";


function MVP_Validation() {
  return (

   
       <DashboardLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">MVP Validation Labs</CardTitle>
              </div>
              <CardDescription>
                Rapid-testing spaces where innovators prototype, receive user feedback, and measure early impact before scaling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Our MVP Validation Labs are designed to help innovators quickly test assumptions,
                validate market fit, and build scalable products with real user insights.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/40">
                  <CardContent className="text-center">
                    <div className="font-bold text-lg">Prototype</div>
                    <p className="text-sm text-muted-foreground">
                      Build your MVP fast using our resources and mentorship.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/40">
                  <CardContent className="text-center">
                    <div className="font-bold text-lg">User Testing</div>
                    <p className="text-sm text-muted-foreground">
                      Get feedback from real users and refine your product.
                    </p>
                  </CardContent>
                  </Card>

                <Card className="bg-card/40">
                  <CardContent className="text-center">
                    <div className="font-bold text-lg">Impact Measurement</div>
                    <p className="text-sm text-muted-foreground">
                      Measure early traction and decide whether to scale.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full" size="lg">
                Apply to Join the Lab
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>

  )
}

export default MVP_Validation
