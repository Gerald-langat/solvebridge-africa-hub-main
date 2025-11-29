import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImpactReportRequest {
  type: "monthly_digest" | "quarterly_report";
  recipientName: string;
  recipientEmail: string;
  month?: string;
  year?: string;
  quarter?: string;
  metrics?: {
    problemsValidated?: number;
    activeInnovators?: number;
    mvpsInProgress?: number;
    communitiesImpacted?: number;
  };
  keyHighlights?: string;
  dashboardLink?: string;
}

const getEmailContent = (req: ImpactReportRequest) => {
  switch (req.type) {
    case "monthly_digest":
      return {
        subject: `📈 SolveBridge Monthly Impact Report (${req.month} ${req.year})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007BFF;">Monthly Impact Report</h2>
            <p>Hi ${req.recipientName},</p>
            <p>Here's your monthly overview of the SolveBridge Africa pilot:</p>
            <div style="background: linear-gradient(135deg, #007BFF, #00d4ff); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="text-align: center;">
                  <h3 style="font-size: 36px; margin: 0;">${req.metrics?.problemsValidated || 0}</h3>
                  <p style="margin: 5px 0; opacity: 0.9;">Problems Validated</p>
                </div>
                <div style="text-align: center;">
                  <h3 style="font-size: 36px; margin: 0;">${req.metrics?.activeInnovators || 0}</h3>
                  <p style="margin: 5px 0; opacity: 0.9;">Active Innovators</p>
                </div>
                <div style="text-align: center;">
                  <h3 style="font-size: 36px; margin: 0;">${req.metrics?.mvpsInProgress || 0}</h3>
                  <p style="margin: 5px 0; opacity: 0.9;">MVPs in Progress</p>
                </div>
                <div style="text-align: center;">
                  <h3 style="font-size: 36px; margin: 0;">${req.metrics?.communitiesImpacted || 0}</h3>
                  <p style="margin: 5px 0; opacity: 0.9;">Communities Impacted</p>
                </div>
              </div>
            </div>
            <a href="${req.dashboardLink || `${Deno.env.get("VITE_SUPABASE_URL")}/admin/impact`}" 
               style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              View Full Dashboard →
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Impact Office</p>
          </div>
        `,
      };
    
    case "quarterly_report":
      return {
        subject: `📘 Quarterly Impact Report Q${req.quarter} ${req.year}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007BFF;">Quarterly Executive Report</h2>
            <p>Dear ${req.recipientName},</p>
            <p>Attached is your Q${req.quarter} Impact Report summarizing progress across programs and bounties.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #007BFF;">Key Highlights</h3>
              <p>${req.keyHighlights || "Comprehensive impact data and analytics included in the detailed report."}</p>
            </div>
            <div style="background: linear-gradient(135deg, #007BFF, #00d4ff); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
              <p style="margin: 0; text-align: center; font-weight: bold;">📊 Problems Validated: ${req.metrics?.problemsValidated || 0}</p>
              <p style="margin: 10px 0; text-align: center; font-weight: bold;">🚀 MVPs in Progress: ${req.metrics?.mvpsInProgress || 0}</p>
              <p style="margin: 0; text-align: center; font-weight: bold;">🌍 Communities Impacted: ${req.metrics?.communitiesImpacted || 0}</p>
            </div>
            <a href="${req.dashboardLink || `${Deno.env.get("VITE_SUPABASE_URL")}/admin/impact`}" 
               style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Download Detailed Analytics
            </a>
            <p style="color: #666; margin-top: 30px;">— SolveBridge Africa Secretariat</p>
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

    // Check if user has admin role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
      
    const hasAdminRole = roles?.some(r => ['super_admin', 'program_manager'].includes(r.role));
    if (!hasAdminRole) {
      console.error("User lacks required role:", user.id);
      return new Response('Forbidden - Admin role required', { 
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const requestData: ImpactReportRequest = await req.json();
    console.log("Sending impact report:", requestData.type, "by user:", user.id);

    const emailContent = getEmailContent(requestData);

    const emailResponse = await resend.emails.send({
      from: "SolveBridge Africa <onboarding@resend.dev>",
      to: [requestData.recipientEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending impact report:", error);
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
