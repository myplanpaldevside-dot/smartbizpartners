import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, X, ArrowLeft, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category: string | null;
  stock_quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreInfo {
  store_name: string;
  store_slug: string;
  description: string;
  user_id: string;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string | null;
}

export default function Storefront() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "", email: "", phone: "", address: "",
  });

  useEffect(() => {
    if (slug) fetchStore();
  }, [slug]);

  const fetchStore = async () => {
    const { data: storeData, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("store_slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !storeData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const info = storeData as unknown as StoreInfo;
    setStore(info);

    const { data: productData } = await supabase
      .from("store_products")
      .select("*")
      .eq("user_id", info.user_id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (productData) setProducts(productData as unknown as Product[]);
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: `${product.name} added to cart` });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.product.id === productId ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const formatCurrency = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  const themeColor = store?.theme_color || "#18181b";

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (cart.length === 0) return;

    setSubmitting(true);

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase
      .from("store_orders")
      .insert({
        store_user_id: store!.user_id,
        order_number: orderNumber,
        customer_name: checkoutForm.name,
        customer_email: checkoutForm.email,
        customer_phone: checkoutForm.phone,
        customer_address: checkoutForm.address,
        subtotal: cartTotal,
        total: cartTotal,
        status: "pending",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (orderError || !order) {
      toast({ title: "Failed to create order", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const typedOrder = order as unknown as { id: string };

    const { error: itemsError } = await supabase.from("store_order_items").insert(
      cart.map((c) => ({
        order_id: typedOrder.id,
        product_id: c.product.id,
        product_name: c.product.name,
        quantity: c.quantity,
        unit_price: c.product.price,
        amount: c.product.price * c.quantity,
      }))
    );
    if (itemsError) {
      toast({ title: "Failed to save order items", description: itemsError.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    try {
      const { data: payData, error: payError } = await supabase.functions.invoke("store-checkout", {
        body: {
          email: checkoutForm.email,
          amount: cartTotal,
          order_id: typedOrder.id,
          order_number: orderNumber,
          store_name: store!.store_name,
          store_slug: slug,
        },
      });

      if (payError || !payData?.authorization_url) {
        toast({ title: "Order saved. Contact the store to complete payment.", variant: "destructive" });
        setCart([]);
        setShowCheckout(false);
        setShowCart(false);
      } else {
        window.location.href = payData.authorization_url;
      }
    } catch {
      toast({ title: "Order saved. Contact the store to complete payment.", variant: "destructive" });
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#18181b", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground text-sm">This store doesn't exist or isn't published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {store?.logo_url ? (
              <img src={store.logo_url} alt={store.store_name} className="w-9 h-9 rounded-lg object-cover border border-border" />
            ) : (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: themeColor }}>
                {store?.store_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-base leading-tight">{store?.store_name}</h1>
              {store?.description && <p className="text-xs text-muted-foreground leading-tight">{store.description}</p>}
            </div>
          </div>
          <Button
            variant="outline" size="sm" className="relative rounded-xl"
            onClick={() => setShowCart(true)}
            style={cartCount > 0 ? { borderColor: themeColor, color: themeColor } : {}}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Banner */}
      {store?.banner_url && (
        <div className="w-full h-40 sm:h-56 overflow-hidden">
          <img src={store.banner_url} alt="Store banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Products */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-border rounded-xl overflow-hidden bg-card group hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-sm" style={{ color: themeColor }}>{formatCurrency(product.price)}</span>
                    {product.compare_at_price && (
                      <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.compare_at_price)}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 text-xs h-8 text-white"
                    style={{ backgroundColor: themeColor }}
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                  >
                    {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>{cart.length === 0 ? "Your cart is empty" : `${cartCount} items`}</DialogDescription>
          </DialogHeader>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-14 h-14 rounded-lg bg-muted shrink-0 overflow-hidden">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.product.name}</p>
                    <p className="text-xs font-medium" style={{ color: themeColor }}>{formatCurrency(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartQty(item.product.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartQty(item.product.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeFromCart(item.product.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2">
                <span>Total</span>
                <span style={{ color: themeColor }}>{formatCurrency(cartTotal)}</span>
              </div>
              <Button className="w-full text-white" style={{ backgroundColor: themeColor }}
                onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input value={checkoutForm.name} onChange={(e) => setCheckoutForm((f) => ({ ...f, name: e.target.value }))} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Email *</Label>
              <Input type="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm((f) => ({ ...f, email: e.target.value }))} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Phone *</Label>
              <Input value={checkoutForm.phone} onChange={(e) => setCheckoutForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Delivery Address</Label>
              <Input value={checkoutForm.address} onChange={(e) => setCheckoutForm((f) => ({ ...f, address: e.target.value }))} className="rounded-lg" />
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-bold text-sm mb-1">
                <span>Total</span>
                <span style={{ color: themeColor }}>{formatCurrency(cartTotal)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">You'll be redirected to Paystack to complete payment.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => { setShowCheckout(false); setShowCart(true); }}>
                <ArrowLeft className="h-3 w-3 mr-1" /> Back
              </Button>
              <Button className="flex-1 rounded-lg text-white" style={{ backgroundColor: themeColor }} onClick={handleCheckout} disabled={submitting}>
                {submitting ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
