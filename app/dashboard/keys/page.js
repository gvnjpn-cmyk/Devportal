'use client';
import { useEffect, useState } from 'react';

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast">{msg}</div>;
}

export default function KeysPage() {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [revealed, setRevealed] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function loadKeys() {
    const res = await fetch('/api/auth/me');
    const d = await res.json();
    if (d.ok) setKeys(d.user.apiKeys || []);
  }

  useEffect(() => { loadKeys(); }, []);

  async function createKey() {
    if (!newKeyName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName }),
    });
    const d = await res.json();
    if (d.ok) {
      setToast('API key berhasil dibuat!');
      setNewKeyName('');
      await loadKeys();
    } else {
      setToast(d.error || 'Gagal membuat key.');
    }
    setLoading(false);
  }

  async function deleteKey(keyId) {
    const res = await fetch('/api/keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyId }),
    });
    const d = await res.json();
    if (d.ok) { setToast('Key dihapus.'); await loadKeys(); }
    setConfirmDelete(null);
  }

  function copyKey(key) {
    navigator.clipboard.writeText(key).then(() => setToast('Copied!'));
  }

  function maskKey(key) {
    return key.slice(0, 6) + '••••••••••••••••••••••••••' + key.slice(-4);
  }

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8a8880', letterSpacing: '0.1em', marginBottom: 6 }}>// API KEYS</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: '0.03em', color: '#f4f1eb' }}>KELOLA API KEYS</h1>
        <p style={{ color: '#8a8880', fontSize: 13, marginTop: 6, fontFamily: 'Outfit, sans-serif' }}>Buat dan kelola API key. Maks. 5 key per akun.</p>
      </div>

      {/* Create key */}
      <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 16 }}>BUAT KEY BARU</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input-base"
            style={{ flex: 1 }}
            placeholder="Nama key (contoh: Bot WA Utama)"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createKey()}
            maxLength={40}
          />
          <button onClick={createKey} disabled={loading || !newKeyName.trim() || keys.length >= 5} className="btn-primary" style={{ whiteSpace: 'nowrap', opacity: (loading || !newKeyName.trim() || keys.length >= 5) ? 0.5 : 1 }}>
            {loading ? '...' : '+ Generate'}
          </button>
        </div>
        {keys.length >= 5 && <p style={{ color: '#e8462a', fontSize: 12, marginTop: 8, fontFamily: 'IBM Plex Mono, monospace' }}>Limit 5 key tercapai. Hapus key lama untuk membuat yang baru.</p>}
      </div>

      {/* Keys list */}
      {keys.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔑</div>
          <div style={{ color: '#8a8880', fontSize: 14, fontFamily: 'Outfit, sans-serif' }}>Belum ada API key. Buat satu di atas!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {keys.map(k => (
            <div key={k.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 14, color: '#f4f1eb', marginBottom: 10 }}>{k.name}</div>
                  <div className="api-key-display" style={{ fontSize: 12 }}>
                    {revealed[k.id] ? k.key : maskKey(k.key)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => setRevealed(r => ({ ...r, [k.id]: !r[k.id] }))} className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>
                      {revealed[k.id] ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                    <button onClick={() => copyKey(k.key)} className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>
                      Copy
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 8 }}>
                    Dibuat {new Date(k.createdAt).toLocaleDateString('id-ID')}
                  </div>
                  {confirmDelete === k.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => deleteKey(k.id)} style={{ padding: '5px 12px', fontSize: 12, background: '#e8462a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Hapus</button>
                      <button onClick={() => setConfirmDelete(null)} className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(k.id)} style={{ padding: '5px 12px', fontSize: 12, background: 'rgba(232,70,42,0.08)', color: '#e8462a', border: '1px solid rgba(232,70,42,0.2)', borderRadius: 4, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage instruction */}
      <div style={{ marginTop: 24 }} className="card">
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: '0.05em', color: '#f4f1eb', marginBottom: 12 }}>CARA PAKAI API KEY</div>
          <pre className="code-block" style={{ fontSize: 12 }}>{`// Kirim via header x-api-key
const res = await fetch('/api/v1/sholat?kota=Jakarta', {
  headers: { 'x-api-key': 'dp_xxxxxxxxxxxxxxxx' }
});`}</pre>
        </div>
      </div>
    </div>
  );
}
