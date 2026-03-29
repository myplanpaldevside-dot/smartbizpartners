CREATE UNIQUE INDEX IF NOT EXISTS store_settings_user_id_key ON public.store_settings (user_id);

CREATE POLICY "Users can delete own store images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'store-images' AND (storage.foldername(name))[1] = auth.uid()::text);