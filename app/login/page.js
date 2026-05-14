'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error); return; }
      router.push('/dashboard');
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08090d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'fixed', top: '15%', left: '8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: '0.1em', color: '#f4f1eb' }}>
              DEV<span style={{ color: '#e8462a' }}>PORTAL</span>
            </div>
          </Link>
          <p style={{ color: '#8a8880', fontSize: 13, marginTop: 8, fontFamily: 'Outfit, sans-serif' }}>Masuk ke akun developer kamu</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: '0.05em', marginBottom: 24, color: '#f4f1eb' }}>MASUK</h1>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(232,70,42,0.08)', border: '1px solid rgba(232,70,42,0.2)', borderRadius: 4, fontSize: 13, color: '#e8462a', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8a8880', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}>EMAIL</label>
              <input
                className="input-base"
                type="email"
                placeholder="email@kamu.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8a8880', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}>PASSWORD</label>
              <input
                className="input-base"
                type="password"
                placeholder="Password kamu"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8, width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Masuk...' : 'Masuk →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8a8880', fontFamily: 'Outfit, sans-serif' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#e8462a', textDecoration: 'none' }}>Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
