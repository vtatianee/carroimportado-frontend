import type { AppConfig } from "../lib/contracts";

/**
 * Config remoto do app iOS, servido por /api/content/v1/config com cache de 60s.
 *
 * Não é CMS: é um objeto editado à mão. A razão de existir é que sem ele
 * qualquer ajuste de comportamento exige build novo e revisão da Apple — que
 * leva dias. Com ele, `adsEnabled: false` desliga os anúncios em ~1 minuto.
 *
 * Ao editar, lembrar que o cache é de 60s: a mudança não é instantânea.
 */
export const APP_CONFIG: AppConfig = {
  // Abaixo desta versão o app mostra tela bloqueante pedindo atualização.
  // Só subir quando houver mudança incompatível de contrato.
  minSupportedVersion: { ios: "1.0.0" },
  // Abaixo desta o app apenas sugere atualizar, sem bloquear.
  recommendedVersion: { ios: "1.0.0" },

  flags: {
    // Freio de emergência: desliga toda a publicidade sem republicar o app.
    adsEnabled: true,
    interstitialsEnabled: true,
    // Máximo 1 intersticial a cada N cálculos.
    interstitialEveryNCalcs: 3,
    // E nunca antes do 4º cálculo na vida do app — o usuário precisa ter
    // recebido valor antes de ver tela cheia de anúncio.
    interstitialMinCalcs: 4,
    // "server" usa POST /api/reverse. O modo "client" não está implementado no
    // app de propósito: era a fórmula duplicada que divergia do backend.
    reverseCalcMode: "server",
    searchTabEnabled: true,
    // RFQ/Orçamento ficou fora do v1.
    rfqEnabled: false,
  },

  announcement: null,

  defaults: {
    freteUsd: 1500,
    // Só usado se o PTAX do BCB estiver fora do ar e o app estiver offline.
    fallbackUsdBrl: 5.45,
    estado: "SP",
  },

  urls: {
    privacy: "https://www.carroimportado.com/privacy",
    terms: "https://www.carroimportado.com/terms",
    support: "mailto:arche.boost@gmail.com",
    site: "https://www.carroimportado.com",
  },
};
