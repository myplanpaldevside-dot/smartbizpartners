import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Search, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  category: string | null;
  low_stock_threshold: number;
  created_at: string;
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

  const fetchProducts = async () => {
    const { data } = await supabase.from("inventory").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("inventory").insert({
      user_id: user!.id, name, sku: sku || null, quantity: Number(quantity) || 0,
      unit_price: Number(unitPrice) || 0, category: category || null,
      low_stock_threshold: Number(threshold) || 5,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Product added!" });
      setShowCreate(false); setName(""); setSku(""); setQuantity(""); setUnitPrice(""); setCategory("");
      fetchProducts();
    }
    setSaving(false);
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("inventory").delete().eq("id", id);
    fetchProducts();
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amt);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStock = products.filter(p => p.quantity <= p.low_stock_threshold);
  const totalValue = products.reduce((s, p) => s + p.quantity * p.unit_price, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Inventory Manager</h1>
          <p className="text-sm text-muted-foreground">Track your products and stock levels</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border bg-card p-4 rounded-lg">
          <Package className="h-4 w-4 text-primary mb-2" />
          <p className="font-display text-xl font-bold">{products.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Products</p>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive mb-2" />
          <p className="font-display text-xl font-bold">{lowStock.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Low Stock</p>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <Package className="h-4 w-4 text-secondary mb-2" />
          <p className="font-display text-xl font-bold">{formatCurrency(totalValue)}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Value</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-display font-bold">No products yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 border border-border bg-card rounded-lg hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {p.quantity <= p.low_stock_threshold && (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sku || "No SKU"} • {p.category || "Uncategorized"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-display font-bold text-sm">{p.quantity} units</p>
                  <p className="text-[10px] text-muted-foreground">{formatCurrency(p.unit_price)} each</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProduct(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Add Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (₦)</Label>
                <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alert</Label>
                <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="5" />
              </div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
