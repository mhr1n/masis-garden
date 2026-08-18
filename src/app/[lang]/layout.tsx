import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from "../../i18n-config";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Masis Garden",
  description: "Premium indoor plants, beautiful pots, and living moss art in Armenia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Providers } from "../../components/Providers";
import { getDictionary } from "../../get-dictionary";
import CartDrawer from "../../components/CartDrawer";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${outfit.variable}`}>
      <body>
        <Providers>
          <Header lang={lang as Locale} dict={dict} />
          <CartDrawer dict={dict} />
          <main>{children}</main>
          <Footer lang={lang as Locale} />
        </Providers>
      </body>
    </html>
  );
}
