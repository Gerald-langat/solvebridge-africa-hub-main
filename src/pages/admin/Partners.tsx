// admin/Partners.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Building2, Mail, User, Shield, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Partners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    logo_url: "",
    access_level: "",
    notes: "",
  });

  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createPartner = useMutation({
    mutationFn: async (partner: any) => {
      const { data, error } = await supabase
        .from("partners")
        .insert([partner])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({ title: "Partner added successfully" });
      setDialogOpen(false);
      setFormData({
        name: "",
        contact_name: "",
        contact_email: "",
        logo_url: "",
        access_level: "",
        notes: "",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error adding partner", description: error.message, variant: "destructive" });
    },
  });



  const uploadImage = async (file: File) => {
    if (!user) throw new Error("Not authenticated");
  
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
    const { error } = await supabase.storage
      .from("problem-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) throw error;
  
    const { data } = supabase.storage
      .from("problem-images")
      .getPublicUrl(fileName);
  
    return data.publicUrl;
  };

const statusMap: Record<string, string | null> = {
  full_access: "active",
  write_access: "pending",
  read_only: null,
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const status = statusMap[formData.access_level] ?? null;

  createPartner.mutate({
    ...formData,
    status,
  });
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "pending": return "bg-secondary text-secondary-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "full_access": return "bg-accent text-accent-foreground";
      case "write_only": return "bg-primary text-primary-foreground";
      case "read_only": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Partners Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage partner organizations and their access levels
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>
                  Register a new partner organization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Impact Hub Nairobi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Person</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="contact@organization.org"
                    />
                  </div>
                </div>

                  <div className="space-y-2">
              <Label>Upload Supporting Image (Optional)</Label>

              {/* Hidden file input */}
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    toast({ title: "Uploading image..." });

                    const url = await uploadImage(file);
                    setFormData({ ...formData, logo_url: url });

                    toast({ title: "Image uploaded successfully ✅" });
                  } catch (err: any) {
                    toast({
                      title: "Upload failed",
                      description: err.message,
                      variant: "destructive",
                    });
                  }
                }}
              />

              <div className="flex items-center gap-2">
    {/* URL input optional */}
    <Input
      placeholder="Or paste image URL"
      value={formData.logo_url}
      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
    />

    {/* Upload icon */}
    <button
      type="button"
      onClick={() => document.getElementById("imageFile")?.click()}
      className="p-2 border rounded-md hover:bg-muted cursor-pointer"
    >
      <Upload className="h-4 w-4 text-muted-foreground" />
    </button>
  </div>

  {/* Preview */}
  {formData.logo_url && (
    <img
      src={formData.logo_url}
      alt="Preview"
      className="mt-2 rounded-lg max-h-48 object-cover border"
    />
  )}
</div>

                <div className="space-y-2">
                  <Label htmlFor="access_level">Access Level</Label>
                  <Select value={formData.access_level} onValueChange={(value) => setFormData({ ...formData, access_level: value })}>
                    <SelectTrigger id="access_level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read_only">Read Only</SelectItem>
                      <SelectItem value="write_access">Write Access</SelectItem>
                      <SelectItem value="full_access">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any internal notes about this partner..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary">
                    Add Partner
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{partners?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
              <Building2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {partners?.filter(p => p.status === "active").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <User className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {partners?.filter(p => p.status === "pending").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partners?.filter(p => p.access_level === "full_access").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading partners...
              </CardContent>
            </Card>
          ) : partners && partners.length > 0 ? (
            partners.map((partner) => (
              <Card key={partner.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {partner.logo_url && (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name}
                          className="w-16 h-16 object-contain rounded-lg border"
                        />
                      )}
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{partner.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {partner.contact_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {partner.contact_name}
                            </span>
                          )}
                          {partner.contact_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {partner.contact_email}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(partner.status || "active")}>
                        {partner.status || "active"}
                      </Badge>
                      <Badge className={getAccessLevelColor(partner.access_level || "read_only")}>
                        {partner.access_level?.replace("_", " ") || "read only"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {partner.notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{partner.notes}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added {new Date(partner.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                No partners yet. Add your first partner organization!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
