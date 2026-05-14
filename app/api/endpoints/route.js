// app/api/endpoints/route.js
import { ok } from '@/lib/apiHelpers';
import { ENDPOINTS_META } from '@/lib/apiHelpers';

export async function GET() {
  return ok({ endpoints: ENDPOINTS_META });
}
