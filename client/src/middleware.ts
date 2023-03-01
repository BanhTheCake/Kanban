// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await fetch('http://localhost:3003/v1/api/auth/verifyToken', {
        headers: {
            cookie: `refreshToken=${refreshToken}`,
        },
        credentials: 'include',
    });

    const status = data.status;
    if (status !== 200) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/dashboard/:path*'],
};
