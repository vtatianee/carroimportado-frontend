export default function Post() {
  return (
    <>
      <p>
        Quem pesquisa o custo de importar um carro americano costuma somar Imposto de Importação,
        IPI e ICMS — e para por aí. O problema é que existe um segundo grupo de despesas, menos
        visíveis, que costuma surpreender quem recebe a primeira fatura do despachante. Essas
        cobranças são legítimas, obrigatórias e chegam a representar{" "}
        <strong>15% a 25% do custo total do processo</strong> — o suficiente para desequilibrar
        um orçamento que parecia fechado.
      </p>

      <h2>AFRMM — a taxa federal que poucos calculam</h2>
      <p>
        O Adicional ao Frete para Renovação da Marinha Mercante (AFRMM) é uma contribuição federal
        cobrada sobre o valor do frete marítimo internacional. A alíquota para cargas em container
        é de <strong>25% sobre o frete</strong>. Se o frete do seu carro custou US$ 2.000, o AFRMM
        é mais US$ 500 — direto.
      </p>
      <p>
        Poucos anúncios e simuladores mencionam o AFRMM porque ele não é exatamente um imposto de
        importação — é uma contribuição parafiscal gerenciada pelo FRMM (Fundo de Marinha
        Mercante). Mas ele é obrigatório e compõe a base de cálculo do ICMS, o que amplia ainda
        mais o impacto.
      </p>

      <h2>Capatazia, armazenagem e THC</h2>
      <p>
        Quando o container chega ao porto brasileiro, começa um relógio: cada dia de armazenagem
        é cobrado. Além disso, há taxas de movimentação do container (capatazia) e de manuseio
        no terminal (THC — Terminal Handling Charge). Juntos, esses itens costumam ficar entre{" "}
        <strong>R$ 3.000 e R$ 8.000</strong> dependendo do porto, do prazo até o desembaraço e
        do tamanho do container.
      </p>
      <p>
        A variável mais importante aqui é o tempo: quanto mais demorar o desembaraço aduaneiro,
        maior a conta de armazenagem. Por isso, ter toda a documentação em ordem antes da chegada
        do navio não é apenas burocracia — é economia direta.
      </p>

      <h2>Honorários do despachante aduaneiro</h2>
      <p>
        O despachante aduaneiro é obrigatório para importações de pessoa física no Brasil. Ele
        representa o importador perante a Receita Federal, opera no Siscomex e é o responsável
        pelo desembaraço do veículo. Os honorários variam conforme a complexidade e o despachante,
        mas a faixa típica para importação de veículo fica entre{" "}
        <strong>R$ 7.000 e R$ 15.000</strong>. Importadoras especializadas geralmente incluem
        esse serviço no pacote — ao comparar preços, é importante verificar o que está incluso.
      </p>

      <h2>Frete interno: do porto até você</h2>
      <p>
        Após o desembaraço, o carro precisa sair do porto e chegar até o destino final — e isso
        custa. O transporte rodoviário de um veículo de Santos para São Paulo capital, por exemplo,
        pode sair por R$ 800 a R$ 2.000 dependendo da transportadora e da urgência. Para Minas
        Gerais, Rio Grande do Sul ou Nordeste, o valor sobe proporcionalmente.
      </p>

      <h2>O efeito cascata: quando os custos encarecem os impostos</h2>
      <p>
        O ICMS, por ser calculado "por dentro" (método de cálculo que inclui o próprio tributo
        na base), usa como base{" "}
        <strong>
          CIF + II + IPI + PIS/COFINS + despesas de desembaraço (capatazia, AFRMM, honorários)
        </strong>
        . Isso significa que cada despesa operacional que você adiciona ao processo eleva
        automaticamente a base do ICMS — que por sua vez eleva o imposto. Não é um custo linear:
        um item de R$ 5.000 nas despesas portuárias pode custar efetivamente R$ 6.000–7.000 no
        total, dependendo da alíquota de ICMS do seu estado.
      </p>

      <p>
        A calculadora do carroimportado.com já considera todos esses itens no custo total — AFRMM,
        capatazia, honorários estimados de despachante e frete marítimo — para que o número que
        você vê seja o mais próximo possível do que vai pagar de verdade.
      </p>

      <hr />
      <p className="text-sm text-slate-400">
        <strong>Fontes:</strong>{" "}
        <a
          href="https://enviandomeucarro.com/centro-de-conhecimento/importacao/impostos-importacao-veiculos-brasil"
          target="_blank"
          rel="noopener noreferrer"
        >
          Enviando Meu Carro
        </a>
        {" · "}
        <a
          href="https://garagem360.com.br/quanto-custa-importar-um-carro-classico-dos-estados-unidos/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Garagem 360
        </a>
        {" · "}
        <a
          href="https://guelcos.com.br/conteudo/importacao/desembaraco-aduaneiro-tudo-o-que-voce-precisa-saber/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Guelcos
        </a>
      </p>
      <p className="text-sm text-slate-400">
        <strong>Imagem:</strong> Porto de Santos —{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Porto_de_Santos.jpg"
          target="_blank"
          rel="noopener noreferrer"
        >
          JorgeRioBRAZIL / Jorge Andrade
        </a>
        , CC BY 2.0
      </p>
    </>
  );
}
