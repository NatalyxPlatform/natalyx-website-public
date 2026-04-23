import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Natalyx — The All-in-One Online Fertility Agency",
  description:
    "Natalyx helps people learn about, contribute to, and pursue starting a family through fertility care, surrogacy, donation, and trusted support.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://natalyx.health"
  ),
  icons: {
    icon: "/stork_icon.svg",
    apple: "/stork_icon.png",
  },
  openGraph: {
    title: "Natalyx — The All-in-One Online Fertility Agency",
    description:
      "Register interest in Natalyx for fertility care, surrogacy, donation, and trusted support.",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natalyx — The All-in-One Online Fertility Agency",
    description:
      "Register interest in Natalyx for fertility care, surrogacy, donation, and trusted support.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-navy focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pt-[72px] md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
