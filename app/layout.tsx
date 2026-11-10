import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AvisoCookies from "./components/AvisoCookies";
import {
  ADSENSE_CLIENT,
  ADSENSE_PUB,
  SCRIPT_CONFIG_ANUNCIOS,
  SCRIPT_SINAL_FUNDING_CHOICES,
} from "./lib/anuncios";

const geist = Geist({ subsets: ["latin"] });

const SITE_URL = "https://www.carroimportado.com";
const SITE_NAME = "Carro Importado";
const TITLE = "Quanto Custa Importar um Carro dos EUA? Calculadora 2026";
const DESCRIPTION =
  "Simule em segundos quanto custa importar um carro dos EUA para o Brasil: II, IPI, PIS, COFINS, ICMS do seu estado, frete e despachante. Grátis.";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.className} h-full`}>
      {/* <script> comum, não next/script: o next/script injeta a tag pelo
          JavaScript do cliente, e a revisão do AdSense procura a tag no HTML
          servido. A ordem importa: a configuração (pausa + não personalizado)
          precisa rodar antes do adsbygoogle.js. Por isso `defer` em vez do
          `async` do snippet do Google: o React 19 sobe toda <script async src>
          para o topo do <head>, ACIMA do script inline, e ela poderia pedir
          anúncio antes da pausa. `defer` fica no lugar e roda depois do parse,
          sem bloquear a renderização. Ver lib/anuncios.ts. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CONFIG_ANUNCIOS }} />
        <script
          defer
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <script async src={`https://fundingchoicesmessages.google.com/i/${ADSENSE_PUB}?ers=1`} />
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_SINAL_FUNDING_CHOICES }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
        {/* Vercel Analytics não usa cookie e produz só estatística agregada,
            sem identificar o visitante — não exige aviso de consentimento. */}
        <Analytics />
        <AvisoCookies />
      </body>
    </html>
  );
}
