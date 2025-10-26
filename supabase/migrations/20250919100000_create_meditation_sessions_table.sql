CREATE TABLE public.meditation_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Function to generate UUID before insert
CREATE OR REPLACE FUNCTION public.generate_uuid_for_meditation_sessions()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id = public.uuid_generate_v4();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger to call the function before insert
CREATE TRIGGER set_meditation_session_uuid
BEFORE INSERT ON public.meditation_sessions
FOR EACH ROW
EXECUTE FUNCTION public.generate_uuid_for_meditation_sessions();
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to view their own meditation sessions" ON public.meditation_sessions
FOR SELECT
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);
CREATE POLICY "Allow authenticated users to insert their own meditation sessions" ON public.meditation_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);
CREATE POLICY "Allow authenticated users to update their own meditation sessions" ON public.meditation_sessions
FOR UPDATE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);
CREATE POLICY "Allow authenticated users to delete their own meditation sessions" ON public.meditation_sessions
FOR DELETE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);
