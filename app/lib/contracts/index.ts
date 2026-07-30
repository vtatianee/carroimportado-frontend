/**
 * Contratos compartilhados entre o site e o app iOS.
 *
 * Este diretório é a FONTE canônica. O repo do app mantém uma cópia vendorizada
 * em src/api/contracts/, sincronizada por script, e um `npm run check:contracts`
 * que falha se as duas divergirem. Não editar a cópia.
 *
 * Nada aqui pode importar React, Next, Tailwind ou tocar em DOM — o app não
 * tem nenhum dos três.
 */
export * from "./envelope";
export * from "./blog";
export * from "./directory";
export * from "./guia";
export * from "./config";
export * from "./calc";
