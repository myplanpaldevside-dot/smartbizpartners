import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_KEY = Deno.env.get("paystack_API_KEY");
    if (!PAYSTACK_KEY) throw new Error("Paystack key not configured");

    const body = await req.text();

    // SECURITY: Signature verification is MANDATORY. Reject any request that
    // does not carry a valid HMAC-SHA512 signature so attackers cannot forge events.
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      console.error("Missing Paystack signature");
      return new Response("Missing signature", { status: 401, headers: corsHeaders });
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PAYSTACK_KEY),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const hash = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hash !== signature) {
      console.error("Invalid Paystack signature");
      return new Response("Invalid signature", { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);
    console.log("Paystack webhook event:", event.event);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (event.event === "charge.success") {
      const { customer, reference, amount } = event.data;
      const email = customer?.email;

      if (!email) {
        console.error("No email in webhook payload");
        return new Response("OK", { status: 200 });
      }

      // Find user by email
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (!profiles || profiles.length === 0) {
        console.error("No profile found for email:", email);
        return new Response("OK", { status: 200 });
      }

      const userId = profiles[0].id;
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Update or create subscription
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (existingSub && existingSub.length > 0) {
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            payment_reference: reference,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("id", existingSub[0].id);
      } else {
        // Get plan
        const { data: plans } = await supabase
          .from("subscription_plans")
          .select("id")
          .limit(1);

        if (plans && plans.length > 0) {
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: plans[0].id,
            status: "active",
            payment_reference: reference,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
          });
        }
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({ subscription_status: "active" })
        .eq("id", userId);

      console.log("Subscription activated for:", email);
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response("OK", { status: 200 });
  }
});
