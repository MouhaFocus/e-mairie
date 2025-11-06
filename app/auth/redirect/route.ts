import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { UserRole } from '@/lib/supabase/types'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('❌ Redirect error - No user:', userError)
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }

  console.log('✅ User authenticated:', user.id)

  // Get user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: UserRole } | null, error: any }

  if (profileError) {
    console.error('❌ Error fetching profile:', profileError)
    console.error('   User ID:', user.id)
    console.error('   Error code:', profileError.code)
    console.error('   Error message:', profileError.message)
  }

  console.log('📋 Profile data:', profile)
  console.log('🎭 User role:', profile?.role || 'NO ROLE FOUND')

  // Redirect based on role
  if (profile?.role === 'admin' || profile?.role === 'agent') {
    console.log('🔄 Redirecting to /admin')
    return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } else {
    console.log('🔄 Redirecting to /app (role:', profile?.role || 'undefined', ')')
    return NextResponse.redirect(new URL('/app', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}

