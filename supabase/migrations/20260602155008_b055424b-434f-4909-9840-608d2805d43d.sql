-- 1. Subscriptions: remove user self-write (prevents free premium self-grant)
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
-- (Admin policies + service_role bypass remain for legitimate writes via webhook)

-- 2. Store order items: require referenced order to exist (no arbitrary order_id)
DROP POLICY IF EXISTS "Anyone can create order items" ON public.store_order_items;
CREATE POLICY "Order items must reference an existing order"
ON public.store_order_items FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.store_orders o WHERE o.id = order_id)
  AND char_length(product_name) <= 300
  AND quantity > 0
  AND amount >= 0
  AND unit_price >= 0
);

-- 3. Store orders: only allow orders for real published stores + sane limits
DROP POLICY IF EXISTS "Anyone can create orders" ON public.store_orders;
CREATE POLICY "Orders only for published stores"
ON public.store_orders FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.store_settings s
    WHERE s.user_id = store_user_id AND s.is_published = true
  )
  AND char_length(customer_name) <= 200
  AND char_length(customer_email) <= 255
  AND char_length(COALESCE(customer_phone, '')) <= 40
  AND char_length(COALESCE(customer_address, '')) <= 1000
  AND char_length(COALESCE(notes, '')) <= 2000
  AND total >= 0 AND subtotal >= 0
);

-- 4. Store-images bucket: enforce per-user folder ownership on INSERT/UPDATE
DROP POLICY IF EXISTS "Authenticated users can upload store images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own store images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view store images" ON storage.objects;

CREATE POLICY "Users can upload own store images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

CREATE POLICY "Users can update own store images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Owners can list/select their own store images (public URLs still served by public bucket)
CREATE POLICY "Owners can view own store images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 5. Logos bucket: restrict listing to owners (prevents anon enumeration; public URLs still work)
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
CREATE POLICY "Owners can view own logos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 6. Lock down SECURITY DEFINER helper / queue functions: fix search_path + revoke public EXECUTE
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;

-- Trigger functions never need to be called directly by clients
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_assign_admin() FROM PUBLIC, anon, authenticated;

-- has_role must stay callable by authenticated (used inside RLS policies), but not anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;