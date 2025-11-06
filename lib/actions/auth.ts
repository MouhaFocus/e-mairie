'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if profile exists, create if not
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      await (supabase.from('profiles') as any).insert({
        id: data.user.id,
        full_name: data.user.email?.split('@')[0] || 'Utilisateur',
        role: 'citizen',
      })
    }

    // Return role to redirect accordingly
    revalidatePath('/', 'layout')
    return { 
      success: true, 
      role: profile?.role || 'citizen'
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, role: 'citizen' }
}

export async function signUpWithPassword(email: string, password: string, fullName?: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create profile
  if (data.user) {
    await (supabase.from('profiles') as any).insert({
      id: data.user.id,
      full_name: fullName || data.user.email?.split('@')[0] || 'Utilisateur',
      role: 'citizen',
    })
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signInWithEmail(email: string, redirectTo?: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?redirect=${redirectTo || '/app'}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut(redirectTo: string = '/') {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signOutAdmin() {
  return signOut('/admin-login')
}

export async function updateProfile(data: {
  full_name?: string
  phone?: string
  national_id?: string
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await (supabase
    .from('profiles') as any)
    .update(data)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/profile')
  return { success: true }
}

