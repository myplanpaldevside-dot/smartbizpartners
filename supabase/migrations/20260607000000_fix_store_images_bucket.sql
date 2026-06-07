-- Ensure store-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-images',
  'store-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Drop all existing store-images policies to start clean
DROP POLICY IF EXISTS "Authenticated users can upload store images"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own store images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view store images"                   ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own store images"              ON storage.objects;
DROP POLICY IF EXISTS "Users can update own store images"              ON storage.objects;
DROP POLICY IF EXISTS "Owners can view own store images"               ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own store images"              ON storage.objects;

-- INSERT: authenticated user must upload into their own UUID folder
CREATE POLICY "store_images_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- UPDATE: only owner can update their own files
CREATE POLICY "store_images_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- DELETE: only owner can delete their own files
CREATE POLICY "store_images_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'store-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- SELECT: public bucket serves URLs without auth; let any role select for listing
CREATE POLICY "store_images_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'store-images');
