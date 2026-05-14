'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.ok) setUser(d.user); });
    fetch('/api/usage').then(r => r.json()).then(d => { if (d.ok) setUsage(d.usage); });
  }, []);

  const keyCount = user?.apiKeys?.length || 0;
  const totalHits = usage?.total || 0;
  const todayKey = new Date().toISOString().split('T')[0];
  const todayHits = usage?.daily?.[todayKey] || 0;
  const topEndpoints = usage ? Object.entries(usage.endpoints || {}).sort((a, b) => b[1] - a[1]).slice(0, 3) : [];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880', letterSpacing: '0.1em', marginBottom: 6 }}>// OVERVIEW</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: '0.03em', color: '#f4f1eb' }}>
          SELAMAT DATANG{user ? `, ${user.name.toUpperCase()}` : ''}
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total API Calls', value: totalHits.toLocaleString('id'), sub: 'Semua waktu', color: '#f4f1eb' },
          { label: 'Hari Ini', value: todayHits.toLocaleString('id'), sub: 'Request hari ini', color: '#e8462a' },
          { label: 'API Keys', value: keyCount, sub: `Maks. 5 key`, color: '#c9a84c' },
          { label: 'Status', value: '●', sub: 'API Online', color: '#64c878' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', marginBottom: 10 }}>{s.label}</div>
            <div className="stat-num" style={{ color: s.color, fontSize: 36 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8a8880', marginTop: 4, fontFamily: 'Outfit, sans-serif' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top endpoints */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 20 }}>TOP ENDPOINTS</div>
          {topEndpoints.length === 0 ? (
            <p style={{ color: '#8a8880', fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>Belum ada request. Mulai pakai API kamu!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topEndpoints.map(([ep, count], i) => (
                <div key={ep} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880', width: 16 }}>0{i + 1}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#f4f1eb' }}>{ep}</span>
                  </div>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#e8462a', letterSpacing: '0.05em' }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick start */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 20 }}>QUICK START</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '01', label: 'Buat API Key', href: '/dashboard/keys', done: keyCount > 0 },
              { step: '02', label: 'Baca Dokumentasi', href: '/dashboard/docs', done: false },
              { step: '03', label: 'Coba Endpoint', href: '/dashboard/docs', done: totalHits > 0 },
            ].map(s => (
              <Link key={s.step} href={s.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 5, background: 'rgba(244,241,235,0.03)', border: '1px solid rgba(244,241,235,0.06)', transition: 'all 0.15s' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: s.done ? '#64c878' : '#8a8880' }}>{s.done ? '✓' : s.step}</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: s.done ? '#64c878' : '#f4f1eb' }}>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
