-- 1. Add tenant_id to user_birth_data table
ALTER TABLE public.user_birth_data
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Backfill tenant_id for existing user_birth_data
UPDATE public.user_birth_data ubd
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE ubd.user_id = p.id;

-- Make tenant_id not nullable after backfilling
ALTER TABLE public.user_birth_data
ALTER COLUMN tenant_id SET NOT NULL;


-- 2. Drop the old RLS policy on user_birth_data
DROP POLICY "Allow users to manage their own birth data" ON public.user_birth_data;

-- 3. Create a new tenant-aware RLS policy for user_birth_data
CREATE POLICY "Allow tenant members to manage birth data" ON public.user_birth_data
FOR ALL
USING (
  (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id
);


-- 4. Enable RLS on chat_conversations (if not already enabled)
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- 5. Create a tenant-aware RLS policy for chat_conversations
CREATE POLICY "Allow tenant members to access chat conversations" ON public.chat_conversations
FOR ALL
USING (
  (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id
);


-- 6. Enable RLS on chat_messages (if not already enabled)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 7. Create a tenant-aware RLS policy for chat_messages
CREATE POLICY "Allow tenant members to access chat messages" ON public.chat_messages
FOR ALL
USING (
  (SELECT tenant_id FROM public.chat_conversations WHERE id = conversation_id) IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  )
);
