import { z } from "zod";

/**
 * Contrato dos diretórios de empresas e fornecedores de peças.
 *
 * `Empresa` e `Peca` têm exatamente o mesmo shape hoje (app/data/empresas.ts e
 * app/data/pecas.ts) — por isso um schema só, com alias de tipo para cada uso.
 * Se divergirem no futuro, separar aqui.
 *
 * Nota sobre cores: no site as especialidades viram classes Tailwind
 * ("bg-blue-100 text-blue-700"), que não significam nada em React Native. A API
 * emite hex; o site ignora esse campo e continua usando suas classes.
 */

export const DirectoryEntrySchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  pais: z.enum(["US", "BR"]),
  estado: z.string(),
  cidade: z.string(),
  especialidades: z.array(z.string()),
  rating: z.number().nullable(),
  reviews: z.number().int().nullable(),
  reviewSource: z.string().optional(),
  website: z.string().nullable(),
  whatsapp: z.string().nullable(),
  email: z.string().nullable(),
  descricao: z.string(),
  destaque: z.boolean().optional(),
});

export const SpecialtyColorSchema = z.object({
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const CategoriaRfqSchema = z.object({
  id: z.string(),
  label: z.string(),
  especialidades: z.array(z.string()),
});

export const EmpresasPayloadSchema = z.object({
  empresas: z.array(DirectoryEntrySchema),
  categorias: z.array(CategoriaRfqSchema),
  especialidadeCores: z.record(z.string(), SpecialtyColorSchema),
});

export const PecasPayloadSchema = z.object({
  pecas: z.array(DirectoryEntrySchema),
  especialidadeCores: z.record(z.string(), SpecialtyColorSchema),
});

export type DirectoryEntry = z.infer<typeof DirectoryEntrySchema>;
export type Empresa = DirectoryEntry;
export type Peca = DirectoryEntry;
export type SpecialtyColor = z.infer<typeof SpecialtyColorSchema>;
export type CategoriaRfq = z.infer<typeof CategoriaRfqSchema>;
export type EmpresasPayload = z.infer<typeof EmpresasPayloadSchema>;
export type PecasPayload = z.infer<typeof PecasPayloadSchema>;
