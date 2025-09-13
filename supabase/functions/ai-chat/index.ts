import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
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

    // Get current user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get user's profile and tenant
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const { message, conversationId } = await req.json();
    console.log('Processing chat message:', { message, conversationId, userId: user.id });

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabaseClient
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();
      conversation = data;
    }

    if (!conversation) {
      const { data: newConversation, error } = await supabaseClient
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          tenant_id: profile.tenant_id,
          conversation_title: message.substring(0, 50) + '...',
          context_data: {
            user_profile: {
              first_name: profile.first_name,
              birth_date: profile.birth_date,
              timezone: profile.timezone
            }
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create conversation:', error);
        throw new Error('Failed to create conversation');
      }
      conversation = newConversation;
    }

    // Store user message
    await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id,
        sender_type: 'user',
        message_content: message
      });

    // Get recent messages for context
    const { data: recentMessages } = await supabaseClient
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get user's birth charts for context
    const { data: userCharts } = await supabaseClient
      .from('birth_charts')
      .select('chart_name, birth_date, astrological_system, chart_data')
      .eq('user_id', user.id)
      .limit(3);

    // Build context for AI
    const contextData = {
      userProfile: profile,
      recentCharts: userCharts || [],
      conversationHistory: recentMessages?.reverse() || []
    };

    // Create AI system prompt
    const systemPrompt = `You are SOS Oracle, an advanced AI astrologer and cosmic guide. You have deep knowledge of both Western and Vedic astrology, planetary influences, and spiritual guidance.

User Context:
- Name: ${profile.first_name} ${profile.last_name}
- Birth Date: ${profile.birth_date || 'Not provided'}
- Timezone: ${profile.timezone || 'Not provided'}
- Recent Charts: ${userCharts?.length || 0} charts available

You should:
1. Provide insightful, accurate astrological guidance
2. Reference the user's birth data when available
3. Explain astrological concepts clearly
4. Offer practical advice based on cosmic influences
5. Be empathetic and supportive
6. Reference planetary transits and their meanings
7. Suggest remedies and positive actions when appropriate

Keep responses conversational, insightful, and helpful. Draw from both traditional astrological wisdom and modern psychological insights.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages?.slice(-6).map(msg => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.message_content
      })) || [],
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log('AI response generated, tokens used:', tokensUsed);

    // Store AI response
    await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id,
        sender_type: 'ai',
        message_content: aiResponse,
        ai_model: 'gpt-4o',
        confidence_score: 0.85,
        context_used: contextData,
        tokens_used: tokensUsed
      });

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
      conversationId: conversation.id,
      tokensUsed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});