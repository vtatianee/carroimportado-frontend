import type { SpecialtyColor } from "../contracts";

/**
 * Converte as classes Tailwind usadas nos badges de especialidade em hex.
 *
 * Por que derivar em vez de manter um segundo mapa: as classes em
 * app/data/empresas.ts e app/data/pecas.ts continuam sendo a fonte única. Um
 * mapa paralelo de hex sairia de sincronia na primeira vez que alguém mudasse
 * uma cor — que é exatamente a classe de bug que a Fase A passou consertando.
 *
 * O app não consegue usar "bg-blue-100": React Native não tem Tailwind.
 */

// Paleta padrão do Tailwind, apenas os tons -100 e -700 que os badges usam.
const TAILWIND: Record<string, { "100": string; "700": string }> = {
  slate:  { "100": "#f1f5f9", "700": "#334155" },
  red:    { "100": "#fee2e2", "700": "#b91c1c" },
  orange: { "100": "#ffedd5", "700": "#c2410c" },
  amber:  { "100": "#fef3c7", "700": "#b45309" },
  yellow: { "100": "#fef9c3", "700": "#a16207" },
  green:  { "100": "#dcfce7", "700": "#15803d" },
  teal:   { "100": "#ccfbf1", "700": "#0f766e" },
  cyan:   { "100": "#cffafe", "700": "#0e7490" },
  blue:   { "100": "#dbeafe", "700": "#1d4ed8" },
  purple: { "100": "#f3e8ff", "700": "#7e22ce" },
};

const FALLBACK: SpecialtyColor = { bg: "#f1f5f9", fg: "#334155" }; // slate

/** "bg-blue-100 text-blue-700" -> { bg: "#dbeafe", fg: "#1d4ed8" } */
export function tailwindBadgeToHex(classes: string): SpecialtyColor {
  const bgMatch = /bg-([a-z]+)-(\d{3})/.exec(classes);
  const fgMatch = /text-([a-z]+)-(\d{3})/.exec(classes);

  const bg = bgMatch && TAILWIND[bgMatch[1]]?.[bgMatch[2] as "100" | "700"];
  const fg = fgMatch && TAILWIND[fgMatch[1]]?.[fgMatch[2] as "100" | "700"];

  if (!bg || !fg) return FALLBACK;
  return { bg, fg };
}

/** Converte o mapa inteiro de especialidade -> classes em especialidade -> hex */
export function coresToHex(cores: Record<string, string>): Record<string, SpecialtyColor> {
  return Object.fromEntries(
    Object.entries(cores).map(([nome, classes]) => [nome, tailwindBadgeToHex(classes)])
  );
}
