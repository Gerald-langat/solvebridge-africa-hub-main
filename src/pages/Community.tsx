import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ThumbsUp, MessageSquare, Search } from "lucide-react";

const categories = ["All", "Education", "Agriculture", "Energy", "Health", "Technology", "Infrastructure"];

export default function Community() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    category: "Education",
    tags: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["discussion-posts", selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("discussion_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`);
      }

      const { data: postsData, error } = await query;
      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(postsData?.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", userIds);

      // Merge profiles into posts
      return postsData?.map(post => ({
        ...post,
        profile: profilesData?.find(p => p.id === post.user_id)
      }));
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      if (!user) throw new Error("Must be logged in");
      
      const { data, error } = await supabase
        .from("discussion_posts")
        .insert({
          user_id: user.id,
          title: postData.title,
          body: postData.body,
          category: postData.category,
          tags: postData.tags.split(",").map(t => t.trim()).filter(Boolean),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-posts"] });
      toast.success("Post created successfully!");
      setNewPost({ title: "", body: "", category: "Education", tags: "" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  const upvoteMutation = useMutation({
  mutationFn: async (postId: string) => {
    const { error } = await supabase.rpc("increment_upvotes" as any, { post_id: postId });
    if (error) {
  console.error("Upvote failed", error);
} else {
  console.log("Upvote success for", postId);
}
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["discussion-posts"] });
  }
});


  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Community Hub</h1>
            <p className="text-muted-foreground">Connect, discuss, and collaborate with innovators</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Discussion Post</DialogTitle>
                <DialogDescription>Share your ideas and start a conversation</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your topic?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newPost.category} onValueChange={(val) => setNewPost({ ...newPost, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    placeholder="Share your thoughts..."
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="innovation, startup, tech"
                  />
                </div>
                <Button
                  onClick={() => createPostMutation.mutate(newPost)}
                  disabled={!newPost.title || !newPost.body || createPostMutation.isPending}
                  className="w-full"
                >
                  {createPostMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="problem-solvers">Problem-Solvers</TabsTrigger>
            <TabsTrigger value="mentor">Mentor Advice</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <p>Loading discussions...</p>
            ) : (
              posts?.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription>
                          by {post.profile?.first_name} {post.profile?.last_name} • {new Date(post.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {post.body?.slice(0, 200) || "No content"}...
                    </p>

                    <div className="flex gap-4 items-center">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => upvoteMutation.mutate(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {post.upvotes ?? 0}
                    </Button>


                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>

                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex gap-2 ml-auto">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    </CardContent>

                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="problem-solvers">
            <p className="text-muted-foreground">Problem-solver specific discussions coming soon...</p>
          </TabsContent>

          <TabsContent value="mentor">
            <p className="text-muted-foreground">Mentor advice section coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}