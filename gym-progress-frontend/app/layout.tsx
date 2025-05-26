/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import ClientLoader from "../components/ClientLoader";
import Footer from "../components/Footer";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import { FooterProvider } from "@/contexts/FooterContext";

// import { Analytics } from "@vercel/analytics/react"

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

export const metadata = {
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
      </head>
      <body className={`${inter.className} antialiased relative`}>
        <AuthProvider >
          <FooterProvider>
            <ClientLoader>{children}</ClientLoader>
            <Footer />
          </FooterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
