import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // SECURITY: Require a valid authenticated user.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = claims.claims.email as string | undefined;
    const { plan_name } = await req.json();

    if (!plan_name) {
      return new Response(
        JSON.stringify({ error: "plan_name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "No email associated with this account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Never trust a client-supplied amount. Look up the real plan
    // price from the database and charge exactly that.
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: plan, error: planError } = await adminClient
      .from("subscription_plans")
      .select("price, currency, name")
      .eq("name", plan_name)
      .maybeSingle();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Selected plan is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trustedAmountKobo = Math.round(Number(plan.price) * 100);
    if (!Number.isFinite(trustedAmountKobo) || trustedAmountKobo <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid plan price" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("origin");
    const callbackUrl = origin ? `${origin}/smartbooks` : undefined;

    const payload: Record<string, unknown> = {
      // Always charge the authenticated user's own email
      email: userEmail,
      amount: trustedAmountKobo,
      currency: plan.currency || "NGN",
      metadata: {
        plan_name: plan.name,
        custom_fields: [
          { display_name: "Plan", variable_name: "plan", value: plan.name },
        ],
      },
    };

    if (callbackUrl) {
      payload.callback_url = callbackUrl;
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
