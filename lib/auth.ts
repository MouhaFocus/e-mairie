import { createServerSupabaseClient } from './supabase/server'
import { Profile, UserRole } from './supabase/types'

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getCurrentProfile()
  
  if (!profile) {
    throw new Error('Unauthorized')
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new Error('Forbidden')
  }

  return profile
}

export async function isAgent() {
  const profile = await getCurrentProfile()
  return profile?.role === 'agent' || profile?.role === 'admin'
}

export async function isAdmin() {
  const profile = await getCurrentProfile()
  return profile?.role === 'admin'
}

