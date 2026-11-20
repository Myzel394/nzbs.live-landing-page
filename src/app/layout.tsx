import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import "./globals.css";

// Fonts, canonical URL and Open Graph arrive in step 1.
export const metadata: Metadata = {
  title: "nzbs.live: uptime monitoring for your NZBs",
  description:
    "nzbs.live checks every article in your NZBs on the 1st of every month and tells you which ones are gone.",
};

export const viewport: Viewport = {
  themeColor: "#0a0d12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a href="#main">Skip to content</a>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
