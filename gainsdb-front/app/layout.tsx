/* eslint-disable @typescript-eslint/no-unused-vars */

// STYLES
import "./globals.css";

// FONTS
import {
  Geist,
  Geist_Mono,
  Inter,
  Roboto,
  Oswald,
  Tourney
} from "next/font/google";

// TYPES
import type { Metadata } from "next";

// CONTEXT
import { FooterProvider } from "@/contexts/FooterContext";

// ANALYTICS
import { Analytics } from "@vercel/analytics/next"

// COMPONENTS
import ClientLoader from "../components/ClientLoader";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: "400"
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap"
});

const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "block",
});

const tourney = Tourney({
  variable: '--tourney',
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
  display: "block",
});


export const metadata: Metadata = {
  title: "GainsDB",
  description: "Track your workouts efficiently",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/webmanifest.json" />
        <link
          rel="preload"
          as="image"
          href="/bg5.webp"
          // optional hints:
          type="image/webp"
        // imagesizes="100vw"
        // imagesrcset="/images/dashboard-bg.webp 1920w, /images/dashboard-bg-2x.webp 3840w"
        />
      </head>
      <body className={`${tourney.variable} ${oswald.variable} ${inter.className} antialiased relative`}>
        <AuthProvider >
          <FooterProvider>
            <ClientLoader>
              {children}
            </ClientLoader>
            <Analytics />
            <Footer />
          </FooterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
