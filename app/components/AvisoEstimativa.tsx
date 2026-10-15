import Link from "next/link";

/**
 * Aviso de que a simulação é estimativa, sem validade legal. Aparece junto de
 * todo valor calculado (resultado por link, manual, por orçamento e o exemplo
 * da home): quem vê um total em reais não pode sair achando que é o preço que
 * vai pagar. O texto completo está nos Termos de Uso, seções 3 e 6.
 */
export default function AvisoEstimativa({ compacto = false }: { compacto?: boolean }) {
  return (
    <aside
      role="note"
      aria-label="Aviso sobre os valores"
      className={`bg-amber-50 border border-amber-300 rounded-2xl ${compacto ? "px-4 py-3" : "p-5"}`}
    >
      <div className="flex gap-3">
        <span className="text-xl shrink-0" aria-hidden="true">
          ⚖️
        </span>
        <div className="text-sm leading-relaxed text-amber-900">
          <p className="font-semibold">Valores estimados, sem validade legal</p>
          {compacto ? (
            <p className="mt-0.5">
              É uma simulação para planejamento, não uma cotação nem cálculo oficial. O valor final é definido
              pela Receita Federal e pelos prestadores do processo.{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-amber-700">
                Termos de Uso
              </Link>
            </p>
          ) : (
            <p className="mt-1">
              Esta simulação é uma estimativa para planejamento, feita com alíquotas e câmbio de referência. Não é
              cotação, orçamento nem cálculo oficial, e não garante o valor que você vai pagar. O valor final é
              definido pela Receita Federal no desembaraço e pelos prestadores contratados (frete, despachante,
              porto). Antes de comprar o carro, confirme os números com um despachante aduaneiro habilitado.{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-amber-700">
                Termos de Uso
              </Link>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
