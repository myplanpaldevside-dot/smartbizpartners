import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Search, Trash2, AlertTriangle, DollarSign, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string; name: string; sku: string | null; quantity: number; unit_price: number; category: string | null; low_stock_threshold: number; created_at: string;
}

export default function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState("");
  const [threshold, setThreshold] = useState("5");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [listInStore, setListInStore] = useState<Product | null>(null);
  const [listPrice, setListPrice] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [listSaving, setListSaving] = useState(false);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase.from("inventory").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("inventory").insert({
      user_id: user!.id, name, sku: sku || null, quantity: Number(quantity) || 0,
      unit_price: Number(unitPrice) || 0, category: category || null, low_stock_threshold: Number(threshold) || 5,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "✓ Product added!" }); setShowCreate(false); setName(""); setSku(""); setQuantity(""); setUnitPrice(""); setCategory(""); fetchProducts(); }
    setSaving(false);
  };

  const handleListInStore = async () => {
    if (!listInStore || !user) return;
    setListSaving(true);
    const { error } = await supabase.from("store_products").insert({
      user_id: user.id,
      name: listInStore.name,
      price: Number(listPrice) || listInStore.unit_price,
      description: listDesc || "",
      stock_quantity: listInStore.quantity,
      is_active: true,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✓ Added to store!" });
      setListInStore(null);
      setListPrice("");
      setListDesc("");
    }
    setListSaving(false);
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("inventory").delete().eq("id", id).eq("user_id", user!.id);
    setDeleteConfirm(null);
    fetchProducts();
    toast({ title: "Product deleted" });
  };

  const fmt = (amt: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amt);
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())));
  const lowStock = products.filter(p => p.quantity <= p.low_stock_threshold);
  const totalValue = products.reduce((s, p) => s + p.quantity * p.unit_price, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Inventory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Track products and stock levels</p>
        </div>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Products", value: String(products.length), icon: Package, color: "text-blue-500 bg-blue-500/10" },
          { label: "Low Stock", value: String(lowStock.length), icon: AlertTriangle, color: "text-red-500 bg-red-500/10" },
          { label: "Total Value", value: fmt(totalValue), icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-3.5 rounded-xl">
            <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="h-3.5 w-3.5" /></div>
            <p className="font-display text-sm sm:text-base font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-xl">
          <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-sm">No products yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between p-3.5 border border-border bg-card rounded-xl hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {p.quantity <= p.low_stock_threshold && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sku || "No SKU"} • {p.category || "Uncategorized"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-display font-bold text-sm">{p.quantity} units</p>
                  <p className="text-[10px] text-muted-foreground">{fmt(p.unit_price)} each</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary" onClick={() => { setListInStore(p); setListPrice(String(p.unit_price)); setListDesc(""); }}>
                  <ShoppingBag className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setDeleteConfirm(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Product?</DialogTitle>
            <DialogDescription>This will permanently remove this product from your inventory. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-lg" onClick={() => deleteConfirm && deleteProduct(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!listInStore} onOpenChange={(open) => { if (!open) { setListInStore(null); setListPrice(""); setListDesc(""); } }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">List in Store</DialogTitle>
            <DialogDescription>Publish <strong>{listInStore?.name}</strong> to your online store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Price (₦)</Label>
              <Input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} placeholder="0" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Description (optional)</Label>
              <Textarea value={listDesc} onChange={(e) => setListDesc(e.target.value)} placeholder="Add a short description…" className="rounded-lg resize-none" rows={3} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => { setListInStore(null); setListPrice(""); setListDesc(""); }}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleListInStore} disabled={listSaving}>
                {listSaving ? "Publishing…" : "Add to Store"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Add Product</DialogTitle>
            <DialogDescription>Add a new product to your inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Product Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Quantity</Label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Price (₦)</Label>
                <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Low Alert</Label>
                <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="5" className="rounded-lg" />
              </div>
            </div>
            <Button className="w-full rounded-lg" onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
