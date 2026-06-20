DROP POLICY IF EXISTS "Profiles viewable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles viewable by self or admin" ON public.profiles;
CREATE POLICY "Profiles viewable by self or admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins read contact" ON public.site_contact;
DROP POLICY IF EXISTS "Admins write contact" ON public.site_contact;
CREATE POLICY "Admins read contact"
ON public.site_contact
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);
CREATE POLICY "Admins write contact"
ON public.site_contact
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Published posts public" ON public.posts;
DROP POLICY IF EXISTS "Admins manage posts" ON public.posts;
CREATE POLICY "Published posts public"
ON public.posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');
CREATE POLICY "Admins manage posts"
ON public.posts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Published pages public" ON public.pages;
DROP POLICY IF EXISTS "Admins manage pages" ON public.pages;
CREATE POLICY "Published pages public"
ON public.pages
FOR SELECT
TO anon, authenticated
USING (status = 'published');
CREATE POLICY "Admins manage pages"
ON public.pages
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins manage media" ON public.media;
CREATE POLICY "Admins manage media"
ON public.media
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins update settings" ON public.site_settings;
CREATE POLICY "Admins read settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);
CREATE POLICY "Admins update settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Roles viewable by self or admin" ON public.user_roles;
DROP POLICY IF EXISTS "Roles managed by admin" ON public.user_roles;
CREATE POLICY "Roles viewable by self"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;