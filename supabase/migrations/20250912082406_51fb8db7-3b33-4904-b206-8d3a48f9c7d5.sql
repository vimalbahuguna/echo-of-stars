-- Fix security warning: Update function search paths

-- Update security definer functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.has_permission(resource TEXT, action TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.role_permissions rp
        JOIN public.profiles p ON p.tenant_id = rp.tenant_id
        WHERE p.id = auth.uid()
        AND rp.role = p.role
        AND rp.resource = $1
        AND $2 = ANY(rp.actions)
    )
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

-- Update new user registration function
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
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
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';