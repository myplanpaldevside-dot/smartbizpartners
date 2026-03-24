import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Palette, Type, Layout, Eye, Copy, Download, Sparkles, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const templates = [
  { id: "minimal", name: "Minimal", desc: "Clean, modern, text-focused" },
  { id: "bold", name: "Bold", desc: "Vibrant colors, big imagery" },
  { id: "elegant", name: "Elegant", desc: "Sophisticated, premium feel" },
  { id: "playful", name: "Playful", desc: "Fun, colorful, animated" },
];

const colorSchemes = [
  { id: "ocean", name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#14b8a6"] },
  { id: "sunset", name: "Sunset", colors: ["#f43f5e", "#f97316", "#eab308"] },
  { id: "forest", name: "Forest", colors: ["#22c55e", "#10b981", "#059669"] },
  { id: "midnight", name: "Midnight", colors: ["#6366f1", "#8b5cf6", "#a855f7"] },
];

export default function WebsiteGenerator() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [businessDesc, setBusinessDesc] = useState("");
  const [template, setTemplate] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [tagline, setTagline] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const businessName = profile?.business_name || "Your Business";

  const handleGenerate = async () => {
    if (!businessDesc.trim()) {
      toast({ title: "Describe your business first", variant: "destructive" });
      return;
    }
    setGenerating(true);
    // Simulate generation
    await new Promise((r) => setTimeout(r, 3000));
    setGenerating(false);
    setGenerated(true);
    toast({ title: "Website preview generated!" });
  };

  const selectedColors = colorSchemes.find((c) => c.id === colorScheme)?.colors || colorSchemes[0].colors;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">Website Generator</h1>
        <p className="text-sm text-muted-foreground">Build a professional website for {businessName} in minutes</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s ? "gradient-brand text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{s}</div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-2">
          {step === 1 ? "Business Info" : step === 2 ? "Design" : "Preview"}
        </span>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 border border-border bg-card p-6 rounded-lg">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Name</Label>
            <Input value={businessName} disabled className="opacity-60" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Describe Your Business</Label>
            <textarea
              value={businessDesc}
              onChange={(e) => setBusinessDesc(e.target.value)}
              placeholder="We sell handmade accessories for women across Nigeria..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline (optional)</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Quality you can trust" />
          </div>
          <Button onClick={() => setStep(2)} className="gradient-brand text-primary-foreground" disabled={!businessDesc.trim()}>
            Next: Choose Design <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Choose Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    template === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"
                  }`}
                >
                  <Layout className="h-5 w-5 text-primary mb-2" />
                  <p className="font-display font-bold text-sm">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Scheme</Label>
            <div className="grid grid-cols-2 gap-3">
              {colorSchemes.map((c) => (
                <button key={c.id} onClick={() => setColorScheme(c.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    colorScheme === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {c.colors.map((col) => (
                      <div key={col} className="w-5 h-5 rounded-full" style={{ backgroundColor: col }} />
                    ))}
                  </div>
                  <p className="font-display font-bold text-sm">{c.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => { setStep(3); handleGenerate(); }} className="gradient-brand text-primary-foreground" disabled={!template}>
              <Sparkles className="h-4 w-4 mr-2" /> Generate Website
            </Button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {generating ? (
            <div className="border border-border bg-card rounded-lg p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Generating your website...</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">This takes a few seconds</p>
            </div>
          ) : generated ? (
            <>
              {/* Preview mockup */}
              <div className="border border-border bg-card rounded-lg overflow-hidden">
                <div className="h-8 bg-muted flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald/40" />
                  <span className="text-[10px] text-muted-foreground ml-2">{businessName.toLowerCase().replace(/\s+/g, "")}.smartbiz.site</span>
                </div>
                <div className="p-8 space-y-6" style={{ background: `linear-gradient(135deg, ${selectedColors[0]}11, ${selectedColors[2]}11)` }}>
                  <div className="text-center space-y-3">
                    <h2 className="font-display text-3xl font-bold" style={{ color: selectedColors[0] }}>{businessName}</h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">{tagline || businessDesc.slice(0, 100)}</p>
                    <Button size="sm" style={{ backgroundColor: selectedColors[0] }} className="text-white">Get Started</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                    {["About Us", "Services", "Contact"].map((section) => (
                      <div key={section} className="bg-card border border-border p-3 rounded-lg text-center">
                        <p className="text-xs font-bold">{section}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <Palette className="h-4 w-4 mr-2" /> Edit Design
                </Button>
                <Button className="gradient-brand text-primary-foreground" onClick={() => toast({ title: "Website publishing coming soon!", description: "We're working on custom domain hosting." })}>
                  <Globe className="h-4 w-4 mr-2" /> Publish Website
                </Button>
              </div>
            </>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}
