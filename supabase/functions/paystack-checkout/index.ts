import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_KEY = Deno.env.get("paystack_API_KEY");
    if (!PAYSTACK_KEY) {
      throw new Error("Paystack API key not configured");
    }

    const { email, amount, plan_name } = await req.json();

    if (!email || !amount) {
      return new Response(
        JSON.stringify({ error: "Email and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const callbackUrl = `${SUPABASE_URL}/functions/v1/paystack-webhook`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // in kobo
        currency: "NGN",
        callback_url: typeof globalThis !== "undefined" ? undefined : undefined,
        metadata: {
          plan_name,
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: plan_name },
          ],
        },
      }),
    });

    const data = await res.json();

    if (!data.status) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    return new Response(
      JSON.stringify({
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
        access_code: data.data.access_code,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Paystack checkout error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
