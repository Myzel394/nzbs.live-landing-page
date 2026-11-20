import type { Metadata } from "next";
import "./globals.css";

// Placeholder metadata; step 1 adds fonts, canonical URL, Open Graph, Nav and Footer.
export const metadata: Metadata = {
  title: "nzbs.live: uptime monitoring for your NZBs",
  description:
    "nzbs.live checks every article of your NZBs on the 1st of every month and tells you which are gone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
