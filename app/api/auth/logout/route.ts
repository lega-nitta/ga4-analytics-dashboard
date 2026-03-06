import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'ga4_auth'

export async function POST(request: NextRequest) {
    const res = NextResponse.json({ ok: true })
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isHttps = forwardedProto === 'https' || request.nextUrl?.protocol === 'https:'
    res.cookies.set(AUTH_COOKIE, '', {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })
    return res
}
