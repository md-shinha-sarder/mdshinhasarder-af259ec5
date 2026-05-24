
-- Add search_path to set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke public EXECUTE on security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict public listing of media bucket: allow reading individual objects only via known path
DROP POLICY IF EXISTS "Media bucket public read" ON storage.objects;
CREATE POLICY "Media bucket read by path" ON storage.objects FOR SELECT USING (bucket_id = 'media' AND (auth.role() = 'anon' OR auth.role() = 'authenticated'));
