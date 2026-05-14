'use client';
import { useEffect, useState } from 'react';

const EP_ICONS = {
  '/api/v1/sholat': '🕌',
  '/api/v1/cuaca': '⛅',
  '/api/v1/quotes': '💬',
  '/api/v1/ai': '🤖',
  '/api/v1/downloader': '⬇️',
};

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}d lalu`;
  if (s < 3600) return `${Math.floor(s / 60)}m lalu`;
  return `${Math.floor(s / 3600)}j lalu`;
}

export default function UsagePage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch('/api/usage').then(r => r.json()).then(d => { if (d.ok) setUsage(d.usage); });
    const t = setInterval(() => {
      fetch('/api/usage').then(r => r.json()).then(d => { if (d.ok) setUsage(d.usage); });
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const endpoints = usage ? Object.entries(usage.endpoints || {}).sort((a, b) => b[1] - a[1]) : [];
  const maxVal = endpoints[0]?.[1] || 1;

  // Last 7 days data
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
    last7.push({ key, label, count: usage?.daily?.[key] || 0 });
  }
  const maxDay = Math.max(...last7.map(d => d.count), 1);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880', letterSpacing: '0.1em', marginBottom: 6 }}>// USAGE</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: '0.03em', color: '#f4f1eb' }}>STATISTIK PENGGUNAAN</h1>
        <p style={{ color: '#8a8880', fontSize: 13, marginTop: 6, fontFamily: 'Outfit, sans-serif' }}>Auto-refresh setiap 15 detik.</p>
      </div>

      {/* 7 day chart */}
      <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 24 }}>7 HARI TERAKHIR</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
          {last7.map(d => (
            <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace' }}>{d.count || ''}</div>
              <div style={{
                width: '100%',
                height: `${(d.count / maxDay) * 80}px`,
                minHeight: d.count > 0 ? 4 : 0,
                background: d.key === new Date().toISOString().split('T')[0]
                  ? '#e8462a'
                  : 'rgba(244,241,235,0.12)',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.5s ease',
              }} />
              <div style={{ fontSize: 10, color: '#8a8880', fontFamily: 'Outfit, sans-serif', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Endpoint breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 20 }}>PER ENDPOINT</div>
          {endpoints.length === 0 ? (
            <p style={{ color: '#8a8880', fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>Belum ada data.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {endpoints.map(([ep, count]) => (
                <div key={ep}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#a0a0c0', fontFamily: 'IBM Plex Mono, monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{EP_ICONS[ep] || '🔗'}</span><span>{ep}</span>
                    </span>
                    <span style={{ fontSize: 13, color: '#e8462a', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>{count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(244,241,235,0.08)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${(count / maxVal) * 100}%`, background: '#e8462a', borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent requests */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 20 }}>REQUEST TERBARU</div>
          {!usage?.recent?.length ? (
            <p style={{ color: '#8a8880', fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>Belum ada request.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {usage.recent.slice(0, 10).map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(244,241,235,0.03)', borderRadius: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{EP_ICONS[r.endpoint] || '🔗'}</span>
                    <span style={{ fontSize: 12, color: '#a0a0c0', fontFamily: 'IBM Plex Mono, monospace' }}>{r.endpoint}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#8a8880', fontFamily: 'Outfit, sans-serif' }}>{timeAgo(r.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
