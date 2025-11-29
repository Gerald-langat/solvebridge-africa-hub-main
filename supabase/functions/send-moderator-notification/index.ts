import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ModeratorNotificationRequest {
  type: "new_submission" | "validation_confirmed" | "duplicate_warning";
  moderatorName: string;
  moderatorEmail: string;
  problemTitle: string;
  region?: string;
  dashboardLink?: string;
}

const getEmailContent = (req: ModeratorNotificationRequest) => {
  switch (req.type) {
    case "new_submission":
      return {
        subject: "🆕 New Community Problem Needs Review",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007BFF;">New Problem Submission</h2>
            <p>Hi ${req.moderatorName},</p>
            <p>A new community problem has been submitted on SolveBridge.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Title:</strong> ${req.problemTitle}<br/>
              <strong>Region:</strong> ${req.region || "Not specified"}
            </div>
            <p>Please log in to the Admin Dashboard → "Pending Submissions" to review, validate, or request info.</p>
            <a href="${req.dashboardLink || `${Deno.env.get("VITE_SUPABASE_URL")}/admin/moderation`}" 
               style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Review Now
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge System</p>
          </div>
        `,
      };
    
    case "validation_confirmed":
      return {
        subject: "✅ Problem Validated Successfully",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Validation Complete</h2>
            <p>Hi ${req.moderatorName},</p>
            <p>Your validation of <strong>${req.problemTitle}</strong> is complete and now visible to Program Managers.</p>
            <p style="color: #28a745; font-weight: bold;">Thank you for keeping quality high!</p>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Team</p>
          </div>
        `,
      };
    
    case "duplicate_warning":
      return {
        subject: "⚠️ Duplicate Detected: " + req.problemTitle,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff9800;">Duplicate Warning</h2>
            <p>Hi ${req.moderatorName},</p>
            <p>The system detected a potential duplicate for <strong>${req.problemTitle}</strong>.</p>
            <p>Please review and merge if appropriate.</p>
            <a href="${req.dashboardLink || `${Deno.env.get("VITE_SUPABASE_URL")}/admin/moderation`}" 
               style="display: inline-block; background: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Review Duplicate
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

    // Check if user has moderator or admin role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
      
    const hasAdminRole = roles?.some(r => ['super_admin', 'moderator', 'program_manager'].includes(r.role));
    if (!hasAdminRole) {
      console.error("User lacks required role:", user.id);
      return new Response('Forbidden - Admin role required', { 
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const requestData: ModeratorNotificationRequest = await req.json();
    console.log("Sending moderator notification:", requestData.type, "by user:", user.id);

    const emailContent = getEmailContent(requestData);

    const emailResponse = await resend.emails.send({
      from: "SolveBridge Africa <onboarding@resend.dev>",
      to: [requestData.moderatorEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending moderator notification:", error);
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
