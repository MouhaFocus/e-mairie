import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { UserRole } from '@/lib/supabase/types'

export async function GET(request: Request) {
  console.log('🎯 Auth callback called!')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('📥 Callback params - code:', code ? 'present' : 'missing')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if profile exists, create if not
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single() as { data: { id: string, role: UserRole } | null, error: any }

        console.log('🔐 Auth callback - User:', user.id)
        console.log('📋 Auth callback - Profile:', profile)

        if (!profile) {
          // Create profile for new user
          console.log('➕ Creating new profile for user:', user.id)
          await (supabase.from('profiles') as any).insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'Utilisateur',
            role: 'citizen',
          })
          
          // Redirect new users (citizens) to /app
          console.log('🔄 Redirecting new user to /app')
          return NextResponse.redirect(`${origin}/app`)
        }

        // Redirect based on role
        if (profile.role === 'admin' || profile.role === 'agent') {
          console.log('🔄 Redirecting', profile.role, 'to /admin')
          return NextResponse.redirect(`${origin}/admin`)
        } else {
          console.log('🔄 Redirecting citizen to /app')
          return NextResponse.redirect(`${origin}/app`)
        }
      }

      // Fallback if no user
      return NextResponse.redirect(`${origin}/app`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`)
}

