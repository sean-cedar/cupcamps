import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Noto_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LiveScoresProvider } from "@/components/live/LiveScoresProvider";
import { HapticProvider } from "@/components/feedback/HapticProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const barlow = Barlow_Condensed({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: {
    default: "CupCamps — FIFA World Cup 26™ Base Camps",
    template: "%s | CupCamps",
  },
  description:
    "Explore where all 48 nations are training and staying during the FIFA World Cup 26™ across the USA, Mexico, and Canada.",
  openGraph: {
    title: "CupCamps — FIFA World Cup 26™ Base Camps",
    description:
      "Interactive guide to all 48 FIFA World Cup 26™ team base camps, host cities, and group-stage venues.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${noto.variable} h-full`} suppressHydrationWarning>
      <body className="wc26-bg flex min-h-full flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HapticProvider>
            <LiveScoresProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </LiveScoresProvider>
          </HapticProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
