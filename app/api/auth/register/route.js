// app/api/auth/register/route.js
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '@/lib/db';
import { signToken, authCookieOptions } from '@/lib/auth';
import { err } from '@/lib/apiHelpers';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { name, email, password } = body;

  if (!name || !email || !password)
    return err('Semua field wajib diisi.', 400);
  if (password.length < 6)
    return err('Password minimal 6 karakter.', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return err('Format email tidak valid.', 400);
  if (findUserByEmail(email))
    return err('Email sudah terdaftar.', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({
    id: uuid(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  const token = signToken({ id: user.id, email: user.email, name: user.name });

  return new Response(
    JSON.stringify({ ok: true, message: 'Registrasi berhasil.', user: { id: user.id, name: user.name, email: user.email } }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': authCookieOptions(token) },
    }
  );
}
