import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./bootstrap-grid.css";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lvetica — Creative Studio",
  description: "We are a creative studio focused on designing a better world today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
