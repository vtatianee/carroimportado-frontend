export default function Post() {
  return (
    <>
      <p>
        Em todo processo de importação de veículo dos EUA para o Brasil, há um profissional que
        aparece como obrigatório em quase todas as etapas: o despachante aduaneiro. Mas quem é
        exatamente essa pessoa, o que ela faz, quanto cobra — e o que acontece se você tentar
        dispensá-la?
      </p>

      <h2>O que é o despachante aduaneiro</h2>
      <p>
        O despachante aduaneiro é um profissional habilitado pela Receita Federal para intermediar
        o processo de desembaraço aduaneiro — ou seja, a etapa em que a Receita analisa, tributa e
        libera a mercadoria importada. No caso de veículos, esse processo é especialmente detalhado:
        envolve a conferência do chassis, documentação de origem, histórico do veículo e o
        pagamento de todos os tributos incidentes (II, IPI, PIS, COFINS e ICMS).
      </p>
      <p>
        O despachante não é opcional por razão técnica: o Regulamento Aduaneiro (Decreto 6.759/2009)
        permite que o importador atue em causa própria, mas na prática a Receita Federal exige
        habilitação no SISCOMEX — o sistema de comércio exterior brasileiro — e o processo tem
        prazos, documentos e regras que tornam a atuação direta praticamente inviável para uma
        pessoa física sem experiência.
      </p>

      <h2>O que o despachante faz na prática</h2>
      <p>
        Em uma importação de veículo americano, o despachante cuida de:
      </p>
      <ul>
        <li>
          <strong>Declaração de Importação (DI) ou DUIMP:</strong> o documento principal que
          registra a operação no SISCOMEX, informa o valor aduaneiro, a NCM do veículo e calcula
          os tributos devidos.
        </li>
        <li>
          <strong>Licenciamento de importação (LI):</strong> veículos exigem licença prévia do
          DENATRAN/SENATRAN. O despachante acompanha e empurra esse processo.
        </li>
        <li>
          <strong>Vistoria aduaneira e laudo de conformidade:</strong> a Receita pode exigir
          vistoria física no porto. O despachante coordena com o terminal e acompanha o agente.
        </li>
        <li>
          <strong>Liberação e entrega:</strong> após o pagamento de tributos e a aprovação da
          Receita, o despachante coordena a retirada do veículo do terminal portuário e o despacho
          para o destinatário.
        </li>
        <li>
          <strong>Regularização junto ao DETRAN:</strong> alguns despachantes oferecem como
          serviço adicional a emplacamento e transferência para o nome do comprador.
        </li>
      </ul>

      <h2>Quanto custa um despachante aduaneiro</h2>
      <p>
        Os honorários de despachante aduaneiro para veículos importados geralmente ficam entre{" "}
        <strong>R$ 4.000 e R$ 10.000</strong>, dependendo do porte da operação, do porto utilizado
        e do nível de complexidade do veículo (clássicos com documentação estrangeira incompleta
        costumam custar mais).
      </p>
      <p>
        Além dos honorários, há custos que o despachante administra mas não paga por você —
        eles são repassados como parte do processo:
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                Item
              </th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>
                Valor estimado (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Honorários do despachante", "US$ 1.200 – 1.800"],
              ["THC (Terminal Handling Charge)", "US$ 400 – 600"],
              ["AFRMM (Adicional de Frete)", "≈ 25% do frete marítimo"],
              ["Armazenagem no terminal", "US$ 300 – 500"],
              ["Capatazia", "US$ 100 – 200"],
            ].map(([item, valor], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b" }}>{item}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: "#334155" }}>{valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        No total, os custos de desembaraço (honorários + encargos portuários) ficam entre{" "}
        <strong>US$ 2.500 e US$ 4.000</strong> para a maioria dos veículos americanos — é esse
        valor que a calculadora usa como referência na linha "Desembaraço aduaneiro".
      </p>

      <h2>Despachante aduaneiro vs. importadora: qual a diferença</h2>
      <p>
        É uma dúvida comum. A diferença principal é quem aparece como importador legal:
      </p>
      <ul>
        <li>
          <strong>Importação direta com despachante:</strong> você é o importador. Compra o carro
          nos EUA, paga os tributos no seu CPF, o veículo vem para o seu nome diretamente. Exige
          mais envolvimento seu (RADAR pessoa física, negociação com exportador, embarque).
        </li>
        <li>
          <strong>Importação via importadora:</strong> a empresa importa o carro por conta própria
          e depois revende para você. Mais simples do ponto de vista burocrático, mas o custo
          total tende a ser mais alto — a margem da importadora está embutida.
        </li>
      </ul>
      <p>
        Para clássicos americanos, a importação direta com despachante é o caminho mais usado por
        colecionadores e entusiastas que já encontraram o carro e querem trazê-lo com o mínimo de
        intermediários.
      </p>

      <h2>Como escolher um bom despachante aduaneiro</h2>
      <p>
        Alguns pontos práticos na hora de contratar:
      </p>
      <ul>
        <li>
          <strong>Experiência com veículos:</strong> o processo de importação de carro tem
          especificidades que não existem em carga geral (laudo do DENATRAN, vistoria de chassis,
          regularização no DETRAN). Prefira profissionais que já fizeram isso antes.
        </li>
        <li>
          <strong>Porto de atuação:</strong> despachantes têm relacionamento com terminais
          específicos. Um especialista em Santos (SP) pode não ter a mesma agilidade em Itajaí
          (SC) ou Paranaguá (PR). Confirme em qual porto ele tem mais experiência.
        </li>
        <li>
          <strong>Habilitação na Receita Federal:</strong> peça o número de registro no SISCOMEX.
          Todo despachante legalmente habilitado tem essa informação disponível.
        </li>
        <li>
          <strong>Referências de outros importadores:</strong> fóruns de carros americanos e grupos
          de WhatsApp de colecionadores são boas fontes de indicação. Uma operação mal feita pode
          resultar em atrasos, multas e até perda do veículo — a reputação prévia do profissional
          importa muito.
        </li>
        <li>
          <strong>Contrato e escopo fechado:</strong> exija um contrato detalhando exatamente o
          que está incluso nos honorários e o que será cobrado à parte. Custos portuários e
          tributos nunca estão inclusos nos honorários — mas a cobrança de "extras" além dos
          encargos previstos é um sinal de alerta.
        </li>
      </ul>

      <h2>Posso importar sem despachante?</h2>
      <p>
        Tecnicamente sim — a lei permite que o próprio importador faça o despacho. Na prática,
        isso exige habilitação no SISCOMEX (processo burocrático por si só), conhecimento de
        regimes aduaneiros, NCMs e prazos da Receita Federal. Para quem está fazendo uma única
        importação de veículo para uso próprio, o custo de aprender e operar esse sistema raramente
        compensa frente ao custo de contratar um profissional experiente.
      </p>
      <p>
        O risco real de dispensar o despachante não é de "pagar mais imposto", mas de cometer
        erros que geram multas por declaração incorreta, atrasos no desembaraço (com acúmulo de
        armazenagem) ou, no pior caso, problemas na regularização do veículo no DETRAN depois.
      </p>
    </>
  );
}
