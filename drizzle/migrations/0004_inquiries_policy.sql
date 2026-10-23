-- Allow insert into inquiries for website visitors and authenticated users
GRANT INSERT ON public.inquiries TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'inquiries' AND policyname = 'public insert inquiries'
  ) THEN
    CREATE POLICY "public insert inquiries" ON public.inquiries
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;
