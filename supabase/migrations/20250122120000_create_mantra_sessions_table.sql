-- Create mantra_sessions table
CREATE TABLE IF NOT EXISTS public.mantra_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    mantra_type TEXT NOT NULL,
    repetitions INTEGER DEFAULT 0,
    target_repetitions INTEGER DEFAULT 108,
    duration_seconds INTEGER DEFAULT 0,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_user_id ON public.mantra_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_tenant_id ON public.mantra_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_start_time ON public.mantra_sessions(start_time);
-- Enable RLS (Row Level Security)
ALTER TABLE public.mantra_sessions ENABLE ROW LEVEL SECURITY;
-- Create RLS policies
CREATE POLICY "Users can view their own mantra sessions" ON public.mantra_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mantra sessions" ON public.mantra_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mantra sessions" ON public.mantra_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mantra sessions" ON public.mantra_sessions
    FOR DELETE USING (auth.uid() = user_id);
-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_mantra_sessions_updated_at BEFORE UPDATE ON public.mantra_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
