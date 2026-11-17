import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://travelyn-nu.vercel.app'),
  title: {
    default: 'Travelyn | Tailor-Made Luxury Travel & Journeys',
    template: '%s | Travelyn',
  },
  description: "Handpicked journeys to the world's most extraordinary places, designed by real travel experts. Tailor-made itineraries, boutique stays, and slow travel across the globe.",
  applicationName: 'Travelyn',
  authors: [{ name: 'Travelyn Luxury Studio' }],
  keywords: [
    'Travelyn',
    'luxury travel',
    'bespoke journeys',
    'tailor-made travel',
    'boutique hotels',
    'slow travel',
    'Swiss Alps',
    'Kyoto',
    'Amalfi Coast',
    'Santorini',
    'Patagonia',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://travelyn-nu.vercel.app',
    siteName: 'Travelyn',
    title: 'Travelyn | Tailor-Made Luxury Travel & Journeys',
    description: "Handpicked journeys to the world's most extraordinary places, designed by real travel experts. Tailor-made itineraries, boutique stays, and slow travel across the globe.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Travelyn — Bespoke Luxury Journeys',
        type: 'image/png',
      },
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Travelyn — Bespoke Luxury Journeys',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travelyn | Tailor-Made Luxury Travel & Journeys',
    description: "Handpicked journeys to the world's most extraordinary places, designed by real travel experts.",
    images: ['/og-image.png'],
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

