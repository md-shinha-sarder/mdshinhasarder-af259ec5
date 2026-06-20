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
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

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
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage media" ON public.media;
CREATE POLICY "Admins manage media"
ON public.media
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins read settings" ON public.site_settings;
CREATE POLICY "Admins read settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Roles viewable by self or admin" ON public.user_roles;
DROP POLICY IF EXISTS "Roles managed by admin" ON public.user_roles;
CREATE POLICY "Roles viewable by self or admin"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Roles managed by admin"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;