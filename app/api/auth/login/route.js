// app/api/auth/login/route.js
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db';
import { signToken, authCookieOptions } from '@/lib/auth';
import { err } from '@/lib/apiHelpers';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password)
    return err('Email dan password wajib diisi.', 400);

  const user = findUserByEmail(email);
  if (!user) return err('Email atau password salah.', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return err('Email atau password salah.', 401);

  const token = signToken({ id: user.id, email: user.email, name: user.name });

  return new Response(
    JSON.stringify({ ok: true, message: 'Login berhasil.', user: { id: user.id, name: user.name, email: user.email } }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': authCookieOptions(token) },
    }
  );
}
