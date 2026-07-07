export default function Post() {
  return (
    <>
      <p>
        O dólar fechou 2024 em R$&nbsp;6,18 — e chegou a bater R$&nbsp;6,27 em 18 de dezembro,
        recorde nominal da série histórica. Em julho de 2026, a cotação está em torno de{" "}
        <strong>R$&nbsp;5,15 a R$&nbsp;5,21</strong>. São quase 18% de diferença em menos de dois
        anos. Para quem importa um carro americano, essa variação não é apenas um detalhe cambial
        — ela representa dezenas de milhares de reais no custo final.
      </p>

      <h2>Por que a queda no câmbio vale mais do que parece</h2>
      <p>
        A tentação é calcular assim: "comprei um carro por US$&nbsp;25.000 e o dólar caiu
        R$&nbsp;1,10 — economizei R$&nbsp;27.500." O raciocínio está certo na base, mas subestima
        o efeito real. Os impostos de importação (II, IPI, PIS/COFINS, ICMS) são calculados sobre
        o <strong>valor aduaneiro em reais</strong> — quanto menor o câmbio, menor a base de
        cálculo, e menor o imposto. O efeito se multiplica em cascata.
      </p>
      <p>
        Num carro hipotético de US$&nbsp;25.000 com frete de US$&nbsp;2.500 (CIF =
        US$&nbsp;27.500):
      </p>
      <table>
        <thead>
          <tr>
            <th>Câmbio</th>
            <th>CIF em BRL</th>
            <th>Impostos est. (SP)</th>
            <th>Custo total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>R$&nbsp;6,27 (pico dez/2024)</td>
            <td>R$&nbsp;172.425</td>
            <td>~R$&nbsp;195.000</td>
            <td>
              <strong>~R$&nbsp;370.000</strong>
            </td>
          </tr>
          <tr>
            <td>R$&nbsp;5,15 (julho 2026)</td>
            <td>R$&nbsp;141.625</td>
            <td>~R$&nbsp;160.000</td>
            <td>
              <strong>~R$&nbsp;304.000</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        A diferença no câmbio gerou <strong>~R$&nbsp;66.000 de economia</strong> no custo total —
        mais do que o dobro da variação no preço base, graças ao efeito cascata dos impostos.
      </p>

      <h2>O que esse câmbio significa para clássicos americanos (30+ anos)</h2>
      <p>
        Para um Mustang, Camaro ou Corvette com mais de 30 anos de fabricação, a equação é ainda
        mais favorável: além da queda no câmbio, esses veículos têm <strong>IPI zero</strong> —
        o que reduz a base de cálculo e o efeito cascata sobre o ICMS. O momento atual combina
        câmbio historicamente baixo com a isenção estrutural de IPI, formando a combinação mais
        favorável dos últimos anos para importação de clássicos.
      </p>

      <h2>O risco no horizonte: Copom de julho</h2>
      <p>
        A reunião do Copom no final de julho é o principal evento a monitorar. O mercado está
        dividido entre um novo corte de 0,25 ponto e uma pausa — e a decisão pode mover o câmbio
        significativamente nas semanas seguintes. Ninguém sabe se o dólar vai a R$&nbsp;4,90 ou
        volta para R$&nbsp;5,50.
      </p>
      <p>
        O que se sabe: o câmbio de hoje é 18% mais barato que o pico de dezembro de 2024. Quem
        está avaliando importar tem uma janela concreta para simular com os números atuais — cole
        o link de um anúncio do Cars.com na calculadora e veja o custo total com o câmbio de hoje.
      </p>

      <hr />
      <p className="text-sm text-slate-400">
        <strong>Fontes:</strong>{" "}
        <a
          href="https://www.poder360.com.br/poder-economia/dolar-fecha-ano-a-r-618-com-alta-de-273-em-2024/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Poder 360
        </a>
        {" · "}
        <a
          href="https://www.cnnbrasil.com.br/economia/mercado/mercado-hoje-ibovespa-dolar-30-dezembro-2024/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CNN Brasil
        </a>
        {" · "}
        <a
          href="https://wise.com/us/currency-converter/usd-to-brl-rate/history"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wise USD/BRL
        </a>
      </p>
      <p className="text-sm text-slate-400">
        <strong>Imagem:</strong>{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Money_-_Flickr_-_Tracy_O.jpg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tracy O / Flickr
        </a>
        , CC BY-SA 2.0
      </p>
    </>
  );
}
