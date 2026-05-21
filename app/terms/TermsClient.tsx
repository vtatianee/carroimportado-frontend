"use client";

import { useState } from "react";
import Link from "next/link";

export default function TermsClient() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  return (
    <main className="flex-1">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">carroimportado.com</span>
          </Link>
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
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {lang === "pt" ? <TermsPT /> : <TermsEN />}
      </div>
    </main>
  );
}

function TermsPT() {
  return (
    <article>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Termos de Uso</h1>
      <p className="text-slate-500 text-sm mb-8">Última atualização: maio de 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        <strong>⚠️ Aviso importante:</strong> O carroimportado.com é uma ferramenta de <strong>estimativa informativa</strong>. Os valores apresentados <strong>não constituem assessoria jurídica, aduaneira, financeira ou fiscal</strong>. Sempre consulte um despachante aduaneiro habilitado e um advogado especializado antes de tomar qualquer decisão de importação.
      </div>

      <Section title="1. Aceitação dos termos">
        <p>Ao acessar ou utilizar o carroimportado.com, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>
      </Section>

      <Section title="2. Descrição do serviço">
        <p>O carroimportado.com é uma calculadora online que estima os custos de importação de veículos dos Estados Unidos para o Brasil, com base em dados públicos de anúncios (Cars.com) e nas alíquotas tributárias vigentes (II, IPI, PIS, COFINS, ICMS). O serviço também fornece comparativos com a Tabela FIPE e cotação do dólar via Banco Central do Brasil (PTAX).</p>
      </Section>

      <Section title="3. Natureza das estimativas">
        <p>Os valores calculados são <strong>estimativas</strong> baseadas em:</p>
        <ul>
          <li>Dados do anúncio disponíveis no momento da consulta;</li>
          <li>Alíquotas tributárias federais e estaduais vigentes;</li>
          <li>Cotação PTAX do Banco Central do Brasil;</li>
          <li>Estimativas de frete marítimo e despesas aduaneiras típicas.</li>
        </ul>
        <p>Os valores reais podem variar em função de: classificação fiscal do veículo (NCM), regimes aduaneiros especiais, negociação com despachantes, variações cambiais, taxas portuárias e outros fatores. <strong>Não nos responsabilizamos por diferenças entre as estimativas e os custos reais.</strong></p>
      </Section>

      <Section title="4. Uso aceitável">
        <p>Você concorda em utilizar o serviço apenas para fins informativos pessoais. É expressamente proibido:</p>
        <ul>
          <li>Usar o serviço de forma automatizada (bots, scrapers, scripts);</li>
          <li>Sobrecarregar os servidores com requisições excessivas;</li>
          <li>Reproduzir, redistribuir ou revender os dados gerados pelo serviço sem autorização;</li>
          <li>Utilizar o serviço para fins ilegais ou que violem direitos de terceiros.</li>
        </ul>
      </Section>

      <Section title="5. Propriedade intelectual">
        <p>Todo o conteúdo do carroimportado.com — incluindo código, design, textos e funcionalidades — é propriedade de Tatiane Assink e protegido por leis de propriedade intelectual. É proibida a reprodução total ou parcial sem autorização prévia por escrito.</p>
        <p>Os dados de anúncios de veículos são obtidos de fontes públicas (Cars.com) e pertencem aos respectivos anunciantes.</p>
      </Section>

      <Section title="6. Limitação de responsabilidade">
        <p>O serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;, sem garantias de qualquer tipo. Em nenhuma hipótese seremos responsáveis por:</p>
        <ul>
          <li>Decisões de importação tomadas com base nas estimativas do serviço;</li>
          <li>Diferenças entre os valores estimados e os custos reais de importação;</li>
          <li>Indisponibilidade temporária do serviço;</li>
          <li>Imprecisões nos dados de anúncios fornecidos por terceiros.</li>
        </ul>
      </Section>

      <Section title="7. Modificações do serviço">
        <p>Reservamo-nos o direito de alterar, suspender ou encerrar o serviço a qualquer momento, sem aviso prévio. Também podemos atualizar estes Termos de Uso periodicamente. O uso continuado do serviço após qualquer alteração constitui aceitação dos novos termos.</p>
      </Section>

      <Section title="8. Publicidade">
        <p>O serviço pode exibir anúncios do Google AdSense. Não somos responsáveis pelo conteúdo dos anúncios exibidos.</p>
      </Section>

      <Section title="9. Lei aplicável e foro">
        <p>Estes Termos de Uso são regidos pelas leis do Brasil. Fica eleito o foro da comarca de São Paulo, SP, para dirimir quaisquer controvérsias decorrentes destes termos.</p>
      </Section>

      <Section title="10. Contato">
        <p>Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a></p>
      </Section>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Voltar para a calculadora</Link>
      </div>
    </article>
  );
}

