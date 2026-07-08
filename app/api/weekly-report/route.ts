import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";
  const STATS_TOKEN = process.env.STATS_TOKEN;
  const CRON_SECRET = process.env.CRON_SECRET;
  const REPORT_EMAIL = process.env.REPORT_EMAIL || "arche.boost@gmail.com";
  const CF_ZONE_ID = process.env.CF_ZONE_ID;
  const CF_API_TOKEN = process.env.CF_API_TOKEN;

  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fromDate = from.toISOString().slice(0, 10);
  const toDate = now.toISOString().slice(0, 10);

  // ── 1. Cloudflare Analytics ────────────────────────────────────────────────
  let cfVisitors = 0;
  let cfRequests = 0;
  let cfPageViews = 0;
  let cfByDay: { date: string; visitors: number; requests: number }[] = [];

  if (CF_ZONE_ID && CF_API_TOKEN) {
    try {
      const query = `
        query {
          viewer {
            zones(filter: { zoneTag: "${CF_ZONE_ID}" }) {
              httpRequests1dGroups(
                limit: 7
                filter: { date_geq: "${fromDate}", date_leq: "${toDate}" }
                orderBy: [date_ASC]
              ) {
                date
                sum { requests pageViews }
                uniq { uniques }
              }
            }
          }
        }
      `;

      const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CF_API_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const json = await res.json();
        const groups = json?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
        for (const g of groups) {
          cfVisitors += g.uniq?.uniques ?? 0;
          cfRequests += g.sum?.requests ?? 0;
          cfPageViews += g.sum?.pageViews ?? 0;
          cfByDay.push({
            date: g.date,
            visitors: g.uniq?.uniques ?? 0,
            requests: g.sum?.requests ?? 0,
          });
        }
      } else {
        console.error("[weekly-report] CF error:", res.status, await res.text());
      }
    } catch (e) {
      console.error("[weekly-report] CF Analytics error:", e);
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

  const cfSection = CF_ZONE_ID && CF_API_TOKEN
    ? `
      <h3 style="color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px">Tráfego (Cloudflare)</h3>
      <table cellpadding="8" style="border-collapse:collapse;font-size:14px">
        <tr>
          <td style="color:#64748b">Visitantes únicos</td>
          <td style="font-weight:600">${cfVisitors.toLocaleString("pt-BR")}</td>
        </tr>
        <tr>
          <td style="color:#64748b">Pageviews</td>
          <td style="font-weight:600">${cfPageViews.toLocaleString("pt-BR")}</td>
        </tr>
        <tr>
          <td style="color:#64748b">Total de requests</td>
          <td style="font-weight:600">${cfRequests.toLocaleString("pt-BR")}</td>
        </tr>
      </table>
      ${cfByDay.length > 0 ? `
      <table cellpadding="6" style="border-collapse:collapse;font-size:12px;width:100%;margin-top:8px">
        <tr style="background:#f1f5f9">
          <th style="text-align:left">Data</th>
          <th style="text-align:right">Visitantes</th>
          <th style="text-align:right">Requests</th>
        </tr>
        ${cfByDay.map(d => `<tr>
          <td style="color:#334155">${d.date}</td>
          <td style="text-align:right;color:#334155">${d.visitors.toLocaleString("pt-BR")}</td>
          <td style="text-align:right;color:#334155">${d.requests.toLocaleString("pt-BR")}</td>
        </tr>`).join("")}
      </table>` : ""}
    `
    : `<p style="color:#94a3b8;font-size:13px">Configure CF_ZONE_ID e CF_API_TOKEN no Vercel para ver tráfego.</p>`;

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

      ${cfSection}

      <h3 style="color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:24px">Calculadora</h3>
      <table cellpadding="8" style="border-collapse:collapse;font-size:14px">
        <tr>
          <td style="color:#64748b">Buscas na semana</td>
          <td style="font-weight:600">${calculatorTotal}</td>
        </tr>
      </table>

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
    return NextResponse.json({ ok: true, dry_run: true });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "carroimportado.com <onboarding@resend.dev>",
    to: REPORT_EMAIL,
    subject: `Relatório semanal carroimportado.com — ${weekLabel}`,
    html,
  });

  return NextResponse.json({ ok: true });
}
