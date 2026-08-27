import { NextResponse } from 'next/server';
import { createStaffSession, pinMatches, STAFF_COOKIE } from '@/lib/staff-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { pin?: string } | null;
  if (!body?.pin || !pinMatches(body.pin)) {
    return NextResponse.json({ error: 'Hibás belépési kód.' }, { status: 401 });
  }
  const session = createStaffSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STAFF_COOKIE, session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: session.maxAge,
  });
  return response;
}

