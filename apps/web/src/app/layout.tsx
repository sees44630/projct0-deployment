import type { Metadata } from "next";
import { Outfit, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import ClientProviders from "./providers";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-stats",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "OtakuLoot — Level Up Your Collection",
  description:
    "The ultimate anime RPG shopping experience. Explore rare figures, apparel, and collectibles. Add to cart? No — you LOOT it.",
  keywords: ["anime", "figures", "merch", "otaku", "RPG", "shop", "collectibles"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} ${orbitron.variable} antialiased bg-void-black text-text-primary`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
