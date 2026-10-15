import Link from "next/link";
import AvisoEstimativa from "./AvisoEstimativa";

const B = "https://www.carroimportado.com";

interface Exemplo {
  carro: string;
  precoUsd: number;
  cambio: number;
  estado: string;
  totalBrl: number;
  impostosETaxasBrl: number;
  /** Impostos e taxas sobre o preço do carro, em %. */
  cargaPct: number;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const usd = (n: number) => `US$ ${n.toLocaleString("pt-BR")}`;

/**
 * Resposta direta à busca principal do site no Google ("quanto custa importar
 * um carro dos EUA"): pergunta como título e a resposta logo abaixo, no
 * formato que o Google usa em trechos em destaque e respostas de IA.
 *
 * Os números vêm do exemplo calculado da home (EXAMPLE_RESULT em
 * _HomeClient.tsx, saída real do backend), para os dois nunca divergirem.
 */
export default function QuantoCusta({ exemplo }: { exemplo: Exemplo }) {
  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
      aria-labelledby="quanto-custa"
    >
      <h2 id="quanto-custa" className="text-xl sm:text-2xl font-bold text-slate-900">
        Quanto custa importar um carro dos EUA para o Brasil?
      </h2>
      <p className="mt-3 text-slate-700 leading-relaxed">
        Depende do preço do carro, do ano, do frete e do estado onde ele vai ser registrado. Como referência: um{" "}
        {exemplo.carro} de {usd(exemplo.precoUsd)}, com dólar a R$ {exemplo.cambio.toLocaleString("pt-BR")} e destino{" "}
        {exemplo.estado}, tem custo total estimado de <strong>{brl(exemplo.totalBrl)}</strong>. Desse valor,{" "}
        <strong>{brl(exemplo.impostosETaxasBrl)}</strong> são impostos e taxas, cerca de{" "}
        {Math.round(exemplo.cargaPct)}% sobre o preço do carro. Dependendo do carro, essa carga pode passar de 100%.
      </p>

      <h3 className="mt-5 font-semibold text-slate-900">O que entra na conta</h3>
      <ul className="mt-2 space-y-1.5 text-slate-700 text-sm sm:text-base list-disc pl-5">
        <li>
          <strong>Imposto de Importação (II):</strong> 35% sobre o valor aduaneiro, que é o carro mais frete e seguro.
        </li>
        <li>
          <strong>IPI, PIS e COFINS</strong> de importação, calculados em cascata sobre esse valor.
        </li>
        <li>
          <strong>
            <Link href={`${B}/blog/icms-importacao-carro-por-estado-brasil-2026`} className="text-blue-600 hover:underline">
              ICMS
            </Link>
          </strong>{" "}
          do estado de destino, de 12% a 20%.
        </li>
        <li>
          <strong>Frete marítimo, seguro e desembaraço:</strong> despachante, AFRMM, capatazia e armazenagem.{" "}
          <Link href={`${B}/blog/custos-ocultos-importacao-carro-eua-brasil`} className="text-blue-600 hover:underline">
            Veja os custos que pouca gente calcula
          </Link>
          .
        </li>
      </ul>

      <p className="mt-4 text-sm text-slate-600">
        Só podem ser importados carros 0 km ou com mais de 30 anos de fabricação. O{" "}
        <Link href="/guia" className="text-blue-600 hover:underline">
          guia de importação
        </Link>{" "}
        explica as regras e cada etapa do processo.
      </p>

      <div className="mt-5">
        <AvisoEstimativa compacto />
      </div>

      <a
        href="#calculadora"
        className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        🧮 Simular o custo do seu carro
      </a>
    </section>
  );
}
