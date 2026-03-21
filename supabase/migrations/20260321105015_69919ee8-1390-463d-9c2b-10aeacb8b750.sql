CREATE TABLE public.expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    description text NOT NULL DEFAULT '',
    amount numeric NOT NULL DEFAULT 0,
    category text NOT NULL DEFAULT 'Other',
    date date NOT NULL DEFAULT CURRENT_DATE,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL DEFAULT '',
    email text,
    phone text,
    company text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customers" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own customers" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own customers" ON public.customers FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL DEFAULT '',
    sku text,
    quantity integer NOT NULL DEFAULT 0,
    unit_price numeric NOT NULL DEFAULT 0,
    category text,
    low_stock_threshold integer NOT NULL DEFAULT 5,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory" ON public.inventory FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own inventory" ON public.inventory FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own inventory" ON public.inventory FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Admin policies for all new tables
CREATE POLICY "Admins can view all expenses" ON public.expenses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all customers" ON public.customers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all inventory" ON public.inventory FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));