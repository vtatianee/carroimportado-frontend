import type { BlogPost as ApiBlogPost } from "../contracts";
import type { BlogPost as SiteBlogPost } from "../blog";

/**
 * Converte o post como o site o guarda para o formato que a API entrega.
 *
 * A única diferença é resolução de URL: o site serve `/blog/foo.jpg` e o
 * browser resolve contra a origem. O app não tem origem — precisa de URL
 * absoluta, tanto para a capa quanto para o link de compartilhamento.
 */

export const SITE_URL = "https://www.carroimportado.com";

export function absolutize(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function toApiPost(post: SiteBlogPost): ApiBlogPost {
  return {
    ...post,
    coverImage: post.coverImage ? absolutize(post.coverImage) : undefined,
    webUrl: `${SITE_URL}/blog/${post.slug}`,
  };
}
