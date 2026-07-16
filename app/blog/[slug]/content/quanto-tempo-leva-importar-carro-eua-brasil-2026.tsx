export default function Post() {
  return (
    <>
      <p>
        A pergunta que todo comprador faz antes de fechar negócio: <strong>quanto tempo vai levar?</strong>{" "}
        A resposta honesta é: entre 90 e 150 dias, dependendo do estado de destino, do porto de
        desembarque e da agilidade do despachante. Mas o prazo não é um mistério — cada etapa tem
        uma duração previsível, e entender onde o tempo é gasto ajuda a planejar melhor e evitar
        surpresas.
      </p>

      <h2>Visão geral: as 4 etapas e seus prazos</h2>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>Etapa</th>
              <th style={{ padding: "10px 14px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Prazo típico</th>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>O que acontece</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1. Compra e documentação nos EUA", "2–4 semanas", "Negociação, pagamento, título de propriedade, preparação para embarque"],
              ["2. Frete marítimo", "25–40 dias", "Transporte por navio de Miami/Jacksonville até Santos, Itajaí ou Paranaguá"],
              ["3. Desembaraço aduaneiro", "15–30 dias", "Declaração de importação, pagamento de impostos, liberação pela Receita Federal"],
              ["4. Vistoria e emplacamento", "2–4 semanas", "DENATRAN/SENATRAN, laudo de vistoria, CRLV e placas"],
            ].map(([etapa, prazo, desc], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1e293b" }}>{etapa}</td>
                <td style={{ padding: "10px 14px", textAlign: "center", color: "#0369a1", fontWeight: 700, whiteSpace: "nowrap" }}>{prazo}</td>
                <td style={{ padding: "10px 14px", color: "#475569", fontSize: "0.9rem" }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Somando tudo, o cenário mais comum é <strong>90 a 120 dias</strong> — cerca de 3 a 4 meses
        do pagamento nos EUA até o carro estar com placa brasileira na sua garagem.
      </p>

      <h2>Etapa 1 — Compra e documentação nos EUA (2–4 semanas)</h2>
      <p>
        Depois de fechar a compra (seja por anúncio particular, leilão ou dealer), o vendedor precisa
        transferir o título de propriedade (<em>title</em>) para o comprador. Em alguns estados americanos
        esse processo é imediato; em outros, como Califórnia e Nova York, pode levar 2 a 3 semanas.
      </p>
      <p>
        Com o título em mãos, o exportador providencia a documentação aduaneira americana (formulário
        AES/EEI na alfândega dos EUA) e agenda o transporte interno até o porto. Carros que precisam
        de preparação mecânica ou detalhamento antes do embarque adicionam tempo aqui.
      </p>

      <h2>Etapa 2 — Frete marítimo (25–40 dias)</h2>
      <p>
        A travessia do Atlântico em si leva entre 12 e 18 dias. O tempo total nesta etapa é maior
        porque inclui:
      </p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li><strong>Aguardar o próximo navio disponível</strong> — a maioria das linhas opera com frequência semanal ou bissemanal entre Flórida e Brasil</li>
        <li><strong>Carregamento e estufagem</strong> — RORO e container têm logísticas diferentes</li>
        <li><strong>Chegada e atracação</strong> — congestionamentos nos portos de Santos e Itajaí podem adicionar 3 a 7 dias</li>
      </ul>
      <p>
        Os portos com menor espera em 2026 têm sido Itajaí (SC) e Paranaguá (PR). Santos (SP) é o
        maior volume mas costuma ter mais filas, especialmente em períodos de alta.
      </p>

      <h2>Etapa 3 — Desembaraço aduaneiro (15–30 dias)</h2>
      <p>
        Esta é a etapa mais imprevisível. O processo começa quando o navio atracou e o despachante
        registra a Declaração de Importação (DI) no sistema SISCOMEX da Receita Federal. A partir
        daí, existem 4 canais de parametrização:
      </p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li><strong>Verde</strong> — liberação automática, sem conferência. Raro em veículos</li>
        <li><strong>Amarelo</strong> — conferência documental. Prazo de 3 a 8 dias úteis</li>
        <li><strong>Vermelho</strong> — conferência física + documental. Prazo de 10 a 20 dias úteis. O mais comum para veículos importados</li>
        <li><strong>Cinza</strong> — suspeita de fraude ou subfaturamento. Pode ultrapassar 30 dias</li>
      </ul>
      <p>
        Enquanto o veículo aguarda no pátio alfandegado, incide taxa de armazenagem diária. Por isso,
        um despachante experiente que reduz o tempo no canal vermelho representa economia real — não
        apenas em honorários, mas nas taxas de capatazia e armazenagem que se acumulam por dia.
      </p>

      <h2>Etapa 4 — Vistoria e emplacamento (2–4 semanas)</h2>
      <p>
        Com o veículo liberado pela Receita Federal, começa o processo de regularização no DENATRAN
        (ou SENATRAN, conforme o estado). É necessário:
      </p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li>Laudo de vistoria veicular (presencial no DETRAN do estado de destino)</li>
        <li>Comprovante de pagamento do IPVA do exercício atual</li>
        <li>Seguro obrigatório DPVAT (agora Fundo de Indenização)</li>
        <li>Emissão do CRLV e gravação do Renavam</li>
      </ul>
      <p>
        Em São Paulo e Minas Gerais, o agendamento de vistoria costuma ter fila de 1 a 2 semanas.
        Em estados menores, o processo tende a ser mais rápido. Após a vistoria aprovada, as placas
        podem ser emitidas em 3 a 5 dias úteis.
      </p>

      <h2>O que pode atrasar o processo</h2>
      <p>
        Os maiores causadores de atraso fora do esperado são:
      </p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li><strong>Title com pendência</strong> — o vendedor americano demorou para assinar ou há gravame no veículo</li>
        <li><strong>Subfaturamento detectado</strong> — Receita Federal compara o valor declarado com bases de referência (KBB, Manheim); divergência grande pode levar ao canal cinza</li>
        <li><strong>Documentação incompleta</strong> — falta de invoice original, Bill of Lading ou certificado de origem</li>
        <li><strong>Greve portuária ou congestionamento</strong> — fora do controle do importador, mas acontece especialmente nos meses de alta importação (setembro–novembro)</li>
      </ul>

      <h2>Como usar o prazo no planejamento</h2>
      <p>
        Ao decidir importar, convém calcular uma <strong>janela de 4 a 5 meses</strong> antes de
        precisar do veículo. Quem compra em março geralmente tem o carro emplacado em julho ou agosto.
        Quem compra em outubro precisará levar em conta as festas de fim de ano, que congestionam
        portos e atrasam o desembaraço por 2 a 4 semanas adicionais.
      </p>
      <p>
        A calculadora do carroimportado.com estima o custo total do processo — mas o prazo é tão
        importante quanto o custo na decisão de importar. Planejando com antecedência e escolhendo
        um despachante com bom histórico no canal vermelho, é possível ficar dentro dos 90 dias
        mesmo no cenário mais comum.
      </p>
    </>
  );
}
