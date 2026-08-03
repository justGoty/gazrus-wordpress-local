import type { Metadata } from "next";
import { Golos_Text, Manrope } from "next/font/google";
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
  metadataBase: new URL("https://xn--80aaaalzch0asjh0a0a.xn--p1acf"),
  title: {
    default: "Газоанализатор.рус — подбор промышленных газоанализаторов",
    template: "%s | Газоанализатор.рус",
  },
  description:
    "Стационарные и портативные газоанализаторы, сенсоры и инженерный подбор оборудования с запросом коммерческого предложения.",
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
