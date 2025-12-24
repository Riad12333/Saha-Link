import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value
    const { pathname } = request.nextUrl

    // Define route categories
    const protectedRoutes = ['/patient', '/doctor', '/admin']
    const authRoutes = ['/login', '/register']
    
    // Public routes that should ALWAYS be accessible (even for logged-in users)
    const publicRoutes = [
        '/',
        '/about',
        '/contact',
        '/doctors',
        '/services',
        '/blog',
        '/ai-assistant',
        '/booking'
    ]

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

    // ✅ RULE 1: Public routes are ALWAYS accessible (even for logged-in users)
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // ✅ RULE 2: If user is on a protected route and not logged in -> Redirect to login
    if (isProtectedRoute && !token) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // ✅ RULE 3: If user is on an auth route and IS logged in -> Redirect to dashboard
    if (isAuthRoute && token && role) {
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        } else if (role === 'doctor') {
            return NextResponse.redirect(new URL('/doctor/dashboard', request.url))
        } else {
            return NextResponse.redirect(new URL('/patient/dashboard', request.url))
        }
    }

    // ✅ RULE 4: Role-based access control for protected routes
    if (isProtectedRoute && token && role) {
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
        if (pathname.startsWith('/doctor') && role !== 'doctor') {
            return NextResponse.redirect(new URL('/', request.url))
        }
        if (pathname.startsWith('/patient') && role !== 'patient') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // ✅ RULE 5: Allow all other routes (fallback)
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|eot)).*)',
    ],
}
