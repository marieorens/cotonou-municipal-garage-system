import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'Admin123!',
        name: 'Administrateur Test',
        role: 'admin'
      },
      {
        email: 'agent@test.com',
        password: 'Agent123!',
        name: 'Agent de Saisie Test',
        role: 'agent'
      },
      {
        email: 'finance@test.com',
        password: 'Finance123!',
        name: 'Responsable Financier Test',
        role: 'finance'
      }
    ]

    const results = []

    for (const user of testUsers) {
      // Create user in auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        }
      })

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError)
        results.push({ email: user.email, error: authError.message })
        continue
      }

      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_active: true
        })

      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError)
        results.push({ email: user.email, error: profileError.message })
      } else {
        results.push({ email: user.email, success: true, password: user.password })
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})