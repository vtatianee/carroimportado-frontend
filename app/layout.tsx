import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carro Importado — Calcule o custo de importar um carro dos EUA",
  description:
    "Cole o link do anúncio e descubra quanto vai custar importar o carro para o Brasil, com todos os impostos detalhados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.className} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
