import Link from 'next/link';

const APIS = [
  { icon: '🕌', name: 'Jadwal Sholat', desc: 'Waktu sholat 5 waktu untuk semua kota Indonesia', method: 'GET' },
  { icon: '⛅', name: 'Info Cuaca', desc: 'Cuaca realtime & prakiraan 3 hari via Open-Meteo', method: 'GET' },
  { icon: '💬', name: 'Quotes & Jokes', desc: 'Ratusan quote motivasi & jokes bahasa Indonesia', method: 'GET' },
  { icon: '🤖', name: 'AI Chat', desc: 'Tanya jawab AI powered by Claude Haiku', method: 'POST' },
  { icon: '⬇️', name: 'Downloader', desc: 'Download TikTok, YouTube & Instagram tanpa watermark', method: 'GET' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#08090d' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(244,241,235,0.06)',
        background: 'rgba(8,9,13,0.85)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.1em', color: '#f4f1eb' }}>
            DEV<span style={{ color: '#e8462a' }}>PORTAL</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" className="btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Masuk</Link>
            <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Daftar Gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: '5px 12px', border: '1px solid rgba(232,70,42,0.3)', borderRadius: 20, background: 'rgba(232,70,42,0.06)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8462a', display: 'inline-block', animation: 'blink 1.2s infinite' }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#e8462a', letterSpacing: '0.08em' }}>LIVE — API GRATIS UNTUK DEVELOPER</span>
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(60px, 10vw, 110px)', lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: 28, color: '#f4f1eb' }}>
          REST API<br />
          <span style={{ color: '#e8462a' }}>PLATFORM</span><br />
          <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(50px, 8vw, 90px)', color: 'rgba(244,241,235,0.4)' }}>untuk bot WA</span>
        </h1>

        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, color: '#8a8880', maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
          Daftar, dapatkan API key, dan langsung integrasikan ke bot WhatsApp kamu. Sholat, cuaca, AI, downloader — semua dalam satu platform.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
            Mulai Gratis →
          </Link>
          <Link href="/docs" className="btn-ghost" style={{ fontSize: 15, padding: '14px 32px' }}>
            Lihat Docs
          </Link>
        </div>

        {/* Code preview */}
        <div style={{ marginTop: 64, maxWidth: 600 }}>
          <div style={{ background: '#060709', border: '1px solid rgba(244,241,235,0.06)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(244,241,235,0.06)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880' }}>bot.js</span>
            </div>
            <pre className="code-block" style={{ borderRadius: 0, border: 'none', margin: 0 }}>{`const res = await fetch(
  'https://devportal.vercel.app/api/v1/sholat?kota=Jakarta',
  { headers: { 'x-api-key': 'dp_xxxxxxxxxxxxxxxx' } }
);
const { jadwal } = await res.json();
// { Subuh: '04:21', Dzuhur: '11:47', ... }`}</pre>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'rgba(244,241,235,0.06)', maxWidth: 1140, margin: '0 auto 0' }} />

      {/* API list */}
      <section style={{ maxWidth: 1140, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880', letterSpacing: '0.12em', marginBottom: 12 }}>// ENDPOINTS TERSEDIA</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: '0.03em', color: '#f4f1eb' }}>SEMUA API</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {APIS.map((api, i) => (
            <div key={i} className="card card-hover" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 28 }}>{api.icon}</span>
                <span className={`badge badge-${api.method.toLowerCase()}`}>{api.method}</span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f1eb', marginBottom: 6 }}>{api.name}</div>
              <div style={{ fontSize: 13, color: '#8a8880', lineHeight: 1.5 }}>{api.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'rgba(244,241,235,0.06)', maxWidth: 1140, margin: '0 auto' }} />

      {/* CTA */}
      <section style={{ maxWidth: 1140, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, letterSpacing: '0.03em', color: '#f4f1eb', marginBottom: 16 }}>
          SIAP MULAI?
        </h2>
        <p style={{ color: '#8a8880', fontSize: 15, marginBottom: 32 }}>Daftar gratis, langsung dapat API key.</p>
        <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '14px 40px' }}>
          Buat Akun Sekarang →
        </Link>
      </section>

      <footer style={{ borderTop: '1px solid rgba(244,241,235,0.06)', padding: '24px 32px', textAlign: 'center', color: '#8a8880', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.05em' }}>
        DEVPORTAL © 2026 — API PLATFORM FOR WA BOTS
      </footer>
    </div>
  );
}
