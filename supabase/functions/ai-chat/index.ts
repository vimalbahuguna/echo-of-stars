import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseAnonKey) {
      throw new Error('Server configuration error: Missing environment variables.');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication error: Missing Authorization header.' }), { status: 401, headers: corsHeaders });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: `Authentication error: ${userError?.message || 'Invalid token.'}` }), { status: 401, headers: corsHeaders });
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error(`Database error: Could not retrieve user profile. Error: ${profileError?.message}`);
    }

    const { message, conversationId } = await req.json();

    let conversation;
    if (conversationId) {
      const { data } = await supabaseClient.from('chat_conversations').select('*').eq('id', conversationId).eq('user_id', user.id).single();
      conversation = data;
    }

    if (!conversation) {
      const { data: newConversation, error } = await supabaseClient
        .from('chat_conversations')
        .insert({ user_id: user.id, tenant_id: profile.tenant_id, conversation_title: message.substring(0, 50) + '...' })
        .select().single();
      if (error) throw new Error(`Database error: Failed to create conversation. Error: ${error.message}`);
      conversation = newConversation;
    }

    await supabaseClient.from('chat_messages').insert({ conversation_id: conversation.id, user_id: user.id, sender_type: 'user', message_content: message });

    const { data: recentMessages } = await supabaseClient.from('chat_messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: false }).limit(10);
    const { data: userBirthData } = await supabaseClient.from('user_birth_data').select('*').eq('user_id', user.id).single();
    const { data: latestBirthChart } = await supabaseClient.from('birth_charts').select('chart_data').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();

    const systemPrompt = `You are SOS Oracle, an advanced AI astrologer. You have deep knowledge of Western and Vedic astrology.

User Context:
- Name: ${profile.first_name} ${profile.last_name}
- Birth Data: ${userBirthData ? `${userBirthData.name}, born on ${userBirthData.date} at ${userBirthData.time} in ${userBirthData.location}` : 'Not provided'}
${latestBirthChart ? `- Latest Birth Chart Data: ${JSON.stringify(latestBirthChart.chart_data)}` : ''}

You should provide insightful, accurate astrological guidance. Be empathetic and supportive.`;

    const messagesToAI = [
      { role: 'system', content: systemPrompt },
      ...(recentMessages?.slice(-6).map(msg => ({ role: msg.sender_type === 'user' ? 'user' : 'assistant', content: msg.message_content })) || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o', messages: messagesToAI, max_tokens: 1000, temperature: 0.7 }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`AI service error: ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    await supabaseClient.from('chat_messages').insert({ conversation_id: conversation.id, user_id: user.id, sender_type: 'ai', message_content: aiResponse, ai_model: 'gpt-4o', tokens_used: data.usage?.total_tokens || 0 });

    return new Response(JSON.stringify({ success: true, response: aiResponse, conversationId: conversation.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat function:', error.message);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseAnonKey) {
      throw new Error('Server configuration error: Missing environment variables.');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication error: Missing Authorization header.' }), { status: 401, headers: corsHeaders });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: `Authentication error: ${userError?.message || 'Invalid token.'}` }), { status: 401, headers: corsHeaders });
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error(`Database error: Could not retrieve user profile. Error: ${profileError?.message}`);
    }

    const { message, conversationId } = await req.json();

    let conversation;
    if (conversationId) {
      const { data } = await supabaseClient.from('chat_conversations').select('*').eq('id', conversationId).eq('user_id', user.id).single();
      conversation = data;
    }

    if (!conversation) {
      const { data: newConversation, error } = await supabaseClient
        .from('chat_conversations')
        .insert({ user_id: user.id, tenant_id: profile.tenant_id, conversation_title: message.substring(0, 50) + '...' })
        .select().single();
      if (error) throw new Error(`Database error: Failed to create conversation. Error: ${error.message}`);
      conversation = newConversation;
    }

    await supabaseClient.from('chat_messages').insert({ conversation_id: conversation.id, user_id: user.id, sender_type: 'user', message_content: message });

    const { data: recentMessages } = await supabaseClient.from('chat_messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: false }).limit(10);
    const { data: userBirthData } = await supabaseClient.from('user_birth_data').select('*').eq('user_id', user.id).single();

    const systemPrompt = `You are SOS Oracle, an advanced AI astrologer. You have deep knowledge of Western and Vedic astrology.

User Context:
- Name: ${profile.first_name} ${profile.last_name}
- Birth Data: ${userBirthData ? `${userBirthData.name}, born on ${userBirthData.date} at ${userBirthData.time} in ${userBirthData.location}` : 'Not provided'}

You should provide insightful, accurate astrological guidance. Be empathetic and supportive.`;

    const messagesToAI = [
      { role: 'system', content: systemPrompt },
      ...(recentMessages?.slice(-6).map(msg => ({ role: msg.sender_type === 'user' ? 'user' : 'assistant', content: msg.message_content })) || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o', messages: messagesToAI, max_tokens: 1000, temperature: 0.7 }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`AI service error: ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    await supabaseClient.from('chat_messages').insert({ conversation_id: conversation.id, user_id: user.id, sender_type: 'ai', message_content: aiResponse, ai_model: 'gpt-4o', tokens_used: data.usage?.total_tokens || 0 });

    return new Response(JSON.stringify({ success: true, response: aiResponse, conversationId: conversation.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat function:', error.message);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
