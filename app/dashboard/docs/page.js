'use client';
import { useState, useEffect } from 'react';

const DOCS = [
  {
    id: 'sholat', icon: '🕌', name: 'Jadwal Sholat', method: 'GET', path: '/api/v1/sholat',
    desc: 'Jadwal waktu sholat 5 waktu berdasarkan nama kota Indonesia.',
    params: [
      { name: 'kota', req: false, def: 'jakarta', desc: 'Nama kota (jakarta, surabaya, dll)' },
      { name: 'tanggal', req: false, def: 'hari ini', desc: 'Format YYYY-MM-DD' },
    ],
    example: `{
  "ok": true,
  "kota": "Jakarta",
  "jadwal": { "Subuh": "04:32", "Dzuhur": "11:58", "Ashar": "15:18", "Maghrib": "17:56", "Isya": "19:08" }
}`,
  },
  {
    id: 'cuaca', icon: '⛅', name: 'Cuaca', method: 'GET', path: '/api/v1/cuaca',
    desc: 'Cuaca realtime dan prakiraan 3 hari. Powered by Open-Meteo (gratis).',
    params: [{ name: 'kota', req: false, def: 'Jakarta', desc: 'Nama kota Indonesia atau dunia' }],
    example: `{
  "ok": true,
  "kota": "Bandung",
  "sekarang": { "kondisi": "Berawan 🌥️", "suhu": "22°C", "kelembaban": "84%" },
  "prakiraan_3_hari": [...]
}`,
  },
  {
    id: 'quotes', icon: '💬', name: 'Quotes & Jokes', method: 'GET', path: '/api/v1/quotes',
    desc: 'Quote motivasi atau jokes random bahasa Indonesia.',
    params: [{ name: 'type', req: false, def: 'quote', desc: '"quote" atau "joke"' }],
    example: `{
  "ok": true,
  "type": "quote",
  "quote": "Satu-satunya cara untuk melakukan pekerjaan yang baik adalah mencintai apa yang kamu lakukan.",
  "author": "Steve Jobs"
}`,
  },
  {
    id: 'ai', icon: '🤖', name: 'AI Chat', method: 'POST', path: '/api/v1/ai',
    desc: 'Chat AI powered by Claude. Kirim pesan, terima jawaban cerdas.',
    params: [
      { name: 'message', req: true, def: '', desc: 'Pesan ke AI (body JSON)' },
      { name: 'system', req: false, def: 'WA bot persona', desc: 'System prompt kustom' },
    ],
    isPost: true,
    defaultBody: '{\n  "message": "Apa itu API?"\n}',
    example: `{
  "ok": true,
  "reply": "API (Application Programming Interface) adalah antarmuka yang memungkinkan dua sistem berkomunikasi...",
  "model": "claude-haiku",
  "tokens": { "input": 12, "output": 45 }
}`,
  },
  {
    id: 'downloader', icon: '⬇️', name: 'Downloader', method: 'GET', path: '/api/v1/downloader',
    desc: 'Download media dari TikTok (tanpa watermark), YouTube, Instagram.',
    params: [{ name: 'url', req: true, def: '', desc: 'URL video TikTok/YouTube/Instagram' }],
    example: `{
  "ok": true,
  "platform": "TikTok",
  "title": "Judul video",
  "downloads": { "video_hd": "https://...", "audio": "https://..." }
}`,
  },
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState('sholat');
  const [apiKey, setApiKey] = useState('');
  const [params, setParams] = useState({});
  const [postBody, setPostBody] = useState('{\n  "message": "Apa itu API?"\n}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('docs');

  const ep = DOCS.find(d => d.id === activeId);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.ok && d.user.apiKeys?.length > 0) setApiKey(d.user.apiKeys[0].key);
    });
    setParams({});
    setResult(null);
    if (ep?.isPost) setPostBody(ep.defaultBody || '{}');
  }, [activeId]);

  async function runRequest() {
    setLoading(true);
    setResult(null);
    try {
      let url = ep.path;
      if (!ep.isPost) {
        const qs = Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        if (qs) url += '?' + qs;
      }
      const opts = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json', ...(apiKey ? { 'x-api-key': apiKey } : {}) },
      };
      if (ep.isPost) opts.body = postBody;
      const res = await fetch(url, opts);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 64px)' }}>
      {/* Sidebar endpoints */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#8a8880', letterSpacing: '0.1em', marginBottom: 10 }}>ENDPOINTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {DOCS.map(d => (
            <button key={d.id} onClick={() => setActiveId(d.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 5,
              background: activeId === d.id ? 'rgba(244,241,235,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 14 }}>{d.icon}</span>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: activeId === d.id ? '#f4f1eb' : '#8a8880' }}>{d.name}</div>
                <span className={`badge badge-${d.method.toLowerCase()}`} style={{ fontSize: 9, padding: '1px 5px' }}>{d.method}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {ep && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>{ep.icon}</span>
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: '0.05em', color: '#f4f1eb' }}>{ep.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span className={`badge badge-${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <code style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#8a8880' }}>{ep.path}</code>
                </div>
              </div>
            </div>

            <p style={{ color: '#8a8880', fontSize: 14, marginBottom: 20, lineHeight: 1.6, fontFamily: 'Outfit, sans-serif' }}>{ep.desc}</p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(244,241,235,0.08)' }}>
              {['docs', 'try'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '8px 18px', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif', fontSize: 13,
                  color: activeTab === t ? '#f4f1eb' : '#8a8880',
                  borderBottom: activeTab === t ? '2px solid #e8462a' : '2px solid transparent',
                  marginBottom: -1, transition: 'all 0.15s',
                }}>
                  {t === 'docs' ? 'Dokumentasi' : '▶ Coba Sekarang'}
                </button>
              ))}
            </div>

            {activeTab === 'docs' && (
              <div>
                {/* Parameters */}
                {ep.params.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 12 }}>PARAMETERS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(244,241,235,0.08)' }}>
                          {['Nama', 'Wajib', 'Default', 'Deskripsi'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#8a8880', fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ep.params.map(p => (
                          <tr key={p.name} style={{ borderBottom: '1px solid rgba(244,241,235,0.04)' }}>
                            <td style={{ padding: '8px 12px', fontFamily: 'IBM Plex Mono, monospace', color: '#c9a84c' }}>{p.name}</td>
                            <td style={{ padding: '8px 12px', color: p.req ? '#e8462a' : '#8a8880' }}>{p.req ? 'Ya' : 'Tidak'}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'IBM Plex Mono, monospace', color: '#8a8880', fontSize: 12 }}>{p.def || '—'}</td>
                            <td style={{ padding: '8px 12px', color: '#a0a0c0' }}>{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Example */}
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 12 }}>CONTOH RESPONSE</div>
                  <div className="code-block" style={{ fontSize: 12 }}>{ep.example}</div>
                </div>
              </div>
            )}

            {activeTab === 'try' && (
              <div>
                {/* API Key input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', marginBottom: 6 }}>X-API-KEY</label>
                  <input className="input-base" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }} placeholder="dp_xxxxxxxxxxxx (dari halaman API Keys)" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                </div>

                {/* Params */}
                {!ep.isPost && ep.params.map(p => (
                  <div key={p.name} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', marginBottom: 6 }}>
                      {p.name.toUpperCase()} {p.req && <span style={{ color: '#e8462a' }}>*</span>}
                    </label>
                    <input className="input-base" placeholder={p.def || p.desc} value={params[p.name] || ''} onChange={e => setParams(pr => ({ ...pr, [p.name]: e.target.value }))} />
                  </div>
                ))}

                {ep.isPost && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', marginBottom: 6 }}>REQUEST BODY (JSON)</label>
                    <textarea className="input-base" rows={5} value={postBody} onChange={e => setPostBody(e.target.value)} style={{ resize: 'vertical', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }} />
                  </div>
                )}

                <button onClick={runRequest} disabled={loading} className="btn-primary" style={{ marginBottom: 20, opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⏳ Loading...' : `▶ Send ${ep.method}`}
                </button>

                {result && (
                  <div>
                    <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', marginBottom: 8 }}>RESPONSE</div>
                    <div className="code-block" style={{ fontSize: 12, color: result.startsWith('Error') ? '#e8462a' : '#a8d5b5' }}>{result}</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
