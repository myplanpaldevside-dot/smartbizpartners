import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, Trash2, Edit2, Eye, EyeOff, Upload, ExternalLink, ShoppingBag, Package as PackageIcon, Copy,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface StoreSettings {
  id: string;
  store_name: string;
  store_slug: string;
  description: string;
  is_published: boolean;
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

  // Product form
  const [form, setForm] = useState({
    name: "", description: "", price: "", compare_at_price: "", category: "", stock_quantity: "", image_url: "",
  });

  // Store settings form
  const [storeForm, setStoreForm] = useState({
    store_name: "", store_slug: "", description: "", is_published: false,
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("store_products")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setProducts(data as unknown as Product[]);
    setLoading(false);
  };

  const fetchStoreSettings = async () => {
    const { data } = await supabase
      .from("store_settings")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) setStoreSettings(data as unknown as StoreSettings);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
    if (!storeForm.store_name || !storeForm.store_slug) {
      toast({ title: "Store name and URL are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    if (storeSettings) {
      const { error } = await supabase
        .from("store_settings")
        .update({
          store_name: storeForm.store_name,
          store_slug: storeForm.store_slug,
          description: storeForm.description,
          is_published: storeForm.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", storeSettings.id);
      if (error) {
        toast({ title: "Error updating store", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Store settings saved!" });
        await fetchStoreSettings();
        setShowStoreSettings(false);
      }
    } else {
      const { error } = await supabase.from("store_settings").insert({
        user_id: user!.id,
        store_name: storeForm.store_name,
        store_slug: storeForm.store_slug,
        description: storeForm.description,
        is_published: storeForm.is_published,
      });
      if (error) {
        if (error.message.includes("duplicate")) {
          toast({ title: "This store URL is already taken", variant: "destructive" });
        } else {
          toast({ title: "Error creating store", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Store created!" });
        await fetchStoreSettings();
        setShowStoreSettings(false);
      }
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("store-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("store-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", compare_at_price: "", category: "", stock_quantity: "0", image_url: "" });
    setShowProductDialog(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      category: p.category || "",
      stock_quantity: String(p.stock_quantity),
      image_url: p.image_url || "",
    });
    setShowProductDialog(true);
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category: form.category || null,
      stock_quantity: Number(form.stock_quantity) || 0,
      image_url: form.image_url || null,
      updated_at: new Date().toISOString(),
    };

    if (editingProduct) {
      await supabase.from("store_products").update(payload).eq("id", editingProduct.id);
      toast({ title: "Product updated!" });
    } else {
      await supabase.from("store_products").insert({ ...payload, user_id: user!.id });
      toast({ title: "Product added!" });
    }
    await fetchProducts();
    setShowProductDialog(false);
    setSaving(false);
  };

  const toggleProductActive = async (p: Product) => {
    await supabase.from("store_products").update({ is_active: !p.is_active }).eq("id", p.id);
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("store_products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    await fetchProducts();
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const storeUrl = storeSettings
    ? `${window.location.origin}/store/${storeSettings.store_slug}`
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">E-Commerce</p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">My Store</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your products and online store.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSetupStore}>
              Store Settings
            </Button>
            <Button size="sm" onClick={openCreateProduct} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Store Status Banner */}
      {storeSettings && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${storeSettings.is_published ? "bg-green-500" : "bg-muted-foreground/40"}`} />
            <div>
              <p className="text-sm font-semibold">{storeSettings.store_name}</p>
              <p className="text-xs text-muted-foreground">
                {storeSettings.is_published ? "Live" : "Draft"} • {products.length} products
              </p>
            </div>
          </div>
          {storeUrl && storeSettings.is_published && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(storeUrl);
                  toast({ title: "Store link copied!" });
                }}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy Link
              </Button>
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" /> View Store
                </a>
              </Button>
            </div>
          )}
        </div>
      )}

      {!storeSettings && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-1">Set Up Your Store</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your online store to start selling products.</p>
          <Button onClick={handleSetupStore} className="bg-primary text-primary-foreground">
            Create Store
          </Button>
        </div>
      )}

      {/* Search */}
      {products.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 && storeSettings ? (
        <div className="text-center py-12 text-muted-foreground">
          <PackageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border bg-card rounded-lg overflow-hidden group"
            >
              <div className="aspect-square bg-muted relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold text-sm truncate">{product.name}</h3>
                  {product.category && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                  {product.compare_at_price && (
                    <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.compare_at_price)}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">Stock: {product.stock_quantity}</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEditProduct(product)}>
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleProductActive(product)}>
                    {product.is_active ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    {product.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Image</Label>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs w-full">
                <Upload className="h-3 w-3 mr-1" />
                {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Image"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (₦) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Price</Label>
                <Input type="number" value={form.compare_at_price} onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</Label>
                <Input type="number" value={form.stock_quantity} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowProductDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveProduct} disabled={saving}>
                {saving ? "Saving..." : editingProduct ? "Update" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Store Settings Dialog */}
      <Dialog open={showStoreSettings} onOpenChange={setShowStoreSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Store Settings</DialogTitle>
            <DialogDescription>Configure your online store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store Name</Label>
              <Input
                value={storeForm.store_name}
                onChange={(e) => {
                  setStoreForm((f) => ({
                    ...f,
                    store_name: e.target.value,
                    store_slug: !storeSettings ? generateSlug(e.target.value) : f.store_slug,
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store URL</Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground shrink-0">/store/</span>
                <Input
                  value={storeForm.store_slug}
                  onChange={(e) => setStoreForm((f) => ({ ...f, store_slug: generateSlug(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                value={storeForm.description}
                onChange={(e) => setStoreForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="text-sm font-semibold">Publish Store</p>
                <p className="text-xs text-muted-foreground">Make your store visible to customers</p>
              </div>
              <Switch
                checked={storeForm.is_published}
                onCheckedChange={(v) => setStoreForm((f) => ({ ...f, is_published: v }))}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowStoreSettings(false)}>Cancel</Button>
              <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveStoreSettings} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
