import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const FinalCTA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", business_name: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("partner_inquiries").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      business_name: formData.business_name || null,
      message: formData.message,
    });
    if (error) {
      toast({ title: "Error submitting inquiry", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry submitted!", description: "We'll get back to you soon." });
      setFormData({ name: "", email: "", phone: "", business_name: "", message: "" });
      setShowPartnerForm(false);
    }
    setSubmitting(false);
  };

  return (
    <section id="contact" className="py-32 md:py-40 px-6 md:px-12 relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-8">Let's Work Together</p>
          <h2 className="font-display text-5xl md:text-[8vw] font-bold text-foreground leading-[0.85] mb-4">
            Smart businesses
          </h2>
          <h2 className="font-display text-5xl md:text-[8vw] font-bold leading-[0.85] mb-4 text-stroke">
            don't grow by
          </h2>
          <h2 className="font-display text-5xl md:text-[8vw] font-bold text-foreground leading-[0.85] mb-8">
            accident<span className="text-primary">.</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-2xl md:text-4xl font-bold text-primary mb-14"
          >
            They grow with structure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate("/smartbooks")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display font-bold text-sm tracking-[0.1em] hover:bg-foreground transition-colors duration-300 group"
            >
              START GROWING <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowPartnerForm(true)}
              className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-8 py-4 font-display font-bold text-sm tracking-[0.1em] hover:bg-primary transition-colors duration-300 group"
            >
              PARTNER WITH US <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Partner Inquiry Form Dialog */}
      <Dialog open={showPartnerForm} onOpenChange={setShowPartnerForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Partner With Us</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePartnerSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+234..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business</Label>
                <Input value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} placeholder="Company name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message *</Label>
              <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about the partnership you have in mind..." rows={4} required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={submitting}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FinalCTA;
