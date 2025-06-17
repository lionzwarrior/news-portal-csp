import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#282c34', color: 'white' }}>
      <h1 style={{ display: 'inline-block', marginRight: '2rem' }}>NewsPortal</h1>
      <Link href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      <Link href="/admin" style={{ color: 'white', marginRight: '1rem' }}>Admin</Link>
      <Link href="/bookmarks" style={{ color: 'white', marginRight: '2rem' }}>Bookmark</Link>
    </nav>
  );
}
