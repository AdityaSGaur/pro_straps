import type { Metadata } from "next";
import { Dongle, Baloo_Bhaina_2 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/shared/cart-drawer";
import { SearchDialog } from "@/components/shared/search-dialog";
import { SessionProvider } from "@/components/providers/session-provider";



const dongle = Dongle({
  variable: "--font-dongle",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const baloo = Baloo_Bhaina_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prostraps.com"),
  title: {
    default: "Pro Straps — Premium Watch Straps & Smartwatch Bands",
    template: "Pro Straps | %s",
  },
  description:
    "Pro Straps — Discover premium handcrafted watch straps, luxury leather bands, FKM silicone, titanium, and stainless steel mesh loops. Compatible with Apple Watch, Galaxy Watch, Garmin, and luxury timepieces.",
  keywords: [
    "Pro Straps",
    "pro_straps",
    "pro straps",
    "Pro Straps official",
    "pro_straps official",
    "Pro Straps India",
    "pro_straps india",
    "Pro Straps watch bands",
    "pro_straps watch bands",
    "watch straps",
    "premium watch straps",
    "Apple Watch bands",
    "leather watch strap",
    "silicone watch band",
    "titanium watch band",
    "milanese loop",
    "NATO strap",
    "luxury watch accessories",
    "smartwatch bands",
    "Aditya Gaur",
  ],
  authors: [{ name: "Aditya Gaur" }],
  creator: "Aditya Gaur",
  publisher: "Pro Straps",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Pro Straps — Premium Watch Straps & Smartwatch Bands",
    description:
      "Pro Straps — Premium handcrafted watch straps for every wrist. Leather, silicone, metal, NATO, and smartwatch bands.",
    url: "https://prostraps.com",
    siteName: "Pro Straps",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/docs/planning/brand/logo_dark.png",
        width: 1200,
        height: 630,
        alt: "Pro Straps official logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Straps — Premium Watch Straps & Smartwatch Bands",
    description:
      "Pro Straps — Premium handcrafted watch straps for every wrist. Leather, silicone, metal, NATO, and smartwatch bands.",
    site: "@prostraps",
    creator: "@adityagaur",
    images: ["/docs/planning/brand/logo_dark.png"],
  },
  icons: {
    icon: [
      { url: "/docs/planning/brand/favicon.ico" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/docs/planning/brand/favicon.ico",
    apple: "/docs/planning/brand/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dongle.variable} ${baloo.variable} antialiased bg-background text-foreground font-sans`}
        style={{ fontFamily: "var(--font-baloo), sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <SearchDialog />
            <main className="min-h-[calc(100vh-80px)]">{children}</main>
            <Footer />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}