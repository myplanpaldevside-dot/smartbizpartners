import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, Trash2, Edit2, Eye, EyeOff, Upload, ExternalLink,
  ShoppingBag, Package as PackageIcon, Copy, Settings, ImagePlus, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string; name: string; description: string; price: number;
  compare_at_price: number | null; image_url: string | null;
  category: string | null; stock_quantity: number; is_active: boolean; created_at: string;
}

interface StoreSettings {
  id: string; store_name: string; store_slug: string; description: string; is_published: boolean;
}

export default function Store() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [showStoreSettings, setShowStoreSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const withTimeout = async <T,>(operation: PromiseLike<T>, timeoutMs = 25000): Promise<T> => {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs)),
    ]);
  };

  const [form, setForm] = useState({
    name: "", description: "", price: "", compare_at_price: "", category: "", stock_quantity: "0", image_url: "",
  });
  const [storeForm, setStoreForm] = useState({
    store_name: "", store_slug: "", description: "", is_published: false,
  });

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await withTimeout(
        supabase.from("store_products").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      );
      if (error) throw error;
      setProducts((data || []) as unknown as Product[]);
    } catch (err: any) {
      toast({ title: "Failed to load products", description: err?.message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [user]);

  const fetchStoreSettings = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await withTimeout(
        supabase.from("store_settings").select("*").eq("user_id", user.id).maybeSingle(),
      );
      if (data) setStoreSettings(data as unknown as StoreSettings);
    } catch (err: any) {
      toast({ title: "Failed to load store settings", description: err?.message, variant: "destructive" });
    }
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    Promise.all([fetchProducts(), fetchStoreSettings()]).finally(() => setLoading(false));
  }, [user, fetchProducts, fetchStoreSettings]);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSetupStore = () => {
    const bizName = profile?.business_name || "";
    setStoreForm({
      store_name: storeSettings?.store_name || bizName,
      store_slug: storeSettings?.store_slug || generateSlug(bizName),
      description: storeSettings?.description || "",
      is_published: storeSettings?.is_published || false,
    });
    setShowStoreSettings(true);
  };

  const handleSaveStoreSettings = async () => {
    if (!user) return;
    if (!storeForm.store_name.trim()) { toast({ title: "Store name is required", variant: "destructive" }); return; }
    const cleanSlug = generateSlug(storeForm.store_slug.trim());
    if (!cleanSlug) { toast({ title: "Store URL is required", variant: "destructive" }); return; }

    setSaving(true);
    try {
      const payload = {
        user_id: user.id, store_name: storeForm.store_name.trim(), store_slug: cleanSlug,
        description: storeForm.description.trim(), is_published: storeForm.is_published,
        updated_at: new Date().toISOString(),
      };

      if (storeSettings) {
        const { error } = await withTimeout(
          supabase.from("store_settings").update(payload).eq("id", storeSettings.id),
        );
        if (error) throw error;
      } else {
        const { error } = await withTimeout(
          supabase.from("store_settings").insert(payload),
        );
        if (error) {
          if (error.code === "23505" && error.message.includes("store_slug")) {
            toast({ title: "This store URL is taken. Try another.", variant: "destructive" });
            setSaving(false); return;
          }
          // Try upsert fallback for user_id conflict
          if (error.code === "23505") {
            const { error: updateErr } = await withTimeout(
              supabase.from("store_settings").update(payload).eq("user_id", user.id),
            );
            if (updateErr) throw updateErr;
          } else throw error;
        }
      }

      toast({ title: "✓ Store settings saved!" });
      await fetchStoreSettings();
      setShowStoreSettings(false);
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Select an image file", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Max 5MB", variant: "destructive" }); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await withTimeout(
        supabase.storage.from("store-images").upload(path, file, { cacheControl: "3600", upsert: false }),
      );
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("store-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
      toast({ title: "✓ Image uploaded!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const openCreateProduct = () => {
    if (!storeSettings) { handleSetupStore(); return; }
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", compare_at_price: "", category: "", stock_quantity: "0", image_url: "" });
    setShowProductDialog(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description || "", price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      category: p.category || "", stock_quantity: String(p.stock_quantity), image_url: p.image_url || "",
    });
    setShowProductDialog(true);
  };

  const handleSaveProduct = async () => {
    if (!user) return;
    if (!form.name.trim()) { toast({ title: "Product name required", variant: "destructive" }); return; }
    if (!form.price || Number(form.price) <= 0) { toast({ title: "Enter a valid price", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(), description: form.description.trim(),
        price: Number(form.price), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        category: form.category.trim() || null, stock_quantity: Math.max(0, Number(form.stock_quantity) || 0),
        image_url: form.image_url || null, updated_at: new Date().toISOString(),
      };
      if (editingProduct) {
        const { error } = await withTimeout(
          supabase.from("store_products").update(payload).eq("id", editingProduct.id),
        );
        if (error) throw error;
        toast({ title: "✓ Product updated!" });
      } else {
        const { error } = await withTimeout(
          supabase.from("store_products").insert({ ...payload, user_id: user.id }),
        );
        if (error) throw error;
        toast({ title: "✓ Product added!" });
      }
      await fetchProducts();
      setShowProductDialog(false);
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const toggleProductActive = async (p: Product) => {
    const { error } = await supabase.from("store_products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (!error) { toast({ title: p.is_active ? "Product hidden" : "Product visible" }); fetchProducts(); }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("store_products").delete().eq("id", id);
    if (!error) { toast({ title: "Product deleted" }); fetchProducts(); }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || "").toLowerCase().includes(search.toLowerCase()));
  const storeUrl = storeSettings ? `${window.location.origin}/store/${storeSettings.store_slug}` : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {storeSettings?.store_name || profile?.business_name || "My"} Store
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage your products and online store.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={handleSetupStore}>
              <Settings className="h-3.5 w-3.5 mr-1.5" /> {storeSettings ? "Settings" : "Setup Store"}
            </Button>
            <Button size="sm" className="rounded-lg text-xs" onClick={openCreateProduct}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Status Banner */}
      {storeSettings && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border border-border rounded-xl bg-card"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${storeSettings.is_published ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
            <div>
              <p className="text-sm font-semibold text-foreground">{storeSettings.store_name}</p>
              <p className="text-[10px] text-muted-foreground">{storeSettings.is_published ? "Live" : "Draft"} • {products.length} product{products.length !== 1 && "s"}</p>
            </div>
          </div>
          {storeUrl && storeSettings.is_published && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs rounded-lg" onClick={() => { navigator.clipboard.writeText(storeUrl); toast({ title: "Link copied!" }); }}>
                <Copy className="h-3 w-3 mr-1" /> Copy Link
              </Button>
              <Button variant="outline" size="sm" className="text-xs rounded-lg" asChild>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" /> View</a>
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {!storeSettings && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/20"
        >
          <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg mb-1.5">Create Your Store</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">Add products, set prices, and start selling online.</p>
          <Button onClick={handleSetupStore} className="rounded-lg"><ShoppingBag className="h-4 w-4 mr-2" /> Get Started</Button>
        </motion.div>
      )}

      {/* Search */}
      {storeSettings && products.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : storeSettings && filtered.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <PackageIcon className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No products yet</p>
          <Button onClick={openCreateProduct} size="sm" className="mt-3 rounded-lg"><Plus className="h-3.5 w-3.5 mr-1" /> Add Product</Button>
        </div>
      ) : storeSettings ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="border border-border bg-card rounded-xl overflow-hidden group hover:shadow-sm transition-shadow"
            >
              <div className="aspect-[4/3] bg-muted relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><PackageIcon className="h-10 w-10 text-muted-foreground/15" /></div>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-muted-foreground bg-background/90 px-2.5 py-0.5 rounded-full">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold text-sm truncate">{product.name}</h3>
                  {product.category && <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{product.category}</span>}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-primary text-sm">{fmt(product.price)}</span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-xs text-muted-foreground line-through">{fmt(product.compare_at_price)}</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">
                  {product.stock_quantity} in stock {product.stock_quantity <= 5 && product.stock_quantity > 0 && "⚠️"} {product.stock_quantity === 0 && "❌"}
                </p>
                <div className="flex items-center gap-1 border-t border-border pt-2.5">
                  <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 rounded-lg" onClick={() => openEditProduct(product)}>
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg" onClick={() => toggleProductActive(product)}>
                    {product.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive rounded-lg" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Fill in product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Product Image</Label>
              <div className="relative">
                {form.image_url ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={form.image_url} alt="Preview" className="w-full h-36 object-cover" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full" onClick={() => setForm((f) => ({ ...f, image_url: "" }))}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div onClick={() => !uploading && fileInputRef.current?.click()}
                    className="w-full h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors"
                  >
                    {uploading ? (
                      <><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-1.5" /><p className="text-[10px] text-muted-foreground">Uploading...</p></>
                    ) : (
                      <><ImagePlus className="h-7 w-7 text-muted-foreground/30 mb-1.5" /><p className="text-[10px] text-muted-foreground">Click to upload • Max 5MB</p></>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
              </div>
              {form.image_url && (
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs w-full rounded-lg">
                  <Upload className="h-3 w-3 mr-1" /> {uploading ? "Uploading..." : "Change Image"}
                </Button>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium T-Shirt" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe your product..." rows={2} className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Price (₦) *</Label>
                <Input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Compare Price</Label>
                <Input type="number" min="0" value={form.compare_at_price} onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))} placeholder="Optional" className="rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Clothing" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Stock Qty</Label>
                <Input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))} className="rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setShowProductDialog(false)}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleSaveProduct} disabled={saving}>
                {saving ? "Saving..." : editingProduct ? "Update" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Store Settings Dialog */}
      <Dialog open={showStoreSettings} onOpenChange={setShowStoreSettings}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Store Settings</DialogTitle>
            <DialogDescription>Configure your online store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Store Name *</Label>
              <Input value={storeForm.store_name} onChange={(e) => {
                const name = e.target.value;
                setStoreForm((f) => ({ ...f, store_name: name, store_slug: !storeSettings ? generateSlug(name) : f.store_slug }));
              }} placeholder="My Awesome Store" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Store URL *</Label>
              <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
                <span className="text-xs text-muted-foreground shrink-0 pl-2">/store/</span>
                <Input value={storeForm.store_slug} onChange={(e) => setStoreForm((f) => ({ ...f, store_slug: generateSlug(e.target.value) }))}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 rounded-lg" placeholder="my-store" />
              </div>
              {storeForm.store_slug && <p className="text-[10px] text-muted-foreground">{window.location.origin}/store/{storeForm.store_slug}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea value={storeForm.description} onChange={(e) => setStoreForm((f) => ({ ...f, description: e.target.value }))} placeholder="What do you sell?" rows={2} className="rounded-lg" />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-muted/20">
              <div>
                <p className="text-sm font-semibold">Publish Store</p>
                <p className="text-[10px] text-muted-foreground">Make visible to customers</p>
              </div>
              <Switch checked={storeForm.is_published} onCheckedChange={(v) => setStoreForm((f) => ({ ...f, is_published: v }))} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setShowStoreSettings(false)}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleSaveStoreSettings} disabled={saving}>
                {saving ? "Saving..." : storeSettings ? "Save" : "Create Store"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
