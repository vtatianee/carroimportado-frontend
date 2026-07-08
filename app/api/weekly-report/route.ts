import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";
const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // opcional (plano hobby = sem team)
const STATS_TOKEN = process.env.STATS_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;
const REPORT_EMAIL = process.env.REPORT_EMAIL || "arche.boost@gmail.com";

export async function GET(req: NextRequest) {
  // Vercel injeta Authorization: Bearer <CRON_SECRET> nas chamadas de cron
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ── 1. Vercel Analytics ────────────────────────────────────────────────────
  let analytics: {
    pageViews?: number;
    visitors?: number;
    topPages?: { path: string; visitors: number }[];
  } = {};

  if (VERCEL_ACCESS_TOKEN && VERCEL_PROJECT_ID) {
    try {
      const params = new URLSearchParams({
        projectId: VERCEL_PROJECT_ID,
        from: from.toISOString().slice(0, 10),
        to: now.toISOString().slice(0, 10),
        environment: "production",
        ...(VERCEL_TEAM_ID ? { teamId: VERCEL_TEAM_ID } : {}),
      });

      const headers = {
        Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`,
      };

      const [statsRes, pathsRes] = await Promise.all([
        fetch(`https://vercel.com/api/v1/web/insights/stats?${params}`, { headers }),
        fetch(`https://vercel.com/api/v1/web/insights/path?${params}&limit=5`, { headers }),
      ]);

      if (statsRes.ok) {
        const { data } = await statsRes.json();
        analytics.pageViews = data?.pageViews ?? 0;
        analytics.visitors = data?.visitors ?? 0;
      }

      if (pathsRes.ok) {
        const { data } = await pathsRes.json();
        analytics.topPages = (data ?? []).map((p: { path: string; visitors: number }) => ({
          path: p.path,
          visitors: p.visitors,
        }));
      }
    } catch (e) {
      console.error("[weekly-report] Vercel Analytics error:", e);
    }
  }

  // ── 2. Buscas na calculadora (Railway backend) ─────────────────────────────
  let calculatorTotal = 0;
  let calculatorByDay: { date: string; count: number }[] = [];

  if (STATS_TOKEN) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stats/weekly`, {
        headers: { "x-stats-token": STATS_TOKEN },
      });
      if (res.ok) {
        const data = await res.json();
        calculatorTotal = data.total_week ?? 0;
        calculatorByDay = data.by_day ?? [];
      }
    } catch (e) {
      console.error("[weekly-report] Backend stats error:", e);
    }
  }

  // ── 3. Monta e envia email ─────────────────────────────────────────────────
  const weekLabel = `${from.toLocaleDateString("pt-BR")} – ${now.toLocaleDateString("pt-BR")}`;

  const topPagesHtml =
    analytics.topPages && analytics.topPages.length > 0
      ? `<table cellpadding="6" style="border-collapse:collapse;font-size:13px;width:100%">
           <tr style="background:#f1f5f9"><th style="text-align:left">Página</th><th style="text-align:right">Visitantes</th></tr>
           ${analytics.topPages
             .map(
               (p) =>
                 `<tr><td style="color:#334155">${p.path}</td><td style="text-align:right;color:#334155">${p.visitors}</td></tr>`
             )
             .join("")}
         </table>`
      : "<p style='color:#94a3b8;font-size:13px'>Dados indisponíveis — configure VERCEL_ACCESS_TOKEN.</p>";

  const calculatorRows =
    calculatorByDay.length > 0
      ? calculatorByDay
          .map((d) => `<tr><td style="color:#334155">${d.date}</td><td style="text-align:right;color:#334155">${d.count}</td></tr>`)
          .join("")
      : `<tr><td colspan="2" style="color:#94a3b8;font-size:13px">Nenhuma busca registrada ainda.</td></tr>`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h2 style="margin-bottom:4px">📊 Relatório semanal — carroimportado.com</h2>
      <p style="color:#64748b;font-size:13px;margin-top:0">${weekLabel}</p>

      <h3 style="color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px">Visitantes e pageviews</h3>
      <table cellpadding="8" style="border-collapse:collapse;font-size:14px">
        <tr>
          <td style="color:#64748b">Visitantes únicos</td>
          <td style="font-weight:600">${analytics.visitors ?? "—"}</td>
        </tr>
        <tr>
          <td style="color:#64748b">Pageviews</td>
          <td style="font-weight:600">${analytics.pageViews ?? "—"}</td>
        </tr>
        <tr>
          <td style="color:#64748b">Buscas na calculadora</td>
          <td style="font-weight:600">${calculatorTotal}</td>
        </tr>
      </table>

      <h3 style="color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:24px">Top páginas</h3>
      ${topPagesHtml}

      <h3 style="color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:24px">Buscas por dia</h3>
      <table cellpadding="6" style="border-collapse:collapse;font-size:13px;width:100%">
        <tr style="background:#f1f5f9"><th style="text-align:left">Data</th><th style="text-align:right">Buscas</th></tr>
        ${calculatorRows}
      </table>

      <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0"/>
      <p style="color:#94a3b8;font-size:12px">Gerado automaticamente toda segunda-feira às 9h — carroimportado.com</p>
    </div>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[weekly-report] RESEND_API_KEY não configurada — apenas logando.");
    console.log("[weekly-report]", { analytics, calculatorTotal });
    return NextResponse.json({ ok: true, dry_run: true });
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: "carroimportado.com <onboarding@resend.dev>",
    to: REPORT_EMAIL,
    subject: `Relatório semanal carroimportado.com — ${weekLabel}`,
    html,
  });

  return NextResponse.json({ ok: true, debug: result });
}
