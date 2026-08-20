import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_DESCRIPTION,
  buildStructuredData,
} from "@/lib/positioning";

/**
 * Every string here comes from `@/lib/positioning`. The page description, the
 * OG card, the Twitter card and the JSON-LD graph must describe the same
 * product the page shows; defining any of them inline is how they drift apart.
 */
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/stork_icon.svg",
    apple: "/stork_icon.png",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/**
 * `<` is escaped so a future description containing markup could not close
 * this script tag. Everything here is static and repository-authored - no
 * request value reaches it - but the escape costs nothing and removes the
 * question.
 */
const structuredData = JSON.stringify(buildStructuredData(SITE_URL)).replace(
  /</g,
  "\\u003c"
);

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
        {/* One family for the whole site: headings and body copy differ by
            size, weight and colour, never by typeface. */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
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
