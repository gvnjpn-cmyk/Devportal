'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function SidebarLink({ href, icon, label, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14 }}>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.ok) { router.replace('/login'); return; }
        setUser(d.user);
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#08090d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08090d' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        borderRight: '1px solid rgba(244,241,235,0.06)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        background: '#08090d',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, paddingLeft: 4 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: '0.1em', color: '#f4f1eb' }}>
              DEV<span style={{ color: '#e8462a' }}>PORTAL</span>
            </div>
          </Link>
        </div>

        {/* User info */}
        {user && (
          <div style={{ marginBottom: 24, padding: '12px', background: 'rgba(244,241,235,0.04)', borderRadius: 6, border: '1px solid rgba(244,241,235,0.06)' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#f4f1eb', marginBottom: 2 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        )}

        <div style={{ fontSize: 10, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', marginBottom: 8, paddingLeft: 4 }}>MENU</div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <SidebarLink href="/dashboard" icon="⚡" label="Overview" active={pathname === '/dashboard'} />
          <SidebarLink href="/dashboard/keys" icon="🔑" label="API Keys" active={pathname === '/dashboard/keys'} />
          <SidebarLink href="/dashboard/usage" icon="📊" label="Usage" active={pathname === '/dashboard/usage'} />
          <SidebarLink href="/dashboard/docs" icon="📄" label="Dokumentasi" active={pathname === '/dashboard/docs'} />
        </nav>

        {/* Logout */}
        <button onClick={logout} className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', marginTop: 8 }}>
          <span style={{ fontSize: 16 }}>🚪</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14 }}>Keluar</span>
        </button>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
