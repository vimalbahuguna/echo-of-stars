CREATE TABLE public.pranayama_sessions (
    id UUID PRIMARY KEY, -- Removed DEFAULT public.uuid_generate_v4()
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL, -- e.g., 'Anulom Vilom', 'Kapalbhati'
    duration_seconds INT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Function to generate UUID before insert
CREATE OR REPLACE FUNCTION public.generate_uuid_for_pranayama_sessions()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id = public.uuid_generate_v4();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert
CREATE TRIGGER set_pranayama_session_uuid
BEFORE INSERT ON public.pranayama_sessions
FOR EACH ROW
EXECUTE FUNCTION public.generate_uuid_for_pranayama_sessions();

ALTER TABLE public.pranayama_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view their own pranayama sessions" ON public.pranayama_sessions
FOR SELECT
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to insert their own pranayama sessions" ON public.pranayama_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to update their own pranayama sessions" ON public.pranayama_sessions
FOR UPDATE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to delete their own pranayama sessions" ON public.pranayama_sessions
FOR DELETE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);