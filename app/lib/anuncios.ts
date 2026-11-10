/**
 * Google AdSense + consentimento.
 *
 * Quem pede consentimento para quem:
 *  - EEE, Reino Unido e Suíça: a mensagem do Google (Privacy & messaging,
 *    antigo Funding Choices), um CMP certificado no TCF. Ela é configurada no
 *    painel do AdSense; o código aqui só detecta que ela se aplica
 *    (`gdprApplies`) e sai do caminho.
 *  - Todo o resto, Brasil incluído: o nosso aviso (AvisoCookies). O Google não
 *    oferece mensagem para a LGPD ("you can't create LGPD messages in Privacy &
 *    messaging") e, sem sinal de consentimento, o AdSense serve anúncio
 *    PERSONALIZADO por padrão. Sem este aviso, a política de privacidade
 *    (seção 8: personalizado = consentimento, coletado no aviso de cookies)
 *    seria falsa justamente para o nosso público.
 *
 * Regra fora do EEE: anúncio NÃO personalizado (base: legítimo interesse,
 * seção 8 da política) até a pessoa clicar em "Aceitar". Recusar ou ignorar o
 * aviso mantém o não personalizado.
 *
 * Mecânica (support.google.com/adsense/answer/7670312): `pauseAdRequests=1`
 * antes do adsbygoogle.js carregar segura qualquer pedido de anúncio até
 * sabermos a região; `requestNonPersonalizedAds` decide o tipo; e
 * `pauseAdRequests=0` libera. Tudo precisa rodar ANTES do adsbygoogle.js, por
 * isso é um <script> inline no <head>, não um componente React.
 */

export const ADSENSE_CLIENT = "ca-pub-8694151594129435";
export const ADSENSE_PUB = "pub-8694151594129435";

export const CHAVE_CONSENTIMENTO = "consentimento_anuncios";
export type Consentimento = "aceito" | "recusado";

/** Disparado quando a região fica conhecida: detail = { gdpr: boolean }. */
export const EVENTO_REGIAO = "anuncios:regiao";
/** Disparado pelo botão "Preferências de cookies" para reabrir a escolha. */
export const EVENTO_PREFERENCIAS = "anuncios:preferencias";

/** Se a mensagem do Google não responder nesse tempo, tratamos como fora do EEE. */
const ESPERA_CMP_MS = 2500;

export const SCRIPT_CONFIG_ANUNCIOS = `
(function () {
  // Sempre window.adsbygoogle "atual": quando o adsbygoogle.js carrega, ele
  // troca o array por um objeto dele, e uma referência guardada aqui ficaria
  // velha (o pauseAdRequests=0 iria para o lugar errado e nenhum anúncio sairia).
  function ads() { return (window.adsbygoogle = window.adsbygoogle || []); }
  ads().pauseAdRequests = 1;
  var decidido = false;
  function escolha() {
    try { return localStorage.getItem(${JSON.stringify(CHAVE_CONSENTIMENTO)}); } catch (e) { return null; }
  }
  function liberar(gdpr) {
    if (decidido) return;
    decidido = true;
    window.__anunciosGdpr = gdpr;
    // No EEE quem decide é o sinal TCF da mensagem do Google.
    ads().requestNonPersonalizedAds = gdpr || escolha() === "aceito" ? 0 : 1;
    ads().pauseAdRequests = 0;
    window.dispatchEvent(new CustomEvent(${JSON.stringify(EVENTO_REGIAO)}, { detail: { gdpr: gdpr } }));
  }
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: function () {
      window.__tcfapi("addEventListener", 2.2, function (dados, ok) {
        if (ok && dados) liberar(!!dados.gdprApplies);
      });
    },
  });
  setTimeout(function () { liberar(false); }, ${ESPERA_CMP_MS});
})();
`;

/** Snippet do Privacy & messaging: avisa ao Google que a tag está presente. */
export const SCRIPT_SINAL_FUNDING_CHOICES = `(function(){function signalGooglefcPresent(){if(!window.frames['googlefcPresent']){if(document.body){var iframe=document.createElement('iframe');iframe.style='width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';iframe.style.display='none';iframe.name='googlefcPresent';document.body.appendChild(iframe);}else{setTimeout(signalGooglefcPresent,0);}}}signalGooglefcPresent();})();`;
