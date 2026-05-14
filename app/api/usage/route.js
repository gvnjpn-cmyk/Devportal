// app/api/usage/route.js
import { getUserFromRequest } from '@/lib/auth';
import { getUserUsage } from '@/lib/db';
import { ok, err } from '@/lib/apiHelpers';

export async function GET(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return err('Unauthorized.', 401);
  const usage = getUserUsage(payload.id);
  return ok({ usage });
}
