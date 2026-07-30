import { z } from "zod";

/**
 * Config remoto do app. Não é CMS — é um objeto editado à mão em
 * app/data/app-config.ts e servido com cache de 60s.
 *
 * A razão de existir: sem isso, qualquer ajuste de comportamento do app exige
 * build novo e revisão da Apple. Com isso, `adsEnabled: false` desliga os
 * anúncios em ~1 minuto — o que é o freio de emergência se a revisão da Apple
 * questionar o comportamento de publicidade.
 */

const SemVer = z.string().regex(/^\d+\.\d+\.\d+$/, "Use semver: 1.2.3");

export const AppVersionGateSchema = z.object({
  ios: SemVer,
});

export const FeatureFlagsSchema = z.object({
  adsEnabled: z.boolean(),
  interstitialsEnabled: z.boolean(),
  interstitialEveryNCalcs: z.number().int().min(1),
  /** Nunca mostrar intersticial antes deste número de cálculos na vida do app */
  interstitialMinCalcs: z.number().int().min(1),
  reverseCalcMode: z.enum(["server", "client"]),
  searchTabEnabled: z.boolean(),
  rfqEnabled: z.boolean(),
});

export const AnnouncementSchema = z.object({
  id: z.string(),
  level: z.enum(["info", "warn"]),
  title: z.string(),
  body: z.string(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url().optional(),
  expiresAt: z.string().optional(),
});

export const AppConfigSchema = z.object({
  /** Abaixo desta versão o app mostra tela bloqueante pedindo atualização */
  minSupportedVersion: AppVersionGateSchema,
  /** Abaixo desta o app apenas sugere atualizar */
  recommendedVersion: AppVersionGateSchema,
  flags: FeatureFlagsSchema,
  announcement: AnnouncementSchema.nullable(),
  defaults: z.object({
    freteUsd: z.number().positive(),
    fallbackUsdBrl: z.number().positive(),
    estado: z.enum(["SP", "RJ", "MG", "SC", "RS", "PR", "OTHER"]),
  }),
  urls: z.object({
    privacy: z.string().url(),
    terms: z.string().url(),
    support: z.string(),
    site: z.string().url(),
  }),
});

export const ManifestCollectionSchema = z.object({
  etag: z.string(),
  count: z.number().int().nonnegative(),
  updatedAt: z.string(),
});

export const ManifestSchema = z.object({
  buildId: z.string(),
  collections: z.record(z.string(), ManifestCollectionSchema),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;
export type ManifestCollection = z.infer<typeof ManifestCollectionSchema>;
