// FONTS
import { inter, oswald, robotoSlab, tourney } from "@/lib/fonts";

// TYPES
import type { Metadata } from "next";

// CONTEXT
import { WaiterProvider } from "@/contexts/WaiterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileProvider } from "@/contexts/MobileContext";

// ANALYTICS
import { Analytics } from "@vercel/analytics/next";

// COMPONENTS
import Footer from "@/components/Footer";

// PROVIDERS
import SessionProvider from "@/components/SessionProvider";

// STYLES
import "@/styles/global.css";
import styles from "./layout.module.css";
import { PopupProvider } from "@/contexts/PopupContext";

export const metadata: Metadata = {
  title: "GainsDB",
  description: "Track your workouts efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/webmanifest.json" />
      </head>
      <body
        className={`${styles.LandingBody} ${robotoSlab.variable} ${tourney.variable} ${oswald.variable} ${inter.className} antialiased relative`}
      >
        <MobileProvider>
          <SessionProvider>
            <AuthProvider>
              <PopupProvider>
                <WaiterProvider>{children}</WaiterProvider>
              </PopupProvider>
              <Analytics />
              <Footer />
            </AuthProvider>
          </SessionProvider>
        </MobileProvider>
      </body>
    </html>
  );
}
