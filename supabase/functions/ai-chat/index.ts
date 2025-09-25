import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { OpenAI } from "https://deno.land/x/openai@v4.52.7/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Note: Please ensure the environment variable is named OPENAI_API_KEY and not OPENA_API_KEY.
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const openai = new OpenAI({
  apiKey: openAIApiKey,
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('OPENAI_API_KEY value:', Deno.env.get('OPENAI_API_KEY'));
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's tenant from their profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) {
      throw new Error('User profile or tenant not found.');
    }
    const tenantId = profile.tenant_id;

    const { message, conversationId: currentConversationId, birthData, astrologicalSystem, chartId } = await req.json();

    console.log('Received request data:', { 
      message: message ? 'present' : 'missing', 
      conversationId: currentConversationId, 
      chartId, 
      birthData: birthData ? 'present' : 'missing' 
    });

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let conversationId = currentConversationId;

    // If no conversationId, create a new conversation
    if (!conversationId) {
      const contextData = chartId ? { chart_id: parseInt(chartId) } : {};
      console.log('Creating new conversation with context:', contextData);
      
      const { data: newConversation, error: convError } = await supabaseClient
        .from('chat_conversations')
        .insert({ 
          user_id: user.id, 
          tenant_id: tenantId, 
          is_active: true,
          context_data: contextData,
          conversation_title: birthData ? `Consultation for ${birthData.name}` : 'General Consultation'
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        throw new Error(`Failed to create conversation: ${convError.message}`);
      }
      conversationId = newConversation.id;
      console.log('Created new conversation:', conversationId, 'with context:', contextData);
    }

    // Save user message
    const { error: userMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        sender_type: 'user',
        message_content: message,
      });

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      throw new Error(`Failed to save user message: ${userMessageError.message}`);
    }

    // Fetch conversation history
    const { data: chatHistory, error: historyError } = await supabaseClient
      .from('chat_messages')
      .select('sender_type, message_content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (historyError) throw historyError;

    const systemName = astrologicalSystem === 'vedic' ? 'Vedic' : 'Western';

    let systemPrompt = `You are SOS Oracle, an advanced AI astrologer and cosmic guide. For this consultation, please focus on the principles of ${systemName} astrology. Your goal is to provide insightful, empathetic, and clear guidance. Be conversational and supportive.`;

    if (birthData) {
      systemPrompt = `You are SOS Oracle, an advanced AI astrologer. For this consultation, please use the ${systemName} astrological system. The user has provided their birth chart details:
      - Name: ${birthData.name}
      - Date of Birth: ${birthData.date}
      - Time of Birth: ${birthData.time || 'Not specified'}
      - Location of Birth: ${birthData.location}
      Please use this information to provide personalized and specific astrological insights, predictions, suggestions, and remedies based on the selected astrological system. Your tone should be insightful, empathetic, and clear.`;
    }

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...chatHistory.map(msg => {
        const role = msg.sender_type === 'user' ? 'user' as const : 'assistant' as const;
        return {
          role,
          content: msg.message_content,
        };
      }),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1500,
      temperature: 0.7,
      presence_penalty: 0.1,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    const { error: aiMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id, // Associate AI message with the user who initiated it
        sender_type: 'ai',
        message_content: aiResponse,
        ai_model: 'gpt-4o',
        tokens_used: completion.usage?.total_tokens,
      });

    if (aiMessageError) {
      console.error('Error saving AI message:', aiMessageError);
      throw new Error(`Failed to save AI response: ${aiMessageError.message}`);
    }

    // Update conversation timestamp
    await supabaseClient
      .from('chat_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return new Response(JSON.stringify({
      response: aiResponse,
      conversationId: conversationId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});