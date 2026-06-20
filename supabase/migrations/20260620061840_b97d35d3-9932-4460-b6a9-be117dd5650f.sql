REVOKE ALL ON FUNCTION public.sync_site_settings_public() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_site_settings_public() FROM anon;
REVOKE ALL ON FUNCTION public.sync_site_settings_public() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.sync_site_settings_public() TO service_role;