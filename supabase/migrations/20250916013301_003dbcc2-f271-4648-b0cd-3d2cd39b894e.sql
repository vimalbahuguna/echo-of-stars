-- Create trigger to automatically create user profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    default_tenant_id UUID;
    user_email TEXT;
BEGIN
    -- Get user email from auth.users
    user_email := NEW.email;
    
    -- For demo purposes, assign to a default tenant or create one
    -- In production, this would be handled by your registration flow
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;
    
    -- If no default tenant exists, create one
    IF default_tenant_id IS NULL THEN
        INSERT INTO public.tenants (name, slug, status, subscription_tier)
        VALUES ('Default Tenant', 'default', 'active', 'basic')
        RETURNING id INTO default_tenant_id;
    END IF;
    
    -- Insert user profile
    INSERT INTO public.profiles (
        id, 
        tenant_id, 
        email, 
        first_name, 
        last_name,
        role
    ) VALUES (
        NEW.id,
        default_tenant_id,
        user_email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'end_user')
    ) ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$;
-- Create trigger on auth.users to automatically create profiles
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();
