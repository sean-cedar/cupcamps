import type { Metadata } from "next";
import { Bebas_Neue, Noto_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: {
    default: "CupCamps — World Cup 2026 Team Base Camps",
    template: "%s | CupCamps",
  },
  description:
    "Explore where all 48 nations are training and staying during the FIFA World Cup 2026 across the USA, Mexico, and Canada.",
  openGraph: {
    title: "CupCamps — World Cup 2026 Team Base Camps",
    description:
      "Interactive guide to all 48 FIFA World Cup 2026 team base camps, host cities, and group-stage venues.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${noto.variable} h-full`}>
      <body className="grid-26-bg flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
