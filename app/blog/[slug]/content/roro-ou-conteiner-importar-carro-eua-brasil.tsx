export default function Post() {
  return (
    <>
      <p>
        Depois de escolher o carro nos EUA, a próxima decisão que custa dinheiro é como ele
        atravessa o Atlântico. As duas opções são <strong>RoRo</strong> — o carro entra dirigindo no
        navio e fica estacionado no convés — e <strong>contêiner</strong>, em que ele viaja lacrado
        dentro de uma caixa de aço.
      </p>
      <p>
        A recomendação que você vai ouvir em todo lugar é "contêiner para clássicos, RoRo para o
        resto". Está certa, mas quase nunca vem com número. E existe um detalhe do cálculo de
        impostos brasileiro que muda bastante a conta — e que praticamente ninguém menciona.
      </p>

      <h2>As três modalidades</h2>

      <p>
        <strong>RoRo (Roll-on/Roll-off).</strong> Navio especializado em veículos, com decks onde os
        carros são estacionados. O seu fica preso por cintas, exposto ao ar salino e ao manuseio de
        equipes portuárias nos dois lados. É o mais barato, tem saídas mais frequentes e o
        embarque/desembarque é rápido. Exige que o carro esteja rodando e não permite nada dentro —
        nem objetos pessoais, nem peças.
      </p>
      <p>
        <strong>Contêiner compartilhado (consolidado).</strong> Seu carro divide um contêiner de 40
        pés com outro veículo. Você paga só pelo espaço ocupado. Protegido do tempo e do manuseio,
        mas depende da transportadora juntar a carga — o que pode adicionar semanas de espera até o
        embarque.
      </p>
      <p>
        <strong>Contêiner exclusivo (20 pés).</strong> Só o seu carro. Pode viajar sem estar
        rodando, permite mandar peças junto (declaradas) e embarca no próximo navio, sem esperar
        consolidação. É o mais caro e o mais rápido porta a porta.
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}></th>
              <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>RoRo</th>
              <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Contêiner compartilhado</th>
              <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Contêiner exclusivo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Faixa de preço", "US$ 1.200–2.000", "US$ 2.000–2.800", "US$ 2.800–3.500"],
              ["Proteção", "Baixa", "Alta", "Alta"],
              ["Carro precisa estar rodando", "Sim", "Não", "Não"],
              ["Pode levar peças junto", "Não", "Limitado", "Sim (declaradas)"],
              ["Espera até embarcar", "Curta", "Pode ser longa", "Curta"],
              ["Frequência de saídas", "Alta", "Média", "Alta"],
            ].map(([item, a, b, c], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{item}</td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#475569" }}>{a}</td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#475569" }}>{b}</td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#475569" }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
        Faixas típicas para a rota EUA → Santos. O valor real varia com porto de origem, tamanho do
        veículo e época do ano — sempre peça cotação a pelo menos duas transportadoras.
      </p>

      <h2>O detalhe que quase ninguém conta: o frete é taxado</h2>
      <p>
        Aqui está o ponto que muda a decisão. No Brasil, os impostos de importação não incidem sobre
        o preço do carro — incidem sobre o <strong>valor aduaneiro</strong>, que é o preço do carro{" "}
        <em>mais o frete mais o seguro</em>. Ou seja: quando você escolhe um frete mais caro, você
        não paga só a diferença do frete. Você aumenta a base de cálculo de todos os impostos.
      </p>
      <p>
        E tem um segundo efeito: o AFRMM, taxa da marinha mercante, é exatamente 25% do valor do
        frete marítimo. Frete maior, AFRMM maior.
      </p>
      <p>
        Veja o que acontece ao acrescentar US$ 1.000 ao frete (câmbio R$ 5,15, destino SP):
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>Item</th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>Aumento</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Frete em si", "R$ 5.150", false],
              ["II — Imposto de Importação", "R$ 1.803", false],
              ["IPI", "R$ 1.308", false],
              ["PIS", "R$ 135", false],
              ["COFINS", "R$ 647", false],
              ["ICMS", "R$ 1.409", false],
              ["Desembaraço (AFRMM)", "R$ 1.288", false],
              ["Custo final", "R$ 11.739", true],
            ].map(([item, valor, bold], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: bold ? "#eff6ff" : "transparent" }}>
                <td style={{ padding: "10px 14px", color: "#1e293b", fontWeight: bold ? 700 : 400 }}>{item}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: bold ? "#1d4ed8" : "#334155", fontWeight: bold ? 700 : 400 }}>{valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        <strong>Cada R$ 1 a mais de frete vira R$ 2,28 no custo final.</strong> Não é opinião: é
        aritmética da cascata tributária. Se um transitário te oferece contêiner por "só US$ 1.500 a
        mais que o RoRo", o impacto real no seu bolso é de aproximadamente R$ 17.600, não R$ 7.700.
      </p>

      <h2>Por isso a conta muda com o valor do carro</h2>
      <p>
        Como o frete é um custo fixo — o navio não cobra mais caro por transportar um carro mais
        valioso —, a diferença absoluta entre RoRo e contêiner é <strong>sempre a mesma</strong>. O
        que muda é o quanto ela pesa:
      </p>

      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>Valor do carro</th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>Custo extra do contêiner</th>
              <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>% do valor do carro</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["US$ 20.000", "R$ 19.956", "19,4%"],
              ["US$ 35.000", "R$ 19.956", "11,1%"],
              ["US$ 70.000", "R$ 19.956", "5,5%"],
            ].map(([carro, extra, pct], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1e293b" }}>{carro}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: "#334155" }}>{extra}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", color: "#0369a1", fontWeight: 700 }}>{pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
        Comparação entre frete de US$ 1.500 (RoRo) e US$ 3.200 (contêiner exclusivo), câmbio R$ 5,15,
        destino SP.
      </p>

      <p>
        É por isso que o conselho tradicional funciona. Num carro de US$ 70 mil, pagar 5,5% a mais
        para eliminar risco de arranhão, amassado e maresia é barato. Num carro de US$ 20 mil, quase
        20% do valor é caro demais para comprar tranquilidade — a menos que exista um motivo além da
        proteção.
      </p>

      <h2>Quando o contêiner deixa de ser escolha</h2>
      <p>Em três situações o RoRo simplesmente não serve:</p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li>
          <strong>O carro não está rodando.</strong> Projeto de restauração, motor desmontado, sem
          bateria — o RoRo exige que o veículo entre e saia dirigindo pelas próprias rodas.
        </li>
        <li>
          <strong>Você quer mandar peças junto.</strong> Comum em clássicos, quando se aproveita a
          viagem para trazer peças difíceis de achar no Brasil. Precisam ser declaradas na Declaração
          de Importação — peça não declarada encontrada na conferência física é o caminho mais rápido
          para o canal vermelho e para uma multa.
        </li>
        <li>
          <strong>Veículo modificado ou com altura fora do padrão.</strong> Alguns navios RoRo têm
          limite de altura de deck que picapes levantadas e vans não passam.
        </li>
      </ul>

      <h2>Como decidir</h2>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li>
          <strong>Carro comum, rodando, até US$ 30 mil:</strong> RoRo. A economia é significativa em
          proporção e o risco real de dano é baixo — arranhões de manuseio acontecem, perda total
          não.
        </li>
        <li>
          <strong>Clássico, esportivo ou acima de US$ 50 mil:</strong> contêiner. A proteção contra
          maresia e manuseio custa pouco em relação ao valor, e um carro de coleção com pintura
          original danificada perde muito mais que a diferença do frete.
        </li>
        <li>
          <strong>Entre US$ 30 e 50 mil:</strong> depende do carro. Se a pintura é original e o
          estado de conservação é parte do valor, contêiner. Se é um carro para usar, RoRo.
        </li>
        <li>
          <strong>Sem pressa e querendo economizar:</strong> peça cotação de contêiner compartilhado.
          Fica entre os dois em preço e entrega quase toda a proteção — o custo é esperar a
          consolidação.
        </li>
      </ul>

      <h2>O que perguntar antes de fechar</h2>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.8 }}>
        <li>O valor inclui THC e taxas portuárias nos dois lados, ou vêm à parte?</li>
        <li>O seguro marítimo está incluso? Qual a cobertura e a franquia?</li>
        <li>Qual o prazo estimado até o embarque — e, se for compartilhado, até a consolidação?</li>
        <li>Quem é o responsável por danos no manuseio em porto?</li>
        <li>Há vistoria fotográfica documentada antes do embarque?</li>
      </ul>
      <p>
        Essa última é a mais importante e a mais esquecida. Fotos datadas de todos os ângulos antes
        do carro entrar no navio são a única prova que você terá se aparecer um amassado do outro
        lado. Transportadora séria faz isso sem você pedir.
      </p>

      <h2>Simule antes de escolher</h2>
      <p>
        A calculadora do carroimportado.com aceita o valor do frete como campo próprio. Rode a mesma
        simulação duas vezes — uma com a cotação do RoRo, outra com a do contêiner — e você vai ver o
        custo final real de cada opção, com a cascata de impostos já aplicada. É a única forma de
        comparar as duas propostas pelo número que importa, que é quanto sai do seu bolso no fim.
      </p>
    </>
  );
}
