import { z } from "zod";

/**
 * Envelope uniforme de todas as respostas do content API (/api/content/v1/*).
 *
 * Existe para que o app iOS possa cachear e checar versão genericamente, sem
 * um caso especial por endpoint: ele lê `v` para saber se entende o formato e
 * `updatedAt` para decidir se o cache local ainda serve.
 */
export const CONTENT_VERSION = 1;

export function envelopeOf<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    v: z.literal(CONTENT_VERSION),
    updatedAt: z.string(),
    data: dataSchema,
  });
}

export type Envelope<T> = {
  v: typeof CONTENT_VERSION;
  updatedAt: string;
  data: T;
};
