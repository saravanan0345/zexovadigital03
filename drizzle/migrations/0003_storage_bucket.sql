INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'buckets' AND policyname = 'admin manage buckets'
  ) THEN
    CREATE POLICY "admin manage buckets" ON storage.buckets
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
