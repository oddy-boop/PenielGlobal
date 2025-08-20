
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// This is the email you configured in your Resend account's "Domains" section
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL"); 
const RECIPIENT_EMAIL = Deno.env.get("CONTACT_FORM_RECIPIENT_EMAIL");

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY || !SENDER_EMAIL || !RECIPIENT_EMAIL) {
      throw new Error("Missing required environment variables for email sending.");
    }
    
    const { name, email, subject, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: `Contact Form <${SENDER_EMAIL}>`,
      to: [RECIPIENT_EMAIL],
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <h2>New Message from Peniel Global Ministry Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
      reply_to: email
    });

    if (error) {
      console.error({ error });
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(String(err?.message ?? err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
