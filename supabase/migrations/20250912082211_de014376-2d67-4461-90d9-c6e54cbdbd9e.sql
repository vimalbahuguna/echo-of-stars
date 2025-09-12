-- Multi-tenant Enterprise System with Geographic Hierarchy and RBAC

-- Create enums for system roles and status
CREATE TYPE public.user_role AS ENUM ('super_admin', 'tenant_admin', 'organization_admin', 'franchise_admin', 'manager', 'customer', 'end_user');
CREATE TYPE public.tenant_status AS ENUM ('active', 'suspended', 'inactive', 'trial');
CREATE TYPE public.organization_type AS ENUM ('headquarters', 'franchise', 'branch', 'partner');
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'professional', 'enterprise', 'custom');

-- Geographic hierarchy tables
CREATE TABLE public.continents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    continent_id UUID REFERENCES public.continents(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    iso_code TEXT NOT NULL UNIQUE,
    currency_code TEXT,
    timezone_offset INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES public.countries(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(country_id, code)
);

CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Multi-tenant system
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    status public.tenant_status DEFAULT 'trial',
    subscription_tier public.subscription_tier DEFAULT 'basic',
    country_id UUID REFERENCES public.countries(id),
    city_id UUID REFERENCES public.cities(id),
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    branding_config JSONB DEFAULT '{}',
    feature_config JSONB DEFAULT '{}',
    billing_config JSONB DEFAULT '{}',
    max_users INTEGER DEFAULT 10,
    max_organizations INTEGER DEFAULT 1,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organizations within tenants
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    parent_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type public.organization_type DEFAULT 'branch',
    country_id UUID REFERENCES public.countries(id),
    state_id UUID REFERENCES public.states(id),
    city_id UUID REFERENCES public.cities(id),
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User profiles with multi-tenant support
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    role public.user_role DEFAULT 'end_user',
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    country_id UUID REFERENCES public.countries(id),
    state_id UUID REFERENCES public.states(id),
    city_id UUID REFERENCES public.cities(id),
    address TEXT,
    birth_date DATE,
    birth_time TIME,
    birth_city_id UUID REFERENCES public.cities(id),
    timezone TEXT,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tenant_id, email)
);

-- Role permissions matrix
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    role public.user_role,
    resource TEXT NOT NULL,
    actions TEXT[] NOT NULL,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tenant_id, role, resource)
);

-- User sessions for multi-tenant tracking
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    location JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.continents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for geographic data (public read access)
CREATE POLICY "Geographic data is publicly readable" ON public.continents FOR SELECT USING (true);
CREATE POLICY "Geographic data is publicly readable" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Geographic data is publicly readable" ON public.states FOR SELECT USING (true);
CREATE POLICY "Geographic data is publicly readable" ON public.cities FOR SELECT USING (true);

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenant" ON public.tenants 
    FOR SELECT USING (id = public.get_current_user_tenant_id());

CREATE POLICY "Super admins can manage all tenants" ON public.tenants 
    FOR ALL USING (public.get_current_user_role() = 'super_admin');

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations in their tenant" ON public.organizations 
    FOR SELECT USING (tenant_id = public.get_current_user_tenant_id());

CREATE POLICY "Organization admins can manage their organizations" ON public.organizations 
    FOR ALL USING (
        tenant_id = public.get_current_user_tenant_id() 
        AND (
            public.get_current_user_role() IN ('tenant_admin', 'organization_admin')
            OR id = public.get_current_user_organization_id()
        )
    );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles 
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles 
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view profiles in their tenant" ON public.profiles 
    FOR SELECT USING (
        tenant_id = public.get_current_user_tenant_id()
        AND public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
    );

CREATE POLICY "Admins can manage profiles in their tenant" ON public.profiles 
    FOR ALL USING (
        tenant_id = public.get_current_user_tenant_id()
        AND public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
    );

