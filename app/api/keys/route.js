// app/api/keys/route.js
import { v4 as uuid } from 'uuid';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById, updateUser } from '@/lib/db';
import { ok, err } from '@/lib/apiHelpers';

function genKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'dp_';
  for (let i = 0; i < 40; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

// POST /api/keys — generate new key
export async function POST(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return err('Unauthorized.', 401);

  const user = findUserById(payload.id);
  if (!user) return err('User tidak ditemukan.', 404);

  const body = await req.json().catch(() => ({}));
  const keyName = (body.name || 'My Key').trim().slice(0, 40);

  const keys = user.apiKeys || [];
  if (keys.length >= 5) return err('Maksimal 5 API key per akun.', 400);

  const newKey = { id: uuid(), name: keyName, key: genKey(), createdAt: new Date().toISOString(), lastUsed: null };
  const updated = updateUser(payload.id, { apiKeys: [...keys, newKey] });

  return ok({ key: newKey }, 201);
}

// DELETE /api/keys — delete a key by id
export async function DELETE(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return err('Unauthorized.', 401);

  const body = await req.json().catch(() => ({}));
  const { keyId } = body;
  if (!keyId) return err('keyId wajib diisi.', 400);

  const user = findUserById(payload.id);
  if (!user) return err('User tidak ditemukan.', 404);

  const filtered = (user.apiKeys || []).filter(k => k.id !== keyId);
  if (filtered.length === (user.apiKeys || []).length)
    return err('Key tidak ditemukan.', 404);

  updateUser(payload.id, { apiKeys: filtered });
  return ok({ message: 'API key dihapus.' });
}
