// app/api/auth/logout/route.js
import { clearCookieOptions } from '@/lib/auth';

export async function POST() {
  return new Response(
    JSON.stringify({ ok: true, message: 'Logout berhasil.' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearCookieOptions() },
    }
  );
}