-- RLS Policies for role permissions
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions 
    FOR ALL USING (
        tenant_id = public.get_current_user_tenant_id()
        AND public.get_current_user_role() IN ('super_admin', 'tenant_admin')
    );

-- RLS Policies for user sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view sessions in their tenant" ON public.user_sessions 
    FOR SELECT USING (
        tenant_id = public.get_current_user_tenant_id()
        AND public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
    );

-- Create indexes for performance
CREATE INDEX idx_countries_continent_id ON public.countries(continent_id);
CREATE INDEX idx_states_country_id ON public.states(country_id);
CREATE INDEX idx_cities_state_id ON public.cities(state_id);
CREATE INDEX idx_organizations_tenant_id ON public.organizations(tenant_id);
CREATE INDEX idx_organizations_parent_id ON public.organizations(parent_organization_id);
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_role_permissions_tenant_role ON public.role_permissions(tenant_id, role);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_tenant_id ON public.user_sessions(tenant_id);

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_continents_updated_at BEFORE UPDATE ON public.continents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON public.states FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- Insert sample geographic data
INSERT INTO public.continents (name, code) VALUES 
    ('Asia', 'AS'),
    ('Europe', 'EU'),
    ('North America', 'NA'),
    ('South America', 'SA'),
    ('Africa', 'AF'),
    ('Australia', 'AU'),
    ('Antarctica', 'AN');

-- Insert sample countries (focusing on major ones)
INSERT INTO public.countries (continent_id, name, code, iso_code, currency_code, timezone_offset) 
SELECT 
    c.id,
    country_data.name,
    country_data.code,
    country_data.iso_code,
    country_data.currency_code,
    country_data.timezone_offset
FROM public.continents c
CROSS JOIN (
    VALUES 
        ('AS', 'India', 'IN', 'IND', 'INR', 330),
        ('AS', 'United States', 'US', 'USA', 'USD', -480),
        ('EU', 'United Kingdom', 'GB', 'GBR', 'GBP', 0),
        ('EU', 'Germany', 'DE', 'DEU', 'EUR', 60),
        ('AS', 'Japan', 'JP', 'JPN', 'JPY', 540),
        ('AS', 'China', 'CN', 'CHN', 'CNY', 480),
        ('NA', 'Canada', 'CA', 'CAN', 'CAD', -480),
        ('AU', 'Australia', 'AU', 'AUS', 'AUD', 600)
) AS country_data(continent_code, name, code, iso_code, currency_code, timezone_offset)
WHERE c.code = country_data.continent_code;

-- Insert default role permissions
INSERT INTO public.role_permissions (tenant_id, role, resource, actions) 
SELECT 
    t.id,
    perm_data.role,
    perm_data.resource,
    perm_data.actions
FROM public.tenants t
CROSS JOIN (
    VALUES 
        ('super_admin', 'tenants', ARRAY['create', 'read', 'update', 'delete']),
        ('super_admin', 'organizations', ARRAY['create', 'read', 'update', 'delete']),
        ('super_admin', 'users', ARRAY['create', 'read', 'update', 'delete']),
        ('super_admin', 'charts', ARRAY['create', 'read', 'update', 'delete']),
        ('tenant_admin', 'organizations', ARRAY['create', 'read', 'update', 'delete']),
        ('tenant_admin', 'users', ARRAY['create', 'read', 'update', 'delete']),
        ('tenant_admin', 'charts', ARRAY['create', 'read', 'update', 'delete']),
        ('organization_admin', 'users', ARRAY['create', 'read', 'update']),
        ('organization_admin', 'charts', ARRAY['create', 'read', 'update', 'delete']),
        ('franchise_admin', 'users', ARRAY['read', 'update']),
        ('franchise_admin', 'charts', ARRAY['create', 'read', 'update']),
        ('manager', 'charts', ARRAY['create', 'read', 'update']),
        ('customer', 'charts', ARRAY['create', 'read']),
        ('end_user', 'charts', ARRAY['create', 'read'])
) AS perm_data(role, resource, actions)
WHERE t.slug = 'default';