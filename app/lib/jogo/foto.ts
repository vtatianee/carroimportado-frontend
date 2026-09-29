// Todo carro do jogo aparece com imagem: a foto do anúncio ou, na falta
// dela, esta silhueta genérica. Arquivo local, então não depende de host
// externo nem pode falhar pelo mesmo motivo que a foto original.
export const FOTO_PLACEHOLDER = "/jogo/carro-placeholder.svg";

// Extensões que com certeza não são imagem. Fotos de CDN de anúncio muitas
// vezes não têm extensão nenhuma, por isso não dá para exigir .jpg/.png.
const NAO_IMAGEM = /\.(html?|php|aspx?|json|xml|txt|pdf|js|css|mp4|webm|mov)$/i;

/**
 * Checagem mínima de que `url` pode ser usada como foto em hotlink: https (ou
 * um arquivo local do site), sem data:/javascript: e sem cara de página.
 * Carro sem foto que passe aqui fica fora do jogo.
 *
 * Isto só olha a URL. Quem importa anúncios de fora deve, além disso,
 * confirmar com uma requisição que o host responde com `Content-Type: image/*`.
 */
export function fotoUtilizavel(url: unknown): url is string {
  if (typeof url !== "string" || url.trim() === "") return false;
  if (url.startsWith("/") && !url.startsWith("//")) return !NAO_IMAGEM.test(url);
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname !== "" && !NAO_IMAGEM.test(u.pathname);
  } catch {
    return false;
  }
}
