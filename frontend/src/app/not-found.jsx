import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 600, color: '#17191c' }}>Page Not Found</h2>
      <p style={{ color: 'rgba(23, 25, 28, 0.65)' }}>Could not find requested resource</p>
      <Link href="/" className="voyara-btn voyara-btn-dark" style={{ marginTop: '12px' }}>
        <span>Return Home</span>
        <span className="voyara-arrow-circle">→</span>
      </Link>
    </div>
  );
}

