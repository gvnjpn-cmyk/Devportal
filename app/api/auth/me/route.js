// app/api/auth/me/route.js
import { getUserFromRequest } from '@/lib/auth';
import { findUserById } from '@/lib/db';
import { ok, err } from '@/lib/apiHelpers';

export async function GET(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return err('Unauthorized.', 401);

  const user = findUserById(payload.id);
  if (!user) return err('User tidak ditemukan.', 404);

  return ok({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      apiKeys: (user.apiKeys || []).map(k => ({
        id: k.id,
        name: k.name,
        key: k.key,
        createdAt: k.createdAt,
        lastUsed: k.lastUsed || null,
      })),
    },
  });
}
