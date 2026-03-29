import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Search, Trash2, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Customer {
  id: string; name: string; email: string | null; phone: string | null; company: string | null; notes: string | null; created_at: string;
}

export default function CRM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (data) setCustomers(data as Customer[]);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("customers").insert({
      user_id: user!.id, name, email: email || null, phone: phone || null, company: company || null, notes: notes || null,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "✓ Customer added!" }); setShowCreate(false); setName(""); setEmail(""); setPhone(""); setCompany(""); setNotes(""); fetchCustomers(); }
    setSaving(false);
  };

  const deleteCustomer = async (id: string) => { await supabase.from("customers").delete().eq("id", id); fetchCustomers(); };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your contacts and clients</p>
        </div>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Customer</Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border bg-card p-3.5 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2"><Users className="h-3.5 w-3.5 text-blue-500" /></div>
          <p className="font-display text-lg font-bold">{customers.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Customers</p>
        </div>
        <div className="border border-border bg-card p-3.5 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2"><Users className="h-3.5 w-3.5 text-emerald-500" /></div>
          <p className="font-display text-lg font-bold">
            {customers.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
          </p>
          <p className="text-[10px] text-muted-foreground">Added This Month</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-xl">
          <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-sm">No customers yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first customer to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="border border-border bg-card p-3.5 rounded-xl hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => deleteCustomer(c.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <h3 className="font-display font-bold text-sm mb-0.5">{c.name}</h3>
              {c.company && <p className="text-[10px] text-muted-foreground mb-2">{c.company}</p>}
              <div className="space-y-1">
                {c.email && <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{c.email}</span></div>}
                {c.phone && <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Phone className="h-3 w-3 shrink-0" /> {c.phone}</div>}
              </div>
              {c.notes && <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 italic">{c.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Add Customer</DialogTitle>
            <DialogDescription>Add a new customer to your CRM.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes..." rows={2} className="rounded-lg" />
            </div>
            <Button className="w-full rounded-lg" onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Add Customer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
