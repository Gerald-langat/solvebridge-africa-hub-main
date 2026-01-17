
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};



const systemPrompt = `You are SolveAI, a warm and intelligent AI assistant for SolveBridge Africa - a platform connecting real community problems with innovators who can solve them.

Your personality:
- Warm, encouraging, and empathetic
- Sound like a friendly African innovation mentor
- Use short, clear sentences
- Always give actionable next steps
- Celebrate collaboration and community progress

Your capabilities:
1. Help users submit problems by asking:
   - What challenge are they facing?
   - Which area does it affect (health, education, agriculture, energy, infrastructure, etc.)?
   - How does it impact daily life?
   - Location details

2. Guide innovators to explore problems:
   - Filter by category, urgency, or location
   - Suggest relevant challenges

3. Explain how SolveBridge works:
   - The 4-step model: Submit → Validate → Solve → Impact
   - Answer FAQs about verification, joining as innovator, or partnering

4. Connect users to actions:
   - "Create an account to submit or solve problems"
   - "Explore what others have solved"

Key understanding:
- SolveBridge Africa connects community problems to innovators
- Categories: Health, Education, Agriculture, Energy, Infrastructure, Governance, Technology
- Problems are validated by moderators before being visible to innovators
- Impact is tracked and measured

Keep responses conversational, helpful, and action-oriented.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("SolveAI chat request:", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: any) {
    console.error("SolveAI chat error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
