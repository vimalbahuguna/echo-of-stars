import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, data } = await req.json();

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
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.tenant_id) {
      throw new Error('User profile or tenant not found.');
    }
    const tenantId = profile.tenant_id;

    if (command === 'startPranayamaSession') {
      const { practice_type, duration_seconds } = data;
      const { data: session, error } = await supabaseClient
        .from('pranayama_sessions')
        .insert({
          user_id: user.id,
          tenant_id: tenantId,
          practice_type,
          duration_seconds,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting pranayama session:', error);
        throw new Error(`Failed to start session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'endPranayamaSession') {
      const { sessionId, notes } = data;
      const { data: session, error } = await supabaseClient
        .from('pranayama_sessions')
        .update({
          end_time: new Date().toISOString(),
          notes: notes,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        console.error('Error ending pranayama session:', error);
        throw new Error(`Failed to end session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'getPranayamaHistory') {
      const { data: sessions, error } = await supabaseClient
        .from('pranayama_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching pranayama history:', error);
        throw new Error(`Failed to fetch history: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'startMeditationSession') {
      const { practice_type, duration_seconds } = data;
      const { data: session, error } = await supabaseClient
        .from('meditation_sessions')
        .insert({
          user_id: user.id,
          tenant_id: tenantId,
          practice_type,
          duration_seconds,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting meditation session:', error);
        throw new Error(`Failed to start session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'endMeditationSession') {
      const { sessionId, notes } = data;
      const { data: session, error } = await supabaseClient
        .from('meditation_sessions')
        .update({
          end_time: new Date().toISOString(),
          notes: notes,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        console.error('Error ending meditation session:', error);
        throw new Error(`Failed to end session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'getMeditationHistory') {
      const { data: sessions, error } = await supabaseClient
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching meditation history:', error);
        throw new Error(`Failed to fetch history: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: `Unknown command: ${command}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in spiritual-practice-service function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});