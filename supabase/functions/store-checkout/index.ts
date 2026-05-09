import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, amount, order_id, order_number, store_name, store_slug } = await req.json();

    if (!email || !amount || !order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paystackKey = Deno.env.get("paystack_API_KEY");
    if (!paystackKey) {
      return new Response(
        JSON.stringify({ error: "Payment not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: "NGN",
        reference: `STORE-${order_number}-${Date.now()}`,
        callback_url: `${req.headers.get("origin") || "https://smartbiz.team"}/store/order-success?order_id=${order_id}&slug=${store_slug || ""}`,
        metadata: {
          order_id,
          order_number,
          store_name,
          type: "store_order",
        },
      }),
    });

    const result = await response.json();

    if (!result.status) {
      return new Response(
        JSON.stringify({ error: result.message || "Payment initialization failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order with payment reference
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    await fetch(`${supabaseUrl}/rest/v1/store_orders?id=eq.${order_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        payment_reference: result.data.reference,
        updated_at: new Date().toISOString(),
      }),
    });

    return new Response(
      JSON.stringify({ authorization_url: result.data.authorization_url, reference: result.data.reference }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
