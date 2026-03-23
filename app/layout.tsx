import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./bootstrap-grid.css";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lvetica.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lvetica — Influencer Marketing & Content Studio",
    template: "%s | Lvetica",
  },
  description: "Lvetica is a full-service influencer marketing and content studio. We connect brands with creators, produce UGC, and manage social media growth.",
  keywords: ["influencer marketing", "UGC production", "content strategy", "social media management", "brand partnerships"],
  openGraph: {
    type: "website",
    siteName: "Lvetica",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css"
        />
      </head>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
