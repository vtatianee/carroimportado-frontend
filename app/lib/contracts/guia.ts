import { z } from "zod";

/**
 * Contrato do guia de importação: as 8 etapas, o resumo de custos e o
 * checklist interativo. Espelha app/data/guia.ts.
 *
 * `color` é um token neutro ("blue", "green"...), não uma classe Tailwind —
 * cada plataforma mapeia como quiser. Já `CostSummaryItem.color` ainda carrega
 * classe Tailwind por vir do site; o app deve ignorar esse campo.
 */

export const GuiaStepSchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  duration: z.string(),
  color: z.string(),
  icon: z.string(),
  description: z.string(),
  actions: z.array(z.string()),
  warning: z.string().optional(),
  tip: z.string().optional(),
  documents: z.array(z.string()),
});

export const CostSummaryItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  color: z.string(),
});

export const CheckItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  note: z.string().optional(),
});

export const CheckGroupSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  items: z.array(CheckItemSchema),
});

export const GuiaPayloadSchema = z.object({
  steps: z.array(GuiaStepSchema),
  costsSummary: z.array(CostSummaryItemSchema),
  checklist: z.array(CheckGroupSchema),
  // Chave do localStorage/MMKV, para que app e site possam convergir depois
  checklistStorageKey: z.string(),
});

export type GuiaStep = z.infer<typeof GuiaStepSchema>;
export type CostSummaryItem = z.infer<typeof CostSummaryItemSchema>;
export type CheckItem = z.infer<typeof CheckItemSchema>;
export type CheckGroup = z.infer<typeof CheckGroupSchema>;
export type GuiaPayload = z.infer<typeof GuiaPayloadSchema>;
