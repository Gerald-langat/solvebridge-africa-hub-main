import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .contains("participants", [user.id])
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(messagesData?.map(m => m.sender_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", userIds);

      // Merge profiles into messages
      return messagesData?.map(msg => ({
        ...msg,
        profile: profilesData?.find(p => p.id === msg.sender_id)
      }));
    },
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedConversation) throw new Error("Missing requirements");
      
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversation] });
      setMessageText("");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 h-[calc(100vh-200px)]">
        <h1 className="text-3xl font-bold mb-6">Mentor Chat</h1>
        
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Conversations List */}
          <Card className="col-span-4 flex flex-col">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {conversations?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations?.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conv.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="font-medium">{conv.title || "Conversation"}</div>
                        <div className="text-sm opacity-75">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="col-span-8 flex flex-col">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? "Chat" : "Select a conversation"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <ScrollArea className="flex-1 pr-4 mb-4">
                    <div className="space-y-4">
                      {messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${
                            msg.sender_id === user?.id ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar>
                            <AvatarFallback>
                              {msg.profile?.first_name?.[0]}
                              {msg.profile?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-4 max-w-[70%] ${
                              msg.sender_id === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.profile?.first_name} {msg.profile?.last_name}
                            </p>
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-75 mt-2">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && messageText.trim()) {
                          sendMessageMutation.mutate(messageText);
                        }
                      }}
                    />
                    <Button
                      onClick={() => sendMessageMutation.mutate(messageText)}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a conversation to start chatting
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}