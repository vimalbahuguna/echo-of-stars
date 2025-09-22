-- Create user_themes table for storing custom user themes
CREATE TABLE IF NOT EXISTS public.user_themes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    colors jsonb NOT NULL DEFAULT '{}',
    gradients jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_themes_name_check CHECK (char_length(name) > 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_themes_user_id_idx ON public.user_themes(user_id);
CREATE INDEX IF NOT EXISTS user_themes_created_at_idx ON public.user_themes(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_themes
CREATE POLICY "Users can view their own themes" ON public.user_themes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own themes" ON public.user_themes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own themes" ON public.user_themes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own themes" ON public.user_themes
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_user_themes_updated_at
    BEFORE UPDATE ON public.user_themes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();