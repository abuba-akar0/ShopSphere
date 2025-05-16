// src/app/layout.tsx
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Import the Header component
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext'; // Import CartProvider
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import { Toaster } from '@/components/ui/toaster'; // Import Toaster for notifications

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopSphere',
  description: 'Ultimate Shopping Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
         <AuthProvider> {/* Wrap with AuthProvider */}
          <CartProvider> {/* Wrap with CartProvider */}
            <Header />
              <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster /> {/* Add Toaster here for app-wide notifications */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
