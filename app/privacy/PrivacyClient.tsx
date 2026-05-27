"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrivacyClient() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  return (
    <main className="flex-1">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500" />
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">
              carro<span className="text-blue-600">importado</span>.com
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 mr-2">
              <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">Calculadora</Link>
              <Link href="/guia" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">Guia</Link>
              <Link href="/guia" className="text-sm text-white font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">Checklist</Link>
            </nav>
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
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {lang === "pt" ? <PrivacyPT /> : <PrivacyEN />}
      </div>
    </main>
  );
}

function PrivacyPT() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidade</h1>
      <p className="text-slate-500 text-sm mb-8">Última atualização: maio de 2026</p>

      <Section title="1. Quem somos">
        <p>O <strong>carroimportado.com</strong> é operado por Tatiane Assink. Para entrar em contato, envie um e-mail para <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a>.</p>
      </Section>

      <Section title="2. Dados que coletamos">
        <p>Coletamos apenas o mínimo necessário para prestar o serviço:</p>
        <ul>
          <li><strong>Visitantes não cadastrados:</strong> nenhum dado pessoal identificável é coletado. O endereço IP pode ser processado temporariamente pelos servidores de hospedagem (Railway/Vercel) para fins operacionais.</li>
          <li><strong>Usuários registrados (quando disponível):</strong> nome, endereço de e-mail e senha (armazenada em formato de hash irreversível bcrypt). Também registramos a quantidade de consultas realizadas no mês para controle de cotas do plano contratado.</li>
        </ul>
        <p>Não coletamos dados de cartão de crédito, CPF ou qualquer outro dado financeiro ou de identidade.</p>
      </Section>

      <Section title="3. Finalidade do tratamento">
        <p>Os dados são utilizados exclusivamente para:</p>
        <ul>
          <li>Prestar o serviço de estimativa de custos de importação;</li>
          <li>Controlar o número de consultas mensais por plano;</li>
          <li>Exibir anúncios relevantes via Google AdSense.</li>
        </ul>
      </Section>

      <Section title="4. Cookies">
        <p>Utilizamos cookies de terceiros do <strong>Google AdSense</strong> para exibir anúncios relevantes. Esses cookies podem coletar informações sobre sua navegação para personalizar a publicidade. Para mais informações, consulte a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Política de Privacidade do Google</a>.</p>
        <p>Você pode gerenciar ou desativar cookies nas configurações do seu navegador, ou visitar <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">aboutads.info</a> para optar por não receber publicidade personalizada.</p>
      </Section>

      <Section title="5. Compartilhamento com terceiros">
        <p>Seus dados podem ser processados pelos seguintes fornecedores de infraestrutura, exclusivamente para a prestação do serviço:</p>
        <ul>
          <li><strong>Railway</strong> — hospedagem do backend (EUA)</li>
          <li><strong>Vercel</strong> — hospedagem do frontend (EUA)</li>
          <li><strong>ScraperAPI</strong> — coleta de dados de anúncios de veículos (EUA)</li>
          <li><strong>Anthropic</strong> — geração de descrições em português via IA (EUA)</li>
          <li><strong>Google AdSense</strong> — exibição de anúncios (EUA)</li>
        </ul>
        <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>
      </Section>

      <Section title="6. Retenção de dados">
        <p>Os dados de conta são mantidos enquanto a conta estiver ativa e por até 90 dias após o encerramento, período necessário para resolução de eventuais disputas. Logs de servidor são mantidos por no máximo 30 dias.</p>
      </Section>

      <Section title="7. Seus direitos (LGPD — Lei 13.709/2018)">
        <p>Como titular de dados, você tem os seguintes direitos garantidos pela Lei Geral de Proteção de Dados (LGPD):</p>
        <ul>
          <li>Confirmação da existência de tratamento de dados;</li>
          <li>Acesso aos dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade dos dados;</li>
          <li>Eliminação dos dados tratados com base no consentimento;</li>
          <li>Informação sobre compartilhamento com terceiros;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <p>Para exercer qualquer um desses direitos, envie um e-mail para <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a>. Responderemos em até 15 dias úteis.</p>
      </Section>

      <Section title="8. Base legal">
        <p>O tratamento de dados é realizado com base no <strong>legítimo interesse</strong> para prestação do serviço solicitado, e no <strong>consentimento</strong> para fins publicitários (cookies do AdSense).</p>
      </Section>

      <Section title="9. Segurança">
        <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados, incluindo transmissão criptografada via HTTPS e armazenamento de senhas em hash irreversível.</p>
      </Section>

      <Section title="10. Alterações nesta política">
        <p>Podemos atualizar esta Política de Privacidade periodicamente. Em caso de alterações relevantes, publicaremos a nova versão nesta página com a data de atualização. Recomendamos que você a consulte regularmente.</p>
      </Section>

      <Section title="11. Lei aplicável">
        <p>Esta política é regida pela Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). O foro competente para dirimir eventuais controvérsias é o da comarca de São Paulo, SP, Brasil.</p>
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
      <p className="text-slate-500 text-sm mb-8">Last updated: May 2026</p>

      <Section title="1. Who we are">
        <p><strong>carroimportado.com</strong> is operated by Tatiane Assink. To contact us, please email <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a>.</p>
      </Section>

      <Section title="2. Data we collect">
        <p>We collect only the minimum necessary to provide the service:</p>
        <ul>
          <li><strong>Non-registered visitors:</strong> no personally identifiable data is collected. IP addresses may be temporarily processed by hosting servers (Railway/Vercel) for operational purposes.</li>
          <li><strong>Registered users (when available):</strong> name, email address, and password (stored as an irreversible bcrypt hash). We also record the number of monthly queries for subscription quota control.</li>
        </ul>
        <p>We do not collect credit card numbers, social security numbers, or any other financial or identity data.</p>
      </Section>

      <Section title="3. Purpose of processing">
        <p>Data is used exclusively for:</p>
        <ul>
          <li>Providing the vehicle import cost estimation service;</li>
          <li>Controlling monthly query counts by subscription plan;</li>
          <li>Displaying relevant ads via Google AdSense.</li>
        </ul>
      </Section>

      <Section title="4. Cookies">
        <p>We use third-party <strong>Google AdSense</strong> cookies to display relevant advertisements. These cookies may collect information about your browsing behavior to personalize ads. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google&apos;s Privacy Policy</a>.</p>
        <p>You can manage or disable cookies in your browser settings, or visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">aboutads.info</a> to opt out of personalized advertising.</p>
      </Section>

      <Section title="5. Third-party sharing">
        <p>Your data may be processed by the following infrastructure providers, solely for service delivery:</p>
        <ul>
          <li><strong>Railway</strong> — backend hosting (USA)</li>
          <li><strong>Vercel</strong> — frontend hosting (USA)</li>
          <li><strong>ScraperAPI</strong> — vehicle listing data collection (USA)</li>
          <li><strong>Anthropic</strong> — AI-generated descriptions (USA)</li>
          <li><strong>Google AdSense</strong> — ad delivery (USA)</li>
        </ul>
        <p>We do not sell, rent, or share your personal data with third parties for commercial purposes.</p>
      </Section>

      <Section title="6. Data retention">
        <p>Account data is retained while the account is active and for up to 90 days after closure. Server logs are retained for a maximum of 30 days.</p>
      </Section>

      <Section title="7. Your rights (LGPD)">
        <p>Under Brazil&apos;s General Data Protection Law (LGPD — Law No. 13,709/2018), you have the right to:</p>
        <ul>
          <li>Confirmation that your data is being processed;</li>
          <li>Access your data;</li>
          <li>Correct incomplete, inaccurate, or outdated data;</li>
          <li>Anonymization, blocking, or deletion of unnecessary data;</li>
          <li>Data portability;</li>
          <li>Deletion of data processed based on consent;</li>
          <li>Information about third-party sharing;</li>
          <li>Withdrawal of consent.</li>
        </ul>
        <p>To exercise any of these rights, email <a href="mailto:arche.boost@gmail.com" className="text-blue-600 underline">arche.boost@gmail.com</a>. We will respond within 15 business days.</p>
      </Section>

      <Section title="8. Legal basis">
        <p>Data processing is based on <strong>legitimate interest</strong> for service delivery and <strong>consent</strong> for advertising purposes (AdSense cookies).</p>
      </Section>

      <Section title="9. Security">
        <p>We employ appropriate technical and organizational measures to protect your data, including HTTPS encryption and irreversible password hashing.</p>
      </Section>

      <Section title="10. Changes to this policy">
        <p>We may update this Privacy Policy periodically. For material changes, we will publish the new version on this page with an updated date.</p>
      </Section>

      <Section title="11. Governing law">
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
