import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const geist = Geist({ subsets: ["latin"] });

const SITE_URL = "https://www.carroimportado.com";
const SITE_NAME = "Carro Importado";
const TITLE = "Calculadora de Importação de Carros dos EUA para o Brasil | II, IPI, ICMS";
const DESCRIPTION =
  "Calcule o custo real de importar um carro dos Estados Unidos para o Brasil. Cole o link do anúncio do Cars.com e veja todos os impostos detalhados: II, IPI, PIS, COFINS e ICMS por estado.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "importar carro dos EUA",
    "calculadora importação veículos",
    "quanto custa importar carro brasil",
    "imposto importar carro eua brasil",
    "importar carro clássico americano",
    "II IPI ICMS importação veículo",
    "carro importado dos estados unidos",
    "como importar carro dos EUA",
    "valor aduaneiro CIF importação veículo",
    "ICMS importação carro por estado",
    "despachante aduaneiro importação carro",
    "calculadora imposto importação carro EUA",
    "custo frete marítimo carro EUA Brasil",
    "importar carro clássico 30 anos brasil",
  ],
  authors: [{ name: "Tatiane Assink" }],
  creator: "carroimportado.com",
  alternates: {
    canonical: SITE_URL + "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "pt_BR",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Calculadora de importação de carros dos EUA para o Brasil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "66BvD9MJYMgo0TCAWnHIethxLbQK8SZXohMAA66xS5c",
  },
  other: {
    "google-adsense-account": "ca-pub-8694151594129435",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.className} h-full`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8694151594129435"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
