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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
      return new Response(JSON.stringify({ 
        error: 'No authorization header provided' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        details: userError?.message 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.tenant_id) {
      console.error('Profile fetch failed:', profileError);
      return new Response(JSON.stringify({ 
        error: 'User profile or tenant not found',
        details: profileError?.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const tenantId = profile.tenant_id;

    if (command === 'startPranayamaSession') {
      console.log('Starting pranayama session with data:', data);
      const { practice_type, duration_seconds } = data;
      
      console.log('User ID:', user.id);
      console.log('Tenant ID:', tenantId);
      console.log('Practice type:', practice_type);
      console.log('Duration seconds:', duration_seconds);
      
      console.log('Profile data:', profile);
      console.log('Profile error:', null);
      
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
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to start session: ${error.message}`);
      }

      console.log('Successfully created session:', session);
      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'endPranayamaSession') {
      const { sessionId, duration_seconds, notes } = data;
      const { data: session, error } = await supabaseClient
        .from('pranayama_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_seconds: duration_seconds,
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
      const { sessionId, duration_seconds, notes } = data;
      const { data: session, error } = await supabaseClient
        .from('meditation_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_seconds: duration_seconds,
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
    } else if (command === 'startMantraSession') {
      const { mantra_type, target_repetitions, duration_seconds } = data;
      const { data: session, error } = await supabaseClient
        .from('mantra_sessions')
        .insert({
          user_id: user.id,
          tenant_id: tenantId,
          mantra_type: mantra_type || 'Om Namah Shivaya',
          target_repetitions: target_repetitions || 108,
          duration_seconds: duration_seconds || 0,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting mantra session:', error);
        throw new Error(`Failed to start session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'endMantraSession') {
      const { sessionId, repetitions, notes } = data;
      const { data: session, error } = await supabaseClient
        .from('mantra_sessions')
        .update({
          end_time: new Date().toISOString(),
          repetitions: repetitions || 0,
          notes: notes,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        console.error('Error ending mantra session:', error);
        throw new Error(`Failed to end session: ${error.message}`);
      }

      return new Response(JSON.stringify({ success: true, session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (command === 'getMantraHistory') {
      const { data: sessions, error } = await supabaseClient
        .from('mantra_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching mantra history:', error);
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
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});