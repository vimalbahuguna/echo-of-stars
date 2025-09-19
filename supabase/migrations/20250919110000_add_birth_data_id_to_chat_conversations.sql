ALTER TABLE public.chat_conversations
ADD COLUMN birth_data_id INT REFERENCES public.user_birth_data(id) ON DELETE SET NULL;

-- Add RLS policy for birth_data_id
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view their own chat conversations" ON public.chat_conversations
FOR SELECT
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to insert their own chat conversations" ON public.chat_conversations
FOR INSERT
WITH CHECK (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to update their own chat conversations" ON public.chat_conversations
FOR UPDATE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);

CREATE POLICY "Allow authenticated users to delete their own chat conversations" ON public.chat_conversations
FOR DELETE
USING (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);