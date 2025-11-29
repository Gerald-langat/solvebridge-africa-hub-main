import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnerNotificationRequest {
  type: "invitation" | "bounty_launch" | "access_approved";
  partnerName: string;
  partnerEmail: string;
  portalLink?: string;
  bountyTitle?: string;
  sponsorOrg?: string;
  rewardAmount?: number;
  deadlineDate?: string;
  bountyLink?: string;
  projectName?: string;
  dashboardLink?: string;
}

const getEmailContent = (req: PartnerNotificationRequest) => {
  switch (req.type) {
    case "invitation":
      return {
        subject: "🌍 Welcome to SolveBridge Africa Partner Portal",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007BFF;">Welcome to SolveBridge Africa!</h2>
            <p>Hi ${req.partnerName},</p>
            <p>You've been invited to explore validated challenges on SolveBridge Africa.</p>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">Use your company email to log in and start discovering collaboration opportunities.</p>
            </div>
            <a href="${req.portalLink || `${Deno.env.get("VITE_SUPABASE_URL")}/auth`}" 
               style="display: inline-block; background: linear-gradient(135deg, #007BFF, #00d4ff); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold;">
              Access Partner Portal
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Partnership Team</p>
          </div>
        `,
      };
    
    case "bounty_launch":
      return {
        subject: "🚀 New Innovation Bounty: " + req.bountyTitle,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">New Bounty Launched!</h2>
            <p>Hi ${req.partnerName},</p>
            <p>We've launched a new bounty sponsored by <strong>${req.sponsorOrg}</strong>.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #007BFF;">${req.bountyTitle}</h3>
              <p><strong>Reward:</strong> $${req.rewardAmount?.toLocaleString() || "TBD"}</p>
              <p><strong>Deadline:</strong> ${req.deadlineDate || "To be announced"}</p>
            </div>
            <p>Explore details and track submissions:</p>
            <a href="${req.bountyLink || `${Deno.env.get("VITE_SUPABASE_URL")}/admin/bounties`}" 
               style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              View Bounty Details
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Bounties Team</p>
          </div>
        `,
      };
    
    case "access_approved":
      return {
        subject: "✅ Access Granted — " + req.projectName,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Access Approved!</h2>
            <p>Hi ${req.partnerName},</p>
            <p>Your request to view the <strong>${req.projectName}</strong> workspace has been approved.</p>
            <p>You can now review progress and download reports via your dashboard.</p>
            <a href="${req.dashboardLink || `${Deno.env.get("VITE_SUPABASE_URL")}/dashboard`}" 
               style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Go to Dashboard
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Admin</p>
          </div>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response('Unauthorized', { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if user has admin or partner role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
      
    const hasRequiredRole = roles?.some(r => ['super_admin', 'program_manager', 'partner'].includes(r.role));
    if (!hasRequiredRole) {
      console.error("User lacks required role:", user.id);
      return new Response('Forbidden - Admin or Partner role required', { 
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const requestData: PartnerNotificationRequest = await req.json();
    console.log("Sending partner notification:", requestData.type, "by user:", user.id);

    const emailContent = getEmailContent(requestData);

    const emailResponse = await resend.emails.send({
      from: "SolveBridge Africa <onboarding@resend.dev>",
      to: [requestData.partnerEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending partner notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
