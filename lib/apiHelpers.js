// lib/apiHelpers.js
export const ok = (data, status = 200) =>
  Response.json({ ok: true, ...data }, { status });

export const err = (message, status = 400) =>
  Response.json({ ok: false, error: message }, { status });

export const ENDPOINTS_META = [
  { id: 'sholat', method: 'GET', path: '/api/v1/sholat', name: 'Jadwal Sholat', icon: '🕌', desc: 'Jadwal sholat 5 waktu berdasarkan kota' },
  { id: 'cuaca', method: 'GET', path: '/api/v1/cuaca', name: 'Info Cuaca', icon: '⛅', desc: 'Cuaca & prakiraan 3 hari' },
  { id: 'quotes', method: 'GET', path: '/api/v1/quotes', name: 'Quotes & Jokes', icon: '💬', desc: 'Quote motivasi & jokes random' },
  { id: 'ai', method: 'POST', path: '/api/v1/ai', name: 'AI Chat', icon: '🤖', desc: 'Chat AI powered by Claude' },
  { id: 'downloader', method: 'GET', path: '/api/v1/downloader', name: 'Downloader', icon: '⬇️', desc: 'Download media TikTok, YouTube, Instagram' },
];