function TermsEN() {
  return (
    <article>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Use</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: May 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        <strong>⚠️ Important notice:</strong> carroimportado.com is an <strong>informational estimation tool</strong>. The values presented <strong>do not constitute legal, customs, financial, or tax advice</strong>. Always consult a licensed customs broker and a specialized attorney before making any import decision.
      </div>

      <Section title="1. Acceptance of terms">
        <p>By accessing or using carroimportado.com, you agree to these Terms of Use. If you do not agree, please do not use the service.</p>
      </Section>

      <Section title="2. Service description">
        <p>carroimportado.com is an online calculator that estimates the costs of importing vehicles from the United States to Brazil, based on public listing data (Cars.com) and applicable tax rates (II, IPI, PIS, COFINS, ICMS). The service also provides comparisons with the FIPE Table and USD/BRL exchange rates from Brazil&apos;s Central Bank (PTAX).</p>
      </Section>

      <Section title="3. Nature of estimates">
        <p>The calculated values are <strong>estimates</strong> based on:</p>
        <ul>
          <li>Listing data available at the time of the query;</li>
          <li>Current federal and state tax rates;</li>
          <li>Brazil&apos;s Central Bank PTAX exchange rate;</li>
          <li>Typical ocean freight and customs clearance cost estimates.</li>
        </ul>
        <p>Actual costs may vary due to: vehicle tax classification (NCM), special customs regimes, broker negotiations, exchange rate fluctuations, port fees, and other factors. <strong>We are not responsible for differences between estimates and actual costs.</strong></p>
      </Section>

      <Section title="4. Acceptable use">
        <p>You agree to use the service for personal informational purposes only. The following are expressly prohibited:</p>
        <ul>
          <li>Automated use (bots, scrapers, scripts);</li>
          <li>Overloading servers with excessive requests;</li>
          <li>Reproducing, redistributing, or reselling data generated by the service without authorization;</li>
          <li>Using the service for illegal purposes or in violation of third-party rights.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual property">
        <p>All content on carroimportado.com — including code, design, text, and features — is the property of Tatiane Assink and protected by intellectual property laws. Reproduction in whole or in part without prior written authorization is prohibited.</p>
        <p>Vehicle listing data is obtained from public sources (Cars.com) and belongs to the respective advertisers.</p>
      </Section>

      <Section title="6. Limitation of liability">
        <p>The service is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind. We shall not be liable for:</p>
        <ul>
          <li>Import decisions made based on the service&apos;s estimates;</li>
          <li>Differences between estimated and actual import costs;</li>
          <li>Temporary service unavailability;</li>
          <li>Inaccuracies in listing data provided by third parties.</li>
        </ul>
      </Section>

      <Section title="7. Modifications">
        <p>We reserve the right to modify, suspend, or discontinue the service at any time without notice. We may also update these Terms of Use periodically. Continued use of the service after any change constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="8. Advertising">
        <p>The service may display Google AdSense advertisements. We are not responsible for the content of displayed ads.</p>
      </Section>

      <Section title="9. Governing law">
        <p>These Terms of Use are governed by the laws of Brazil. Any disputes shall be resolved in the courts of São Paulo, SP, Brazil.</p>
      </Section>

      <Section title="10. Contact">
        <p>For questions about these Terms of Use, contact us at: <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a></p>
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
