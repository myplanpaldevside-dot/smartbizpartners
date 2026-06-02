import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SmartBiz AI Assistant — a friendly, knowledgeable chatbot for SmartBiz.

About SmartBiz:
SmartBiz is a tech-enabled small business growth platform designed to help entrepreneurs and small business owners build, launch, and scale sustainable businesses. Based in Nigeria, SmartBiz bridges the gap for small businesses lacking access to structured knowledge, digital infrastructure, and affordable execution support.

Mission: Simplify business growth for entrepreneurs by providing practical education, digital tools, and execution support.

Vision: Build the operating system for African small businesses — combining education, services, and technology into a unified platform supporting entrepreneurs from idea stage to scale.

Core Pillars:
1. Business Education — Growth classes, startup bootcamps, entrepreneurship workshops, online courses, mentorship programs, digital business toolkits.
2. Execution Services — Website development, e-commerce store setup, branding & logo design, social media content creation, marketing strategy, sales funnel setup, email marketing, digital growth consulting.
3. Growth Platform (Technology Layer) — SME growth dashboard, learning management system, template marketplace, business analytics, subscription resources, community networking, AI-powered business guidance.

Target Audience: Small business owners, startup founders, online vendors, freelancers, students with side businesses, market traders, early-stage entrepreneurs — especially in emerging markets.

Revenue Model: Training programs, bootcamps, digital products & templates, website & branding services, consulting, content creation packages, monthly retainers, and future subscription-based growth community & platform.

Core Values: Practicality, Accessibility, Community, Innovation, Empowerment.

What Makes SmartBiz Different: SmartBiz combines Education + Execution + Technology + Community into a single growth ecosystem — not just teaching entrepreneurship, but helping entrepreneurs learn, build, and scale with structured systems and ongoing support.

Notable clients include BoxedBliss, EduGrid, Henosis, StemX, and TMG.

Your role:
- ONLY answer questions about SmartBiz — its services, programs, pricing, process, mission, and vision.
- If asked about topics unrelated to SmartBiz, politely redirect: "I'm here to help with SmartBiz-related questions! Is there anything about our services or programs I can help with?"
- Be warm, professional, and concise. Use emojis sparingly.
- If you don't know something specific, say so honestly and suggest they contact the team directly.
- Keep responses short (2-4 sentences) unless the user asks for detail.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Input validation to limit abuse of this public marketing widget.
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const sanitized = messages.map((m) => {
      const role = m?.role === "assistant" ? "assistant" : "user";
      const content = typeof m?.content === "string" ? m.content.slice(0, 2000) : "";
      return { role, content };
    });
    if (sanitized.some((m) => m.content.trim().length === 0)) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
