'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Create a new agent or admin user
 * Only admins can create agents
 */
export async function createAgent(data: {
  email: string
  password: string
  full_name: string
  role: 'agent' | 'admin'
  phone?: string
}) {
  const supabase = await createServerSupabaseClient()

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Accès non autorisé. Seuls les administrateurs peuvent créer des agents.' }
  }

  // Create user in Supabase Auth using Admin API
  // Note: This requires service_role key which should only be used server-side
  const adminAuthClient = await createServerSupabaseClient()
  
  try {
    // For now, we'll use the regular signup which sends confirmation email
    // In production, you'd want to use the admin API with service role
    const { data: newUser, error: signUpError } = await adminAuthClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`,
      },
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!newUser.user) {
      return { error: 'Erreur lors de la création du compte' }
    }

    // Create profile with specified role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone || null,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'Erreur lors de la création du profil' }
    }

    revalidatePath('/admin/agents')
    return { 
      success: true, 
      message: `${data.role === 'admin' ? 'Administrateur' : 'Agent'} créé avec succès` 
    }
  } catch (error: any) {
    console.error('Create agent error:', error)
    return { error: error.message || 'Erreur lors de la création de l\'utilisateur' }
  }
}

/**
 * Update agent role
 * Only admins can update roles
 */
export async function updateAgentRole(agentId: string, newRole: 'agent' | 'admin' | 'citizen') {
  const supabase = await createServerSupabaseClient()

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Accès non autorisé' }
  }

  // Prevent admin from demoting themselves
  if (agentId === user.id && newRole !== 'admin') {
    return { error: 'Vous ne pouvez pas modifier votre propre rôle' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', agentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/agents')
  return { success: true }
}

/**
 * Delete agent
 * Only admins can delete agents
 */
export async function deleteAgent(agentId: string) {
  const supabase = await createServerSupabaseClient()

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Accès non autorisé' }
  }

  // Prevent admin from deleting themselves
  if (agentId === user.id) {
    return { error: 'Vous ne pouvez pas supprimer votre propre compte' }
  }

  // Note: Due to ON DELETE CASCADE, deleting the auth user will also delete the profile
  // But we can't delete auth users with regular client, only with admin API
  // For now, we'll just update the role to 'citizen' as a soft delete
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'citizen' })
    .eq('id', agentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/agents')
  return { success: true, message: 'Agent retiré des droits d\'administration' }
}

