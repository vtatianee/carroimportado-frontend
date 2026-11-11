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
      {/* <script async src> é "recurso" para o React 19: ele sobe a tag para o
          <head> e não a hidrata, então pode ficar aqui. */}
      <head>
        <script async src={`https://fundingchoicesmessages.google.com/i/${ADSENSE_PUB}?ers=1`} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* <script> comum, não next/script: o next/script injeta a tag pelo
            JavaScript do cliente, e a revisão do AdSense procura a tag no HTML
            servido. A ordem importa: a configuração (pausa + não personalizado)
            precisa rodar antes do adsbygoogle.js. Por isso `defer` em vez do
            `async` do snippet do Google: o React 19 sobe toda <script async src>
            para o topo do <head>, ACIMA do script inline, e ela poderia pedir
            anúncio antes da pausa. `defer` fica no lugar e roda depois do parse,
            sem bloquear a renderização. Ver lib/anuncios.ts.

            Ficam no começo do <body>, e NÃO no <head>, por causa da hidratação.
            O adsbygoogle.js insere o próprio <script src=".../show_ads_impl...">
            antes do primeiro <script> do documento, que está sempre no <head>, e
            sem o atributo `async`. Ao hidratar o <head>, o React casa cada
            <script> nosso com o próximo <script> que encontra e só pula os que
            têm `src` + `async`. O script injetado tomava o lugar do primeiro,
            todos os seguintes andavam uma posição, e a página inteira dava
            "Minified React error #418" (HTML não bate) em todo carregamento.
            Aqui no <body> nada injeta <script> antes deles. Executam na mesma
            ordem de antes: inline durante o parse, `defer` depois dele.
            suppressHydrationWarning: o adsbygoogle.js marca a própria tag com
            data-checked-head="true" antes da hidratação (só atributo; sem ele o
            dev acusa diferença a cada carregamento). */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CONFIG_ANUNCIOS }} />
        <script
          suppressHydrationWarning
          defer
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_SINAL_FUNDING_CHOICES }} />
        {children}
        {/* Vercel Analytics não usa cookie e produz só estatística agregada,
            sem identificar o visitante — não exige aviso de consentimento. */}
        <Analytics />
        <AvisoCookies />
      </body>
    </html>
  );
}
