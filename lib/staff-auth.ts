import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const STAFF_PIN = '8280';
export const STAFF_COOKIE = 'aurora_staff_session';
const SESSION_LENGTH_SECONDS = 60 * 60 * 12;

const sessionSecret = () => process.env.STAFF_SESSION_SECRET || 'aurora-katalogushaza-8280-session';
const signature = (expires: string) => createHmac('sha256', sessionSecret()).update(expires).digest('base64url');

export function pinMatches(pin: string) {
  const received = Buffer.from(pin);
  const expected = Buffer.from(STAFF_PIN);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function createStaffSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_LENGTH_SECONDS);
  return { token: `${expires}.${signature(expires)}`, maxAge: SESSION_LENGTH_SECONDS };
}

export function verifyStaffSession(token?: string) {
  if (!token) return false;
  const [expires, suppliedSignature] = token.split('.');
  if (!expires || !suppliedSignature || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(signature(expires));
  const received = Buffer.from(suppliedSignature);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function isStaffAuthenticated() {
  const cookieStore = await cookies();
  return verifyStaffSession(cookieStore.get(STAFF_COOKIE)?.value);
}

