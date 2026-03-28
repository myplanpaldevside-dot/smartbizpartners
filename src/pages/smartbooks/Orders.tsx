import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, Eye, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  subtotal: number;
  total: number;
  status: string;
  payment_status: string;
  payment_reference: string | null;
  notes: string;
  created_at: string;
}

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-500/10",
  confirmed: "text-blue-600 bg-blue-500/10",
  shipped: "text-purple-600 bg-purple-500/10",
  delivered: "text-green-600 bg-green-500/10",
  cancelled: "text-red-600 bg-red-500/10",
};

const paymentColors: Record<string, string> = {
  unpaid: "text-red-600 bg-red-500/10",
  paid: "text-green-600 bg-green-500/10",
  refunded: "text-muted-foreground bg-muted",
};

export default function Orders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("store_orders")
      .select("*")
      .eq("store_user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as unknown as Order[]);
    setLoading(false);
  };

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase
      .from("store_order_items")
      .select("*")
      .eq("order_id", order.id);
    if (data) setOrderItems(data as unknown as OrderItem[]);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("store_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    toast({ title: `Order marked as ${status}` });
    await fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((o) => o ? { ...o, status } : null);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Orders</p>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Store Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage and fulfill customer orders.</p>
      </motion.div>

      {orders.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No orders yet. Share your store link to start receiving orders!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border border-border bg-card rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => viewOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[order.status] || "bg-muted"}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name} • {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${paymentColors[order.payment_status] || "bg-muted"}`}>
                      {order.payment_status}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-muted"}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-sm">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Order {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && <p className="text-xs text-muted-foreground">{selectedOrder.customer_phone}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Address</p>
                  <p className="text-xs">{selectedOrder.customer_address || "Not provided"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-border pb-2">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-sm mt-3 pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.payment_reference && (
                <p className="text-xs text-muted-foreground">Payment Ref: {selectedOrder.payment_reference}</p>
              )}

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedOrder.status === s ? "default" : "outline"}
                      className="text-xs capitalize h-7"
                      onClick={() => updateOrderStatus(selectedOrder.id, s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
