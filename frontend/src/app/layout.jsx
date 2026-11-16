import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Travelyn | Tailor-Made Luxury Travel & Journeys',
  description: "Handpicked journeys to the world's most extraordinary places, designed by real travel experts. Search trips by date and plan your next escape.",
  openGraph: {
    title: 'Travelyn | Tailor-Made Luxury Travel & Journeys',
    description: "Handpicked journeys to the world's most extraordinary places, designed by real travel experts.",
    type: 'website',
    images: ['https://framerusercontent.com/images/gjP22E1figlGx4hfv5qEKoJpa4A.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

