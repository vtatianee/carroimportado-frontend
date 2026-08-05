"use client";

import { useState } from "react";
import Link from "next/link";
import NavHeader from "../components/NavHeader";

/**
 * Política de privacidade do site E do aplicativo iOS.
 *
 * O app não tem política própria: o botão "Política de privacidade" da aba
 * "Mais" abre esta página num navegador embutido. Logo, tudo que o app faz
 * precisa estar descrito aqui — em especial o AdMob e o IDFA.
 *
 * ── AO EDITAR ────────────────────────────────────────────────────────────────
 * Toda seção precisa existir nas DUAS versões, PT e EN. Elas são espelhadas, e
 * uma afirmação presente só em um idioma é pior que ausência: sugere que a
 * versão em inglês esconde algo.
 *
 * E a regra que originou esta reescrita: NÃO afirme aqui nada que o código não
 * faça. A versão anterior dizia "não compartilhamos seus dados com terceiros
 * para fins comerciais" enquanto /api/solicitar-orcamento enviava nome, e-mail
 * e WhatsApp do usuário para até 8 empresas. Declaração falsa em política é
 * infração autônoma (LGPD arts. 6º, VI e 9º) e prática enganosa sob o FTC Act
 * §5 — independentemente de ter havido dano.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function PrivacyClient() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  return (
    <main className="flex-1">
      <NavHeader
        rightContent={
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setLang("pt")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === "pt" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>
              PT-BR
            </button>
            <button onClick={() => setLang("en")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === "en" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>
              EN
            </button>
          </div>
        }
      />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {lang === "pt" ? <PrivacyPT /> : <PrivacyEN />}
      </div>
    </main>
  );
}

const CONTATO = "arche.boost@gmail.com";

function PrivacyPT() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidade</h1>
      <p className="text-slate-500 text-sm mb-8">Última atualização: agosto de 2026</p>

      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
        <strong>O que mudou nesta versão:</strong> incluímos o aplicativo para iPhone,
        que antes não estava coberto; descrevemos a publicidade do Google AdMob e o
        identificador de publicidade (IDFA), que existe apenas no aplicativo — o site
        não usa Google AdSense nem qualquer outra publicidade; passamos a explicar que
        o pedido de orçamento envia seus dados para as empresas que você escolher; e
        detalhamos a transferência de dados para fora do Brasil.
      </div>

      <Section title="1. Quem somos e como falar com a gente">
        <p>O site <strong>carroimportado.com</strong> e o aplicativo <strong>Carro Importado</strong> para iPhone são operados por <strong>Tatiane Assink</strong>, na qualidade de <strong>controladora</strong> dos dados pessoais, nos termos do art. 5º, VI, da Lei nº 13.709/2018 (LGPD).</p>
        <p><strong>Encarregada pelo tratamento de dados pessoais (art. 41 da LGPD):</strong> Tatiane Assink — <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>.</p>
        <p>Esta política se aplica a três produtos: o site, o aplicativo para iPhone e a API que atende aos dois. Quando uma regra valer para apenas um deles, dizemos expressamente.</p>
      </Section>

      <Section title="2. Dados que coletamos no site">
        <ul>
          <li><strong>Ao navegar,</strong> sem preencher nada: não pedimos cadastro, mas seu endereço IP e dados de navegação são processados pelos serviços de hospedagem, de medição de audiência e de publicidade descritos nas seções 5 e 6.</li>
          <li><strong>Ao usar a calculadora:</strong> o link do anúncio ou os dados do veículo que você informar, o estado de destino e, se você alterar, frete e câmbio. Não associamos essas consultas a você.</li>
          <li><strong>Ao preencher um formulário</strong> (pedido de orçamento, cadastro de empresa ou de fornecedor, lista de novidades): nome, e-mail e, quando informado, WhatsApp, cidade e estado.</li>
          <li><strong>Se você criar uma conta:</strong> e-mail e senha, esta guardada apenas como hash irreversível (bcrypt), além da contagem de consultas do mês para controle de cota. A sessão é mantida por um token com validade de 30 dias.</li>
        </ul>
        <p>Não coletamos CPF, dados de cartão de crédito ou qualquer outro dado financeiro ou documento de identidade.</p>
      </Section>

      <Section title="3. O aplicativo para iPhone">
        <p>O aplicativo <strong>não tem cadastro, não tem login e não pede seu nome, e-mail ou telefone.</strong> Nenhum dado que identifique você diretamente é enviado aos nossos servidores pelo aplicativo.</p>
        <p><strong>O que fica guardado no seu aparelho, e só nele:</strong></p>
        <ul>
          <li>Histórico de até 25 cálculos, com o veículo, o preço em dólar, o total estimado em reais e o link do anúncio consultado;</li>
          <li>Seu progresso no checklist do guia de importação;</li>
          <li>Preferências: estado de destino, tipo de veículo, frete e câmbio usados por último;</li>
          <li>Contadores de exibição de anúncios, usados para limitar a frequência com que eles aparecem.</li>
        </ul>
        <p>Esses dados ficam na área privada do aplicativo no seu iPhone. <strong>Não temos acesso a eles e eles não são enviados a servidor nenhum.</strong> Você pode apagar o histórico na aba &quot;Mais&quot; e apagar tudo desinstalando o aplicativo.</p>
        <p><strong>O que o aplicativo envia quando você faz um cálculo:</strong> o link do anúncio ou os dados do veículo, o estado de destino e, se alterados, frete e câmbio. Nada disso é vinculado a você.</p>
        <p>O aplicativo <strong>não</strong> usa ferramentas de análise de comportamento, de medição de uso nem de relatório de falhas.</p>
      </Section>

      <Section title="4. Publicidade no aplicativo, rastreamento e IDFA">
        <p>O aplicativo é gratuito e se mantém com publicidade do <strong>Google AdMob</strong>. Para isso, o Google pode acessar o <strong>IDFA</strong> (<em>Identifier for Advertisers</em>), identificador de publicidade que a Apple atribui ao aparelho, e informações sobre sua interação com os anúncios.</p>
        <p><strong>Como pedimos sua autorização.</strong> Antes de exibir qualquer anúncio, o aplicativo mostra, nesta ordem:</p>
        <ol>
          <li>uma tela explicativa nossa, em português, dizendo por que existe publicidade;</li>
          <li>o formulário de consentimento do Google (UMP), onde você decide sobre publicidade <strong>personalizada</strong>;</li>
          <li>o pedido de permissão da Apple (<em>App Tracking Transparency</em>), que decide o acesso ao IDFA.</li>
        </ol>
        <p><strong>Recusar não tira nenhuma funcionalidade.</strong> A calculadora, os artigos, o guia, o histórico e os diretórios continuam idênticos; os anúncios passam a ser não personalizados ou deixam de aparecer.</p>
        <p><strong>Como mudar de ideia.</strong> A permissão de rastreamento pode ser revogada a qualquer momento em <strong>Ajustes → Privacidade e Segurança → Rastreamento</strong>, no seu iPhone. Onde o formulário do Google oferecer essa opção, o aplicativo também exibe <strong>&quot;Configurações de anúncios&quot;</strong> na aba &quot;Mais&quot;.</p>
        <p>O aplicativo participa do <strong>SKAdNetwork</strong>, sistema da Apple que mede a eficácia de anúncios sem identificar você individualmente.</p>
      </Section>

      <Section title="5. Cookies e publicidade no site">
        <p><strong>O site não exibe publicidade e não usa cookies de publicidade.</strong> Não usamos Google AdSense nem nenhum outro serviço de anúncios no site — a publicidade descrita na seção 4 existe apenas no aplicativo para iPhone.</p>
        <p>O site usa o <strong>Vercel Analytics</strong>, que produz estatísticas agregadas de audiência sem identificar visitantes individualmente e não grava cookie de rastreamento, e a <strong>Cloudflare</strong>, que protege o site contra abuso e gera métricas de tráfego. Por isso o site não exibe aviso de cookies: não há cookie não essencial para pedir consentimento.</p>
      </Section>

      <Section title="6. Com quem compartilhamos dados">
        <p><strong>6.1. Pedido de orçamento.</strong> Quando você usa o formulário de pedido de orçamento, <strong>enviamos os dados que você preencheu — nome, e-mail, WhatsApp se informado, estado de destino e os dados do veículo — para até 8 empresas do nosso diretório</strong>, escolhidas conforme os serviços que você marcou, para que elas entrem em contato com você. Esse envio é a própria finalidade do formulário e acontece com o seu consentimento, manifestado ao enviá-lo. A lista das empresas contatadas é repetida no e-mail de confirmação que você recebe.</p>
        <p>A partir do momento em que recebem seus dados, <strong>essas empresas passam a ser controladoras independentes</strong>, sujeitas às políticas de privacidade delas. Se quiser que uma delas apague seus dados, fale diretamente com ela — e escreva para nós se precisar de ajuda para localizar o contato.</p>
        <p><strong>Você pode usar toda a calculadora, no site e no aplicativo, sem nunca preencher esse formulário.</strong></p>
        <p><strong>6.2. Fornecedores que tratam dados por nossa conta.</strong></p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem do site e estatísticas de audiência (EUA)</li>
          <li><strong>Railway</strong> — hospedagem da API de cálculo (EUA)</li>
          <li><strong>Cloudflare</strong> — distribuição, proteção contra abuso e métricas de tráfego (EUA)</li>
          <li><strong>Resend</strong> — envio dos e-mails dos formulários e da lista de novidades (EUA)</li>
          <li><strong>ScraperAPI</strong> — leitura das páginas públicas de anúncios de veículos (EUA)</li>
          <li><strong>Anthropic</strong> — geração de descrições em português por inteligência artificial (EUA)</li>
          <li><strong>Google</strong> — publicidade no aplicativo, via AdMob (EUA e Irlanda). Não usamos Google no site.</li>
          <li><strong>Apple</strong> — SKAdNetwork, medição de publicidade no aplicativo (EUA)</li>
        </ul>
        <p>Também consultamos fontes públicas que <strong>não recebem dado pessoal nenhum</strong>: o Banco Central do Brasil (cotação PTAX) e a Tabela FIPE.</p>
        <p><strong>6.3. O que não fazemos.</strong> Não vendemos e não alugamos seus dados pessoais. Fora das hipóteses de 6.1 — que é o que você pediu — e 6.2 — que é o necessário para o serviço funcionar —, não compartilhamos seus dados com ninguém, salvo por ordem judicial ou requisição de autoridade competente.</p>
      </Section>

      <Section title="7. Transferência internacional de dados (art. 33 da LGPD)">
        <p>Todos os fornecedores listados em 6.2 estão sediados <strong>fora do Brasil, principalmente nos Estados Unidos</strong>. Seus dados são, portanto, transferidos internacionalmente e processados em servidores fora do território nacional.</p>
        <p>Essas transferências se fundamentam:</p>
        <ul>
          <li>no <strong>art. 33, V</strong>, quando são necessárias para executar o que você pediu — hospedar o site, ler o anúncio que você colou, calcular os tributos, entregar o e-mail que você enviou;</li>
          <li>no <strong>art. 33, VIII — seu consentimento específico</strong>, no caso da publicidade personalizada do aplicativo (AdMob), colhido no formulário de consentimento exibido no aplicativo.</li>
        </ul>
        <p>Você pode nos pedir, pelo contato desta política, informações sobre as garantias adotadas em cada transferência.</p>
      </Section>

      <Section title="8. Base legal de cada tratamento (art. 7º da LGPD)">
        <ul>
          <li><strong>Calcular custos de importação</strong> (site e aplicativo) — art. 7º, V: procedimento preliminar relacionado a contrato, a seu pedido.</li>
          <li><strong>Conta e controle de cota do plano</strong> — art. 7º, V: execução de contrato.</li>
          <li><strong>Enviar seu pedido de orçamento às empresas</strong> — art. 7º, I: seu consentimento.</li>
          <li><strong>Lista de novidades</strong> — art. 7º, I: seu consentimento.</li>
          <li><strong>Cadastro de empresas e fornecedores no diretório</strong> — art. 7º, V e IX.</li>
          <li><strong>Publicidade personalizada no aplicativo</strong> (AdMob, IDFA) — art. 7º, I: seu consentimento.</li>
          <li><strong>Publicidade não personalizada no aplicativo</strong> — art. 7º, IX: legítimo interesse em manter o aplicativo gratuito.</li>
          <li><strong>Registros de acesso, segurança e prevenção a abuso</strong> — art. 7º, IX e art. 16, I, e art. 15 do Marco Civil da Internet.</li>
          <li><strong>Estatísticas agregadas de uso</strong> — dados anonimizados, art. 12.</li>
        </ul>
        <p>Onde o fundamento é o consentimento, você pode revogá-lo a qualquer momento, sem custo. A revogação não afeta o tratamento feito antes dela.</p>
      </Section>

      <Section title="9. Retenção de dados">
        <p>Dados de conta são mantidos enquanto a conta existir e por até 90 dias após o encerramento. Registros de acesso do servidor são mantidos por até 30 dias.</p>
        <p>Os dados enviados por formulário chegam a nós por e-mail e são mantidos <strong>por até 24 meses</strong>, prazo em que ainda podem ser necessários para retomar um atendimento. Você pode pedir a exclusão antes disso a qualquer momento.</p>
        <p>Os dados guardados no aplicativo permanecem no seu aparelho até que você apague o histórico ou desinstale o aplicativo.</p>
      </Section>

      <Section title="10. Seus direitos como titular (arts. 17 a 22 da LGPD)">
        <p>A qualquer momento e gratuitamente, você pode:</p>
        <ul>
          <li>confirmar se tratamos dados seus e <strong>acessá-los</strong> (art. 18, I e II);</li>
          <li><strong>corrigir</strong> dados incompletos, inexatos ou desatualizados (art. 18, III);</li>
          <li>pedir <strong>anonimização, bloqueio ou eliminação</strong> de dados desnecessários, excessivos ou tratados em desconformidade com a lei (art. 18, IV);</li>
          <li>pedir a <strong>portabilidade</strong> a outro fornecedor (art. 18, V);</li>
          <li>pedir a <strong>eliminação</strong> dos dados tratados com base no seu consentimento (art. 18, VI);</li>
          <li>saber <strong>com quem compartilhamos</strong> seus dados (art. 18, VII);</li>
          <li>ser informado sobre a <strong>possibilidade de não consentir e as consequências</strong> da recusa (art. 18, VIII);</li>
          <li><strong>revogar o consentimento</strong> (art. 18, IX);</li>
          <li><strong>opor-se</strong> a tratamento fundado em legítimo interesse (art. 18, § 2º);</li>
          <li>pedir <strong>revisão de decisões automatizadas</strong> que afetem seus interesses (art. 20), incluindo as estimativas geradas pela calculadora;</li>
          <li><strong>peticionar diretamente à ANPD</strong> contra nós (art. 18, § 1º), em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">gov.br/anpd</a>.</li>
        </ul>
        <p><strong>Como exercer.</strong> Escreva para <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>. Responderemos em até <strong>15 dias</strong>, na forma do art. 19, § 1º, II, da LGPD. Podemos pedir informações adicionais só para confirmar sua identidade e evitar que terceiros acessem seus dados.</p>
        <p><strong>Para os dados do aplicativo,</strong> o exercício é direto e imediato: apague o histórico na aba &quot;Mais&quot; ou desinstale o aplicativo. Não precisa nos pedir nada.</p>
      </Section>

      <Section title="11. Crianças e adolescentes (art. 14 da LGPD)">
        <p>Nem o site nem o aplicativo são dirigidos a crianças. O serviço trata de importação de veículos, operação que pressupõe capacidade civil, e <strong>o uso é destinado a maiores de 18 anos</strong>.</p>
        <p>Se soubermos que recebemos dados de uma criança sem o consentimento específico e em destaque de pelo menos um dos pais ou do responsável legal, <strong>eliminaremos esses dados imediatamente</strong>. Se você é responsável e acredita que isso aconteceu, escreva para <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>.</p>
        <p>O aplicativo não é distribuído na categoria infantil da App Store e não é destinado a crianças, na acepção do <em>Children&apos;s Online Privacy Protection Act</em> (COPPA).</p>
      </Section>

      <Section title="12. Segurança">
        <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo transmissão criptografada por HTTPS e armazenamento de senhas em hash irreversível.</p>
      </Section>

      <Section title="13. Incidentes de segurança (art. 48 da LGPD)">
        <p>Se ocorrer incidente de segurança que possa acarretar risco ou dano relevante a você, comunicaremos o fato à <strong>ANPD e a você em até 3 dias úteis</strong>, informando a natureza dos dados afetados, os riscos envolvidos e as medidas adotadas.</p>
      </Section>

      <Section title="14. Alterações nesta política">
        <p>Podemos atualizar esta política. Em caso de alteração relevante, publicaremos a nova versão nesta página, com a data de atualização e um resumo do que mudou.</p>
      </Section>

      <Section title="15. Lei aplicável">
        <p>Esta política é regida pela Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
      </Section>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Voltar para a calculadora</Link>
      </div>
    </article>
  );
}

function PrivacyEN() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: August 2026</p>

      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
        <strong>What changed in this version:</strong> we added the iPhone app, which was
        not covered before; we describe Google AdMob advertising and the advertising
        identifier (IDFA), which exists only in the app — the website uses no Google
        AdSense or any other advertising; we now explain that the quote request sends
        your data to the companies you select; and we detail transfers of data outside
        Brazil.
      </div>

      <Section title="1. Who we are and how to reach us">
        <p>The <strong>carroimportado.com</strong> website and the <strong>Carro Importado</strong> iPhone app are operated by <strong>Tatiane Assink</strong>, as <strong>controller</strong> of personal data under Art. 5, VI of Brazilian Law No. 13,709/2018 (LGPD).</p>
        <p><strong>Data Protection Officer (Art. 41, LGPD):</strong> Tatiane Assink — <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>.</p>
        <p>This policy covers three products: the website, the iPhone app, and the API serving both. Where a rule applies to only one of them, we say so explicitly.</p>
      </Section>

      <Section title="2. Data we collect on the website">
        <ul>
          <li><strong>When you browse</strong> without filling anything in: we require no account, but your IP address and browsing data are processed by the hosting, audience-measurement, and advertising services described in sections 5 and 6.</li>
          <li><strong>When you use the calculator:</strong> the listing link or vehicle data you provide, the destination state, and — if you change them — shipping and exchange rate. We do not link these queries to you.</li>
          <li><strong>When you submit a form</strong> (quote request, company or supplier listing, newsletter): name, email, and, where provided, WhatsApp, city, and state.</li>
          <li><strong>If you create an account:</strong> email and password, the latter stored only as an irreversible bcrypt hash, plus your monthly query count for quota control. Sessions are kept by a token valid for 30 days.</li>
        </ul>
        <p>We do not collect national ID numbers, credit card data, or any other financial or identity document.</p>
      </Section>

      <Section title="3. The iPhone app">
        <p>The app <strong>has no account, no login, and does not ask for your name, email, or phone number.</strong> No directly identifying data is sent to our servers by the app.</p>
        <p><strong>What is stored on your device, and only there:</strong></p>
        <ul>
          <li>A history of up to 25 calculations, with the vehicle, USD price, estimated total in BRL, and the listing link;</li>
          <li>Your progress in the import guide checklist;</li>
          <li>Preferences: destination state, vehicle type, shipping, and exchange rate last used;</li>
          <li>Ad frequency counters, used to limit how often ads appear.</li>
        </ul>
        <p>This data lives in the app&apos;s private area on your iPhone. <strong>We have no access to it and it is not sent to any server.</strong> You can clear the history in the &quot;Mais&quot; tab and delete everything by uninstalling the app.</p>
        <p><strong>What the app sends when you run a calculation:</strong> the listing link or vehicle data, the destination state, and, if changed, shipping and exchange rate. None of it is linked to you.</p>
        <p>The app uses <strong>no</strong> behavioral analytics, usage measurement, or crash-reporting tools.</p>
      </Section>

      <Section title="4. In-app advertising, tracking, and IDFA">
        <p>The app is free and supported by <strong>Google AdMob</strong> advertising. For this, Google may access the <strong>IDFA</strong> (Identifier for Advertisers), the advertising identifier Apple assigns to the device, and information about your interaction with ads.</p>
        <p><strong>How we ask for your permission.</strong> Before showing any ad, the app presents, in this order:</p>
        <ol>
          <li>our own explanatory screen, in Portuguese, stating why advertising exists;</li>
          <li>Google&apos;s consent form (UMP), where you decide about <strong>personalized</strong> advertising;</li>
          <li>Apple&apos;s permission prompt (<em>App Tracking Transparency</em>), which governs access to the IDFA.</li>
        </ol>
        <p><strong>Declining removes no functionality.</strong> The calculator, articles, guide, history, and directories remain identical; ads become non-personalized or stop appearing.</p>
        <p><strong>Changing your mind.</strong> Tracking permission can be revoked at any time under <strong>Settings → Privacy &amp; Security → Tracking</strong> on your iPhone. Where Google&apos;s form offers that option, the app also shows <strong>&quot;Configurações de anúncios&quot;</strong> in the &quot;Mais&quot; tab.</p>
        <p>The app participates in <strong>SKAdNetwork</strong>, Apple&apos;s system for measuring ad effectiveness without identifying you individually.</p>
      </Section>

      <Section title="5. Cookies and advertising on the website">
        <p><strong>The website shows no advertising and uses no advertising cookies.</strong> We do not use Google AdSense or any other ad service on the website — the advertising described in section 4 exists only in the iPhone app.</p>
        <p>The website uses <strong>Vercel Analytics</strong>, which produces aggregate audience statistics without identifying individual visitors and sets no tracking cookie, and <strong>Cloudflare</strong>, which protects the site against abuse and generates traffic metrics. Because of this, the website shows no cookie notice: there is no non-essential cookie to ask consent for.</p>
      </Section>

      <Section title="6. Who we share data with">
        <p><strong>6.1. Quote requests.</strong> When you use the quote request form, <strong>we send the data you provided — name, email, WhatsApp if given, destination state, and the vehicle details — to up to 8 companies from our directory</strong>, selected according to the services you checked, so they can contact you. This transmission is the very purpose of the form and happens with your consent, given when you submit it. The list of companies contacted is repeated in the confirmation email you receive.</p>
        <p>Once they receive your data, <strong>these companies become independent controllers</strong>, subject to their own privacy policies. To have one of them delete your data, contact it directly — write to us if you need help locating the contact.</p>
        <p><strong>You can use the entire calculator, on the website and in the app, without ever filling in this form.</strong></p>
        <p><strong>6.2. Providers processing data on our behalf.</strong></p>
        <ul>
          <li><strong>Vercel</strong> — website hosting and audience statistics (USA)</li>
          <li><strong>Railway</strong> — calculation API hosting (USA)</li>
          <li><strong>Cloudflare</strong> — delivery, abuse protection, and traffic metrics (USA)</li>
          <li><strong>Resend</strong> — delivery of form emails and the newsletter (USA)</li>
          <li><strong>ScraperAPI</strong> — reading public vehicle listing pages (USA)</li>
          <li><strong>Anthropic</strong> — AI-generated Portuguese descriptions (USA)</li>
          <li><strong>Google</strong> — advertising in the app, via AdMob (USA and Ireland). We do not use Google on the website.</li>
          <li><strong>Apple</strong> — SKAdNetwork, in-app ad measurement (USA)</li>
        </ul>
        <p>We also query public sources that <strong>receive no personal data at all</strong>: the Central Bank of Brazil (PTAX rate) and the FIPE table.</p>
        <p><strong>6.3. What we do not do.</strong> We do not sell or rent your personal data. Outside the cases in 6.1 — which is what you asked for — and 6.2 — which is what the service needs to run — we do not share your data with anyone, except by court order or lawful request from a competent authority.</p>
      </Section>

      <Section title="7. International data transfers (Art. 33, LGPD)">
        <p>All providers listed in 6.2 are based <strong>outside Brazil, mainly in the United States</strong>. Your data is therefore transferred internationally and processed on servers outside Brazilian territory.</p>
        <p>These transfers are based on:</p>
        <ul>
          <li><strong>Art. 33, V</strong>, where they are necessary to perform what you requested — hosting the site, reading the listing you pasted, calculating the taxes, delivering the email you sent;</li>
          <li><strong>Art. 33, VIII — your specific consent</strong>, for the app's personalized advertising (AdMob), obtained through the in-app consent form.</li>
        </ul>
        <p>You may ask us, through the contact in this policy, for information about the safeguards applied to each transfer.</p>
      </Section>

      <Section title="8. Legal basis for each processing activity (Art. 7, LGPD)">
        <ul>
          <li><strong>Calculating import costs</strong> (website and app) — Art. 7, V: preliminary procedure related to a contract, at your request.</li>
          <li><strong>Account and plan quota control</strong> — Art. 7, V: performance of a contract.</li>
          <li><strong>Sending your quote request to companies</strong> — Art. 7, I: your consent.</li>
          <li><strong>Newsletter</strong> — Art. 7, I: your consent.</li>
          <li><strong>Company and supplier directory listings</strong> — Art. 7, V and IX.</li>
          <li><strong>Personalized advertising in the app</strong> (AdMob, IDFA) — Art. 7, I: your consent.</li>
          <li><strong>Non-personalized advertising in the app</strong> — Art. 7, IX: legitimate interest in keeping the app free.</li>
          <li><strong>Access logs, security, and abuse prevention</strong> — Art. 7, IX and Art. 16, I, and Art. 15 of the Brazilian Civil Rights Framework for the Internet.</li>
          <li><strong>Aggregate usage statistics</strong> — anonymized data, Art. 12.</li>
        </ul>
        <p>Where the basis is consent, you may withdraw it at any time, free of charge. Withdrawal does not affect processing carried out beforehand.</p>
      </Section>

      <Section title="9. Data retention">
        <p>Account data is kept while the account exists and for up to 90 days after closure. Server access logs are kept for up to 30 days.</p>
        <p>Data submitted through forms reaches us by email and is kept for <strong>up to 24 months</strong>, the period during which it may still be needed to resume a request. You may ask for deletion sooner at any time.</p>
        <p>Data stored in the app remains on your device until you clear the history or uninstall the app.</p>
      </Section>

      <Section title="10. Your rights as a data subject (Arts. 17–22, LGPD)">
        <p>At any time and free of charge, you may:</p>
        <ul>
          <li>confirm whether we process your data and <strong>access it</strong> (Art. 18, I and II);</li>
          <li><strong>correct</strong> incomplete, inaccurate, or outdated data (Art. 18, III);</li>
          <li>request <strong>anonymization, blocking, or deletion</strong> of unnecessary or excessive data, or data processed unlawfully (Art. 18, IV);</li>
          <li>request <strong>portability</strong> to another provider (Art. 18, V);</li>
          <li>request <strong>deletion</strong> of data processed on the basis of your consent (Art. 18, VI);</li>
          <li>learn <strong>who we share</strong> your data with (Art. 18, VII);</li>
          <li>be informed of the <strong>option not to consent and the consequences</strong> of refusal (Art. 18, VIII);</li>
          <li><strong>withdraw consent</strong> (Art. 18, IX);</li>
          <li><strong>object</strong> to processing based on legitimate interest (Art. 18, § 2);</li>
          <li>request <strong>review of automated decisions</strong> affecting your interests (Art. 20), including estimates produced by the calculator;</li>
          <li><strong>petition the ANPD</strong> directly against us (Art. 18, § 1), at <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">gov.br/anpd</a>.</li>
        </ul>
        <p><strong>How to exercise these rights.</strong> Write to <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>. We will respond within <strong>15 days</strong>, per Art. 19, § 1, II of the LGPD. We may request additional information solely to verify your identity and prevent third parties from accessing your data.</p>
        <p><strong>For data held in the app,</strong> you can act directly and immediately: clear the history in the &quot;Mais&quot; tab or uninstall the app. No request to us is needed.</p>
      </Section>

      <Section title="11. Children and adolescents (Art. 14, LGPD)">
        <p>Neither the website nor the app is directed to children. The service concerns vehicle importation, an operation that presupposes legal capacity, and <strong>use is intended for people aged 18 and over</strong>.</p>
        <p>If we learn that we have received data from a child without the specific, prominent consent of at least one parent or legal guardian, <strong>we will delete that data immediately</strong>. If you are a guardian and believe this has happened, write to <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>.</p>
        <p>The app is not distributed in the App Store Kids Category and is not directed to children within the meaning of the <em>Children&apos;s Online Privacy Protection Act</em> (COPPA).</p>
      </Section>

      <Section title="12. Security">
        <p>We employ technical and organizational measures to protect your data, including HTTPS-encrypted transmission and irreversible password hashing.</p>
      </Section>

      <Section title="13. Security incidents (Art. 48, LGPD)">
        <p>If a security incident occurs that may pose relevant risk or harm to you, we will notify <strong>the ANPD and you within 3 business days</strong>, describing the nature of the data affected, the risks involved, and the measures taken.</p>
      </Section>

      <Section title="14. Changes to this policy">
        <p>We may update this policy. For material changes, we will publish the new version on this page, with the update date and a summary of what changed.</p>
      </Section>

      <Section title="15. Governing law">
        <p>This policy is governed by Brazil&apos;s General Data Protection Law (LGPD — Law No. 13,709/2018).</p>
      </Section>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to calculator</Link>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
