import type { Metadata } from "next";
import { Golos_Text, Manrope } from "next/font/google";
import { seoSite } from "@/lib/seo/content";
import "./globals.css";

const headingFont = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-heading",
  display: "swap",
});

const textFont = Golos_Text({
  subsets: ["cyrillic", "latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoSite.origin),
  title: {
    default: seoSite.defaultTitle,
    template: seoSite.titleTemplate,
  },
  description: seoSite.defaultDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${headingFont.variable} ${textFont.variable}`}>{children}</body>
    </html>
  );
}
