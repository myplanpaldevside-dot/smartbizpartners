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

  const [form, setForm] = useState({
    name: "", description: "", price: "", compare_at_price: "", category: "", stock_quantity: "0", image_url: "",
  });

  const [storeForm, setStoreForm] = useState({
    store_name: "", store_slug: "", description: "", is_published: false,
  });

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("store_products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProducts(data as unknown as Product[]);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      toast({ title: "Failed to load products", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchStoreSettings = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) setStoreSettings(data as unknown as StoreSettings);
    } catch (err: any) {
      console.error("Failed to fetch store settings:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [user, fetchProducts, fetchStoreSettings]);

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
    if (!storeForm.store_name.trim()) {
      toast({ title: "Store name is required", variant: "destructive" });
      return;
    }
    if (!storeForm.store_slug.trim()) {
      toast({ title: "Store URL is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (storeSettings) {
        const { error } = await supabase
          .from("store_settings")
          .update({
            store_name: storeForm.store_name.trim(),
            store_slug: storeForm.store_slug.trim(),
            description: storeForm.description.trim(),
            is_published: storeForm.is_published,
            updated_at: new Date().toISOString(),
          })
          .eq("id", storeSettings.id);
        if (error) throw error;
        toast({ title: "Store settings saved!" });
      } else {
        const { error } = await supabase.from("store_settings").insert({
          user_id: user!.id,
          store_name: storeForm.store_name.trim(),
          store_slug: storeForm.store_slug.trim(),
          description: storeForm.description.trim(),
          is_published: storeForm.is_published,
        });
        if (error) {
          if (error.message.includes("duplicate") || error.code === "23505") {
            toast({ title: "This store URL is already taken. Try a different one.", variant: "destructive" });
          } else {
            throw error;
          }
          setSaving(false);
          return;
        }
        toast({ title: "Store created successfully!" });
      }
      await fetchStoreSettings();
      setShowStoreSettings(false);
    } catch (err: any) {
      console.error("Store settings error:", err);
      toast({ title: "Failed to save store settings", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file (JPG, PNG, etc.)", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("store-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("store-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
      toast({ title: "Image uploaded!" });
    } catch (err: any) {
      console.error("Image upload error:", err);
      toast({ title: "Upload failed", description: err.message || "Please try again", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const openCreateProduct = () => {
    if (!storeSettings) {
      toast({ title: "Set up your store first", description: "Create your store before adding products.", variant: "destructive" });
      handleSetupStore();
      return;
    }
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
    if (!form.name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        category: form.category.trim() || null,
        stock_quantity: Math.max(0, Number(form.stock_quantity) || 0),
        image_url: form.image_url || null,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error } = await supabase.from("store_products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "Product updated!" });
      } else {
        const { error } = await supabase.from("store_products").insert({ ...payload, user_id: user!.id });
        if (error) throw error;
        toast({ title: "Product added!" });
      }
      await fetchProducts();
      setShowProductDialog(false);
    } catch (err: any) {
      console.error("Save product error:", err);
      toast({ title: "Failed to save product", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleProductActive = async (p: Product) => {
    try {
      const { error } = await supabase.from("store_products").update({ is_active: !p.is_active }).eq("id", p.id);
      if (error) throw error;
      toast({ title: p.is_active ? "Product hidden" : "Product visible" });
      await fetchProducts();
    } catch (err: any) {
      toast({ title: "Failed to update product", variant: "destructive" });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("store_products").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Product deleted" });
      await fetchProducts();
    } catch (err: any) {
      toast({ title: "Failed to delete product", variant: "destructive" });
    }
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">E-Commerce</p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {storeSettings?.store_name || profile?.business_name || "My"} Store
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your products and online store.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSetupStore}>
              <Settings className="h-4 w-4 mr-1" />
              {storeSettings ? "Settings" : "Setup Store"}
            </Button>
            <Button size="sm" onClick={openCreateProduct} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Store Status Banner */}
      {storeSettings && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-border rounded-xl bg-card"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${storeSettings.is_published ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
            <div>
              <p className="text-sm font-semibold text-foreground">{storeSettings.store_name}</p>
              <p className="text-xs text-muted-foreground">
                {storeSettings.is_published ? "🟢 Live" : "⚪ Draft"} • {products.length} product{products.length !== 1 ? "s" : ""}
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
        </motion.div>
      )}

      {/* Empty state — no store yet */}
      {!storeSettings && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/30"
        >
          <ShoppingBag className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl mb-2 text-foreground">Set Up Your Store</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your online store in seconds. Add products, set prices, and start selling to customers.
          </p>
          <Button onClick={handleSetupStore} size="lg" className="bg-primary text-primary-foreground">
            <ShoppingBag className="h-4 w-4 mr-2" /> Create Your Store
          </Button>
        </motion.div>
      )}

      {/* Search */}
      {storeSettings && products.length > 0 && (
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
      ) : storeSettings && filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <PackageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No products yet</p>
          <p className="text-xs mt-1">Add your first product to start selling.</p>
          <Button onClick={openCreateProduct} size="sm" className="mt-4 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </div>
      ) : storeSettings ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border bg-card rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-muted relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-xs font-semibold text-muted-foreground bg-background/90 px-3 py-1 rounded-full">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold text-sm truncate text-foreground">{product.name}</h3>
                  {product.category && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.compare_at_price)}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Stock: {product.stock_quantity} {product.stock_quantity <= 5 && product.stock_quantity > 0 && "⚠️"} {product.stock_quantity === 0 && "❌ Out"}
                </p>
                <div className="flex items-center gap-1 border-t border-border pt-3">
                  <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => openEditProduct(product)}>
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleProductActive(product)}>
                    {product.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteProduct(product.id)}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Image</Label>
              <div className="relative">
                {form.image_url ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
                      onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs text-muted-foreground">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground">Click to upload image</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">JPG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {form.image_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs w-full"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {uploading ? "Uploading..." : "Change Image"}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Premium T-Shirt"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (₦) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compare_at_price}
                  onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Clothing"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Qty</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowProductDialog(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={handleSaveProduct}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editingProduct ? "Update Product" : "Add Product"}
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
            <DialogDescription>Configure your online store details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store Name *</Label>
              <Input
                value={storeForm.store_name}
                onChange={(e) => {
                  const name = e.target.value;
                  setStoreForm((f) => ({
                    ...f,
                    store_name: name,
                    store_slug: !storeSettings ? generateSlug(name) : f.store_slug,
                  }));
                }}
                placeholder="My Awesome Store"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store URL *</Label>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <span className="text-xs text-muted-foreground shrink-0 pl-2">/store/</span>
                <Input
                  value={storeForm.store_slug}
                  onChange={(e) => setStoreForm((f) => ({ ...f, store_slug: generateSlug(e.target.value) }))}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  placeholder="my-store"
                />
              </div>
              {storeForm.store_slug && (
                <p className="text-[10px] text-muted-foreground">
                  Your store will be at: {window.location.origin}/store/{storeForm.store_slug}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                value={storeForm.description}
                onChange={(e) => setStoreForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What do you sell?"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-semibold text-foreground">Publish Store</p>
                <p className="text-xs text-muted-foreground">Make your store visible to customers</p>
              </div>
              <Switch
                checked={storeForm.is_published}
                onCheckedChange={(v) => setStoreForm((f) => ({ ...f, is_published: v }))}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowStoreSettings(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={handleSaveStoreSettings}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : storeSettings ? "Save Settings" : "Create Store"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
