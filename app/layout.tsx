
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar/Navbar'
import { AuthProvider } from '../contexts/AuthContext'
import ScrollToTop from '../components/ScrollToTop'
import PWAManager from '../components/PWAManager'



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan-Eat - AI Meal Planning Assistant",
  description: "Your intelligent meal planning companion. Generate personalized weekly meal plans with AI, manage recipes, and create smart shopping lists based on your dietary preferences.",
  keywords: ["meal planning", "AI", "recipes", "diet", "nutrition", "cooking", "food", "shopping list"],
  authors: [{ name: "Plan-Eat Team" }],
  creator: "Plan-Eat",
  publisher: "Plan-Eat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Plan-Eat - AI Meal Planning Assistant',
    description: 'Your intelligent meal planning companion. Generate personalized weekly meal plans with AI.',
    siteName: 'Plan-Eat',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Plan-Eat Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plan-Eat - AI Meal Planning Assistant',
    description: 'Your intelligent meal planning companion. Generate personalized weekly meal plans with AI.',
    images: ['/icons/icon-512x512.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Plan-Eat',
    startupImage: [
      {
        url: '/icons/icon-192x192.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          {children}
          <PWAManager />
        </AuthProvider>
      </body>
    </html>
  );
}
