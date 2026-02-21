import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { message } = await req.json();

  return new Response(
    JSON.stringify({ reply: `You said: ${message}` }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});