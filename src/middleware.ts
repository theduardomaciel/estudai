import { NextRequest, NextResponse } from 'next/server'
import isAuthenticated from './lib/isAuthenticated'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(request.nextUrl.pathname)
    ) {
        return
    }

    const accountAuthenticated = isAuthenticated(request)
    if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('auth') && !accountAuthenticated) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Authentication failed.' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }

    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en'

    if ((request.nextUrl.pathname.length === 1 || request.nextUrl.pathname.startsWith('/auth')) && accountAuthenticated) {
        return NextResponse.redirect(
            new URL(`/${locale}/home${request.nextUrl.search}`, request.url)
        )
    }

    if ((request.nextUrl.pathname.length > 1 && !(request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname.startsWith('/task'))) && !accountAuthenticated) {
        return NextResponse.redirect(
            new URL(`/${locale}${request.nextUrl.search}`, request.url)
        )
    }

    if (request.nextUrl.locale === 'default') {
        return NextResponse.redirect(
            new URL(`/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url)
        )
    }
}