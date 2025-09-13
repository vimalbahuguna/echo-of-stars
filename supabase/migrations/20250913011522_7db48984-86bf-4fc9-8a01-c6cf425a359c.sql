-- Create charts database tables with user relationships
CREATE TABLE public.birth_charts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    chart_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME WITHOUT TIME ZONE,
    birth_city_id UUID,
    birth_latitude DECIMAL(10, 8),
    birth_longitude DECIMAL(11, 8),
    timezone TEXT,
    chart_type TEXT NOT NULL DEFAULT 'natal', -- natal, transit, synastry, etc.
    astrological_system TEXT NOT NULL DEFAULT 'western', -- western, vedic
    chart_data JSONB NOT NULL DEFAULT '{}', -- calculated positions, houses, aspects
    metadata JSONB DEFAULT '{}', -- additional chart settings and preferences
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT birth_charts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT birth_charts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE,
    CONSTRAINT birth_charts_birth_city_id_fkey FOREIGN KEY (birth_city_id) REFERENCES public.cities(id)
);

-- Create chart interpretations table for AI-generated analyses
CREATE TABLE public.chart_interpretations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chart_id UUID NOT NULL,
    user_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    interpretation_type TEXT NOT NULL, -- full, aspect, planet, house, transit
    ai_model TEXT NOT NULL DEFAULT 'gpt-4o',
    interpretation_text TEXT NOT NULL,
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chart_interpretations_chart_id_fkey FOREIGN KEY (chart_id) REFERENCES public.birth_charts(id) ON DELETE CASCADE,
    CONSTRAINT chart_interpretations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT chart_interpretations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE
);

-- Create chart shares table for sharing capabilities
CREATE TABLE public.chart_shares (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chart_id UUID NOT NULL,
    shared_by_user_id UUID NOT NULL,
    shared_with_user_id UUID,
    share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
    share_type TEXT NOT NULL DEFAULT 'link', -- link, user, public
    permissions JSONB DEFAULT '{"view": true, "comment": false}',
    expires_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chart_shares_chart_id_fkey FOREIGN KEY (chart_id) REFERENCES public.birth_charts(id) ON DELETE CASCADE,
    CONSTRAINT chart_shares_shared_by_user_id_fkey FOREIGN KEY (shared_by_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT chart_shares_shared_with_user_id_fkey FOREIGN KEY (shared_with_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create planetary positions table for detailed astronomical data
CREATE TABLE public.planetary_positions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chart_id UUID NOT NULL,
    planet_name TEXT NOT NULL, -- sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, ascendant, midheaven, etc.
    longitude DECIMAL(8, 5) NOT NULL, -- degrees in zodiac
    latitude DECIMAL(8, 5), -- degrees north/south of ecliptic
    speed DECIMAL(8, 5), -- degrees per day
    house_number INTEGER CHECK (house_number >= 1 AND house_number <= 12),
    sign_name TEXT NOT NULL,
    sign_degrees DECIMAL(5, 2) NOT NULL,
    is_retrograde BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT planetary_positions_chart_id_fkey FOREIGN KEY (chart_id) REFERENCES public.birth_charts(id) ON DELETE CASCADE
);

-- Create chat conversations table for real chat history
CREATE TABLE public.chat_conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    conversation_title TEXT,
    context_data JSONB DEFAULT '{}', -- chart data, user preferences, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chat_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT chat_conversations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    user_id UUID NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
    message_content TEXT NOT NULL,
    ai_model TEXT, -- only for AI messages
    confidence_score DECIMAL(3, 2), -- only for AI messages
    context_used JSONB, -- what context was used for this AI response
    tokens_used INTEGER, -- for cost tracking
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security on all tables
ALTER TABLE public.birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planetary_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for birth_charts
CREATE POLICY "Users can view their own charts"
ON public.birth_charts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own charts"
ON public.birth_charts FOR INSERT
WITH CHECK (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their own charts"
ON public.birth_charts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charts"
ON public.birth_charts FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public charts"
ON public.birth_charts FOR SELECT
USING (is_public = true);

-- Create RLS policies for chart_interpretations
CREATE POLICY "Users can view interpretations for their charts"
ON public.chart_interpretations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create interpretations for their charts"
ON public.chart_interpretations FOR INSERT
WITH CHECK (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update interpretations for their charts"
ON public.chart_interpretations FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for chart_shares
CREATE POLICY "Users can view shares they created or received"
ON public.chart_shares FOR SELECT
USING (auth.uid() = shared_by_user_id OR auth.uid() = shared_with_user_id);

CREATE POLICY "Users can create shares for their charts"
ON public.chart_shares FOR INSERT
WITH CHECK (
    auth.uid() = shared_by_user_id AND
    EXISTS (SELECT 1 FROM public.birth_charts WHERE id = chart_id AND user_id = auth.uid())
);

CREATE POLICY "Users can update their own shares"
ON public.chart_shares FOR UPDATE
USING (auth.uid() = shared_by_user_id);

-- Create RLS policies for planetary_positions
CREATE POLICY "Users can view positions for their charts"
ON public.planetary_positions FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.birth_charts WHERE id = chart_id AND user_id = auth.uid())
);

CREATE POLICY "System can insert planetary positions"
ON public.planetary_positions FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.birth_charts WHERE id = chart_id AND user_id = auth.uid())
);

-- Create RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
ON public.chat_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their own conversations"
ON public.chat_conversations FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

CREATE POLICY "Users can create messages in their conversations"
ON public.chat_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_birth_charts_user_id ON public.birth_charts(user_id);
CREATE INDEX idx_birth_charts_tenant_id ON public.birth_charts(tenant_id);
CREATE INDEX idx_birth_charts_created_at ON public.birth_charts(created_at);
CREATE INDEX idx_birth_charts_chart_type ON public.birth_charts(chart_type);

CREATE INDEX idx_chart_interpretations_chart_id ON public.chart_interpretations(chart_id);
CREATE INDEX idx_chart_interpretations_user_id ON public.chart_interpretations(user_id);

CREATE INDEX idx_chart_shares_chart_id ON public.chart_shares(chart_id);
CREATE INDEX idx_chart_shares_share_token ON public.chart_shares(share_token);

CREATE INDEX idx_planetary_positions_chart_id ON public.planetary_positions(chart_id);
CREATE INDEX idx_planetary_positions_planet_name ON public.planetary_positions(planet_name);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_birth_charts_updated_at
    BEFORE UPDATE ON public.birth_charts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_interpretations_updated_at
    BEFORE UPDATE ON public.chart_interpretations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_shares_updated_at
    BEFORE UPDATE ON public.chart_shares
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();