import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { company, siteUrl } from "@/lib/brand";
import "./globals.css";

// Condensed italic headings echo the forward slant of the wordmark. Both
// fonts are downloaded at build time and served from this site.
const heading = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: company.legalName,
    template: `%s | ${company.legalName}`,
  },
  description: company.description,
  openGraph: {
    siteName: company.legalName,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1010" },
  ],
};

// Applies a saved theme before the first paint so there is no flash.
// No saved theme means the CSS follows the system setting.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
