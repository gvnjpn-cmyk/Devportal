import './globals.css';

export const metadata = {
  title: 'DevPortal — API Platform',
  description: 'Platform API untuk developer. Daftar, generate API key, dan mulai integrasi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
