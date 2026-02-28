import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'themathnifyclub@admin1234';
const ADMIN_PASSWORD = 'MATHnify@1234';
const ADMIN_SESSION_COOKIE = 'mathnify_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'mathnify-secret-change-in-production';

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const token = Buffer.from(`${SESSION_SECRET}:${Date.now()}`).toString('base64');
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [secret] = decoded.split(':');
    return secret === SESSION_SECRET;
  } catch {
    return false;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export { ADMIN_SESSION_COOKIE };
