
-- Store settings per user
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  store_name text NOT NULL DEFAULT '',
  store_slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  logo_url text,
  banner_url text,
  currency text NOT NULL DEFAULT 'NGN',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own store" ON public.store_settings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own store" ON public.store_settings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own store" ON public.store_settings FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Public can view published stores" ON public.store_settings FOR SELECT TO anon USING (is_published = true);

-- Products
CREATE TABLE public.store_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  compare_at_price numeric,
  image_url text,
  category text,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own products" ON public.store_products FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public can view active products" ON public.store_products FOR SELECT TO anon USING (is_active = true);

-- Orders
CREATE TABLE public.store_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_user_id uuid NOT NULL,
  order_number text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_email text NOT NULL DEFAULT '',
  customer_phone text DEFAULT '',
  customer_address text DEFAULT '',
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_reference text,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view own orders" ON public.store_orders FOR SELECT TO authenticated USING (store_user_id = auth.uid());
CREATE POLICY "Store owners can update own orders" ON public.store_orders FOR UPDATE TO authenticated USING (store_user_id = auth.uid());
CREATE POLICY "Anyone can create orders" ON public.store_orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Order items
CREATE TABLE public.store_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.store_products(id),
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view order items" ON public.store_order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.store_orders WHERE store_orders.id = store_order_items.order_id AND store_orders.store_user_id = auth.uid()));
CREATE POLICY "Anyone can create order items" ON public.store_order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);

-- Storage policies for store images
CREATE POLICY "Authenticated users can upload store images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'store-images');
CREATE POLICY "Authenticated users can update own store images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'store-images');
CREATE POLICY "Anyone can view store images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'store-images');
