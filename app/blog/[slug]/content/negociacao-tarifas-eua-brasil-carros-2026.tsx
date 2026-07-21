export default function Post() {
  return (
    <>
      <p>
        Em julho de 2026, o USTR — o escritório do Representante Comercial dos EUA, equivalente
        americano de um Ministério do Comércio — fez um pedido formal ao Brasil durante as
        negociações bilaterais:{" "}
        <strong>
          reduzir a alíquota de 35% do Imposto de Importação sobre veículos fabricados nos
          Estados Unidos
        </strong>
        . O pedido entrou na pauta das rodadas de negociação de julho como um dos pontos
        prioritários americanos. As conversas travaram, mas o assunto não saiu de cena.
      </p>
      <p>
        Para quem acompanha o mercado de importação de carros americanos, a notícia merece atenção
        — não porque uma mudança seja iminente, mas porque é a primeira vez em anos que a alíquota
        do II para veículos está explicitamente na mesa de negociações bilaterais com os EUA.
      </p>

      <h2>O que o USTR pediu exatamente</h2>
      <p>
        Segundo reportagem da CNN Brasil e da Agência Brasil, o USTR incluiu a redução das tarifas
        brasileiras sobre <em>motor vehicles</em> como um dos principais pedidos da rodada de
        negociações de julho. A alíquota atual de 35% é a máxima permitida pelo Mercosul para bens
        industriais — e os americanos a consideram excessivamente restritiva para veículos de
        fabricação americana.
      </p>
      <p>
        O Brasil respondeu que o termo <em>motor vehicles</em> era amplo demais, abrangendo carros
        elétricos, híbridos, a combustão, veículos de passageiros e utilitários, e pediu que os
        americanos especificassem em qual subgrupo consideram os EUA mais competitivos. As conversas
        pararam nesse ponto — sem acordo até a data-limite de 15 de julho fixada pelo USTR para
        aplicação de tarifas recíprocas.
      </p>

      <h2>Por que o II de 35% importa tanto no custo total</h2>
      <p>
        O Imposto de Importação é a primeira alíquota aplicada sobre o valor do carro (FOB), e é
        a base de cálculo em cascata para IPI, PIS, COFINS e ICMS. Isso significa que uma redução
        no II não afeta apenas ele mesmo — reduz a base de todos os impostos subsequentes.
      </p>
      <p>
        Para ilustrar, veja o impacto hipotético de uma redução do II de 35% para 20% em um Chevrolet
        Silverado 2019 avaliado em US$ 32.000, com câmbio a R$ 5,15:
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>Cenário</th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>II (R$)</th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>Total desembarcado (R$)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["II atual — 35%", "R$ 57.680", "R$ 430.000"],
              ["II hipotético — 25%", "R$ 41.200", "R$ 398.000"],
              ["II hipotético — 20%", "R$ 32.960", "R$ 382.000"],
            ].map(([cenario, ii, total], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b" }}>{cenario}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: "#334155" }}>{ii}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Uma queda de 35% para 20% no II representaria aproximadamente{" "}
        <strong>R$ 48.000 de redução no custo total desembarcado</strong> para esse veículo — sem
        qualquer mudança no câmbio ou no preço do carro. O efeito em cascata sobre os demais
        impostos é o que torna a alíquota do II tão relevante.
      </p>

      <h2>Por que o Brasil resiste e o que pode mudar</h2>
      <p>
        A alíquota de 35% protege a indústria automobilística instalada no Brasil — montadoras como
        GM, Ford, Toyota, Volkswagen e Stellantis que produzem localmente. Reduzir o II para carros
        americanos abriria precedente para outras demandas (China, Europa, Coreia) e poderia gerar
        pressão sobre empregos nas fábricas brasileiras.
      </p>
      <p>
        O pedido americano ficou travado também por uma questão técnica: o Mercosul tem uma Tarifa
        Externa Comum (TEC) de 35% para veículos, e o Brasil não pode reduzi-la unilateralmente
        sem aval do bloco. Qualquer concessão para os EUA exigiria negociação em nível Mercosul —
        o que torna uma mudança rápida improvável.
      </p>

      <h2>O que acompanhar nos próximos meses</h2>
      <p>
        As negociações Brasil–EUA continuam com novas rodadas previstas para o segundo semestre de
        2026. Os pontos a monitorar:
      </p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li>
          <strong>Acordo setorial específico para veículos elétricos</strong> — os EUA têm interesse
          particular em exportar EVs (Ford, GM, Rivian) ao Brasil. Uma alíquota diferenciada para
          elétricos americanos é mais plausível politicamente do que uma redução geral.
        </li>
        <li>
          <strong>Tarifaço recíproco americano sobre produtos brasileiros</strong> — se as negociações
          quebrarem e os EUA impuserem tarifas sobre exportações brasileiras, a resposta do Brasil
          pode incluir contramedidas, o que reduziria o apetite por concessões no setor automotivo.
        </li>
        <li>
          <strong>Reforma da TEC no Mercosul</strong> — há discussão no bloco sobre revisão das
          alíquotas para eletrônicos e veículos. Uma mudança na TEC abriria espaço para o Brasil
          ceder sem violar as regras do Mercosul.
        </li>
      </ul>

      <h2>O que isso muda para quem quer importar agora</h2>
      <p>
        No curto prazo: nada. A alíquota de 35% segue em vigor e não há previsão concreta de
        redução. A recomendação para quem está avaliando uma importação em 2026 é não esperar por
        uma mudança de política que pode não acontecer dentro do horizonte de planejamento.
      </p>
      <p>
        No médio prazo, vale acompanhar o desfecho das negociações. Se um acordo setorial para
        elétricos americanos avançar, pode haver uma janela específica de alíquota menor para EVs
        — o que alteraria significativamente o custo de modelos como Ford F-150 Lightning, Rivian
        R1T e GM Silverado EV.
      </p>
      <p>
        Enquanto isso, as variáveis que o importador controla — câmbio, escolha do porto, estado
        de destino e despachante — continuam sendo as alavancas mais eficazes para reduzir o custo
        total. Simule na calculadora com diferentes estados e câmbios: a diferença entre os cenários
        sob controle do comprador já supera qualquer redução realista de II nas próximas negociações.
      </p>
    </>
  );
}
