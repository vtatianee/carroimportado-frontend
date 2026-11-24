// Server Component wrapper — injeta o JSON-LD no <head> apenas na homepage
import { JsonLd } from "./components/JsonLd";
import HomeClient from "./_HomeClient";
import UltimasNoticias from "./components/UltimasNoticias";
import { ENVIA_PARA_QUALQUER_UM } from "./lib/email";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      {/* "Receber meu cálculo por e-mail" só aparece com domínio verificado na
          Resend (RESEND_FROM): com o remetente de teste, o e-mail não chegaria. */}
      <HomeClient ultimasNoticias={<UltimasNoticias />} envioCalculoPorEmail={ENVIA_PARA_QUALQUER_UM} />
    </>
  );
}
