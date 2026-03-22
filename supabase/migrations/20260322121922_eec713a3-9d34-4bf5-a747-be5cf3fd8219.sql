-- Ensure partner inquiry capture exists for "Partner With Us" form
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'partner_inquiries' AND policyname = 'Anyone can submit partner inquiries'
  ) THEN
    CREATE POLICY "Anyone can submit partner inquiries"
    ON public.partner_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (char_length(name) <= 120 AND char_length(email) <= 255 AND char_length(coalesce(phone, '')) <= 40 AND char_length(coalesce(business_name, '')) <= 160 AND char_length(message) <= 5000);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'partner_inquiries' AND policyname = 'Admins can view all partner inquiries'
  ) THEN
    CREATE POLICY "Admins can view all partner inquiries"
    ON public.partner_inquiries
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Admin visibility fixes for dashboard data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Admins can view all invoices'
  ) THEN
    CREATE POLICY "Admins can view all invoices"
    ON public.invoices
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'invoice_items' AND policyname = 'Admins can view all invoice items'
  ) THEN
    CREATE POLICY "Admins can view all invoice items"
    ON public.invoice_items
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Restore signup automation (profile + role + admin auto-assignment)
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;

CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_admin();

-- Backfill missing profile + role records for existing users
INSERT INTO public.profiles (id, email, business_name, phone)
SELECT u.id,
       u.email,
       COALESCE(u.raw_user_meta_data ->> 'business_name', ''),
       COALESCE(u.raw_user_meta_data ->> 'phone', '')
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id AND ur.role = 'user'::public.app_role
);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('dansu@smartbizpartners.com', 'michael@smartbizpartners.com', 'mima@smartbizpartners.com')
ON CONFLICT (user_id, role) DO NOTHING;