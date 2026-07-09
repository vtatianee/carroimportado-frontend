export default function Post() {
  return (
    <>
      <p>
        Quando alguém calcula o custo de importar um carro americano, a atenção vai quase toda
        para o Imposto de Importação (35%) e o IPI. O ICMS aparece no final da conta como mais
        um número — mas poucos percebem que ele varia significativamente de estado para estado e
        que essa variação pode representar{" "}
        <strong>R$ 20.000 a R$ 40.000 de diferença no custo total</strong> de um clássico americano.
      </p>

      <h2>Por que o ICMS de importação é calculado "por dentro"</h2>
      <p>
        O ICMS tem uma particularidade que o torna mais pesado do que parece: ele é calculado{" "}
        <em>sobre uma base que já inclui o próprio ICMS</em>. Esse mecanismo, chamado de "cálculo
        por dentro", foi criado para que a alíquota nominal reflita a participação do imposto no
        preço final — mas o efeito prático é que o ICMS real pago é sempre maior do que a alíquota
        sugere.
      </p>
      <p>
        Na importação, a base de cálculo do ICMS inclui: valor aduaneiro (CIF) + Imposto de
        Importação + IPI + PIS + COFINS + despesas de desembaraço. Sobre esse total, aplica-se
        a alíquota do estado — e o resultado é dividido por{" "}
        <strong>(1 − alíquota)</strong> para chegar ao ICMS efetivo. Em São Paulo (12%), o
        impacto real fica em torno de 13,6% da base. No Rio de Janeiro (20%), chega a 25%.
      </p>

      <h2>As alíquotas de ICMS na importação por estado</h2>
      <p>
        Os estados brasileiros aplicam alíquotas diferentes para importações de veículos. As
        principais faixas em vigor em 2026:
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                Estado
              </th>
              <th style={{ padding: "10px 14px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                Alíquota ICMS
              </th>
              <th style={{ padding: "10px 14px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                Porto / Aeroporto de referência
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["São Paulo", "12%", "Santos (SP)"],
              ["Minas Gerais", "12%", "Varginha, Pouso Alegre"],
              ["Santa Catarina", "12%", "Itajaí / Navegantes (SC)"],
              ["Rio Grande do Sul", "12%", "Porto Alegre (RS)"],
              ["Paraná", "12%", "Paranaguá (PR)"],
              ["Rio de Janeiro", "20%", "Rio de Janeiro (RJ)"],
              ["Demais estados", "17%", "Varia"],
            ].map(([estado, aliq, porto], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b" }}>{estado}</td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: aliq === "12%" ? "#16a34a" : aliq === "20%" ? "#dc2626" : "#92400e" }}>
                  {aliq}
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center", color: "#64748b" }}>{porto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Quanto a diferença de alíquota impacta no bolso</h2>
      <p>
        Para tornar concreto, considere um Chevrolet Camaro SS 2018 avaliado em US$ 28.000,
        com câmbio a R$ 5,15 e frete estimado de US$ 2.500:
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                Cenário
              </th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>
                ICMS pago (R$)
              </th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>
                Custo total desembarcado (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["SP / SC / RS / PR / MG (12%)", "R$ 38.400", "R$ 320.000"],
              ["Demais estados (17%)", "R$ 57.800", "R$ 340.000"],
              ["Rio de Janeiro (20%)", "R$ 72.100", "R$ 354.000"],
            ].map(([cenario, icms, total], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b" }}>{cenario}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: "#334155" }}>{icms}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        A diferença entre importar desembarcando em Santos (SP) e no Rio de Janeiro chega a{" "}
        <strong>cerca de R$ 34.000</strong> no custo total — para o mesmo carro, no mesmo câmbio.
        No caso de um clássico de maior valor (US$ 50.000+), essa diferença ultrapassa R$ 60.000.
      </p>

      <h2>Posso escolher o estado onde pago o ICMS?</h2>
      <p>
        Tecnicamente, o ICMS de importação é devido ao estado onde ocorre o desembaraço aduaneiro
        — ou seja, o porto ou aeroporto por onde o carro entra no Brasil. Isso significa que, em
        tese, desembarcar em Paranaguá (PR) ou Santos (SP) resulta em alíquota de 12%, enquanto
        desembarcar no Rio de Janeiro implica 20%.
      </p>
      <p>
        Na prática, porém, a escolha do porto não é totalmente livre. O despachante aduaneiro
        orienta sobre qual porto é mais viável logisticamente para o seu caso — levando em conta
        o porto de origem nos EUA, as rotas de navios disponíveis e o custo do frete interno após
        o desembaraço. Importar pelo Porto de Santos e transportar o carro de caminhão até Curitiba
        pode sair mais barato do que desembarcar em Paranaguá, dependendo do transportador.
      </p>

      <h2>O que vale simular antes de decidir</h2>
      <p>
        Antes de fechar com uma importadora ou despachante, vale simular o custo total com
        diferentes estados na calculadora — a diferença de ICMS aparece diretamente no resultado.
        A combinação de câmbio favorável, porto logisticamente eficiente e alíquota de 12% é o
        cenário ideal para quem quer minimizar o custo de desembarque.
      </p>
      <p>
        Um ponto que raramente é discutido: estados com alíquota de 12% também concentram os
        principais portos de entrada de veículos (Santos, Itajaí, Paranaguá), o que significa
        que a vantagem fiscal e a vantagem logística costumam andar juntas.
      </p>
    </>
  );
}
