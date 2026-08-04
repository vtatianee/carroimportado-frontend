"use client";

import Script from "next/script";
import { useConsent } from "./ConsentContext";

const CLIENTE = "ca-pub-8694151594129435";

/**
 * Script do AdSense, carregado só depois do "aceito".
 *
 * Ficava no <head> do layout com `strategy="afterInteractive"`, o que o fazia
 * carregar em toda visita, antes de qualquer decisão do usuário. Aqui ele
 * simplesmente não entra na árvore enquanto não houver consentimento — o
 * navegador não chega a fazer a requisição, e nenhum cookie de publicidade é
 * gravado.
 *
 * A meta tag `google-adsense-account` continua no layout: ela só serve para o
 * Google verificar a propriedade do site, não carrega script nem grava cookie.
 */
export function AdSenseScript() {
  const { consentimento } = useConsent();

  if (consentimento !== "accepted") return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENTE}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
