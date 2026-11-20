import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SITE_URL } from "@/config";
import "./tokens.css";
import "./globals.css";

// Self-hosted at build time; the browser never contacts Google. Only the weight axis is loaded,
// as in the approved mockup (Bricolage's optical size stays at its default).
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const title = "nzbs.live: uptime monitoring for your NZBs";
const description =
  "nzbs.live checks every article in your NZBs on the 1st of every month and tells you which ones are gone.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "nzbs.live",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "nzbs.live", title, description, locale: "en" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0a0d12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
