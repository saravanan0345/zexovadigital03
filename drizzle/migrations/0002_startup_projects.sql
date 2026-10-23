CREATE TABLE public.startup_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  website_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.startup_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.startup_projects TO authenticated;
GRANT ALL ON public.startup_projects TO service_role;

ALTER TABLE public.startup_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public published startup projects" ON public.startup_projects
  FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin insert startup projects" ON public.startup_projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin update startup projects" ON public.startup_projects
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin delete startup projects" ON public.startup_projects
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));