import Link from "next/link";

/** Chamada para o jogo /jogo na página inicial, logo depois da calculadora. */
export default function ChamadaJogo() {
  return (
    <Link
      href="/jogo"
      className="group flex items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm hover:border-amber-300 hover:shadow transition"
    >
      <span className="text-4xl shrink-0" aria-hidden="true">
        🗺️
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-slate-900">Adivinhe o Preço: o jogo</span>
        <span className="block text-sm text-slate-600 mt-0.5">
          Carros reais à venda nos EUA. Chute o preço em dólar e veja quanto você acerta. Um desafio novo por dia.
        </span>
        {/* No celular o texto ocupa a largura toda: a ação vai embaixo, não ao lado. */}
        <span className="sm:hidden block mt-1.5 text-sm font-semibold text-amber-800">Jogar agora →</span>
      </span>
      <span className="shrink-0 hidden sm:inline-block text-sm font-semibold text-amber-800 group-hover:translate-x-0.5 transition-transform">
        Jogar agora →
      </span>
    </Link>
  );
}
