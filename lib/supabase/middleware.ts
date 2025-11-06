import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from './types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes logic
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin-login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && !isAdminLoginRoute
  const isAppRoute = request.nextUrl.pathname.startsWith('/app')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  // If user is not logged in and tries to access protected routes
  if (!user && (isAdminRoute || isAppRoute)) {
    console.log('🔒 No user - redirecting to login')
    const url = request.nextUrl.clone()
    
    // Redirect to appropriate login page
    if (isAdminRoute) {
      // Admin routes → admin login
      url.pathname = '/admin-login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
    } else {
      // App routes → citizen login
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
    }
    
    return NextResponse.redirect(url)
  }

  // If user is logged in, check role-based access
  if (user && (isAdminRoute || isAppRoute)) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('👤 Middleware - User:', user.id)
    console.log('📋 Profile data:', profile)
    console.log('❌ Profile error:', profileError)
    console.log('🎭 Role:', profile?.role)
    console.log('🔗 Path:', request.nextUrl.pathname)

    const userRole = profile?.role || 'citizen'

    // Admin/Agent trying to access /app -> redirect to /admin
    if (isAppRoute && (userRole === 'admin' || userRole === 'agent')) {
      console.log('🔀 Admin/Agent accessing /app - redirecting to /admin')
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    // Citizen trying to access /admin -> redirect to /app
    if (isAdminRoute && userRole === 'citizen') {
      console.log('🔀 Citizen accessing /admin - redirecting to /app')
      const url = request.nextUrl.clone()
      url.pathname = '/app'
      return NextResponse.redirect(url)
    }

    // If access is authorized, continue
    console.log('✅ Access authorized')
  }

  // Redirect logged-in users away from login pages
  if (user && (isAdminLoginRoute || (isAuthRoute && !request.nextUrl.pathname.startsWith('/auth/callback')))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('🔀 Login page accessed by logged-in user - redirecting based on role')

    const url = request.nextUrl.clone()
    
    // Redirect based on role
    if (profile?.role === 'admin' || profile?.role === 'agent') {
      url.pathname = '/admin'
    } else {
      url.pathname = '/app'
    }
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

