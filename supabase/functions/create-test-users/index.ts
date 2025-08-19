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

    console.log('Starting user cleanup and creation process...')

    // Step 1: Delete all existing profiles first
    console.log('Deleting all existing profiles...')
    const { error: deleteProfilesError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteProfilesError) {
      console.error('Error deleting profiles:', deleteProfilesError)
    }

    // Step 2: Get all existing users and delete them
    console.log('Getting all existing users...')
    const { data: existingUsers, error: getUsersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (getUsersError) {
      console.error('Error getting users:', getUsersError)
    } else {
      console.log(`Found ${existingUsers.users.length} existing users to delete`)
      
      // Delete each user
      for (const user of existingUsers.users) {
        console.log(`Deleting user: ${user.email}`)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`Error deleting user ${user.email}:`, deleteError)
        }
      }
    }

    // Step 3: Create new test users
    console.log('Creating new test users...')
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
      console.log(`Creating user: ${user.email}`)
      
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

      console.log(`User ${user.email} created with ID: ${authData.user.id}`)

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
        console.log(`Profile created for ${user.email}`)
        results.push({ 
          email: user.email, 
          password: user.password,
          name: user.name,
          role: user.role,
          success: true 
        })
      }
    }

    console.log('User cleanup and creation completed')

    return new Response(
      JSON.stringify({ 
        message: 'Users cleanup and creation completed',
        results 
      }),
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