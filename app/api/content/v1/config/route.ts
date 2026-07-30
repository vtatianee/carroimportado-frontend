import { NextRequest } from "next/server";
import { APP_CONFIG } from "../../../../data/app-config";
import { contentResponse } from "../../../../lib/content/respond";

export const dynamic = "force-dynamic";

// 60s: um flag desligado precisa chegar no app em ~1 minuto, não em 1 hora.
const S_MAX_AGE = 60;

export async function GET(req: NextRequest) {
  return contentResponse(req, APP_CONFIG, { sMaxAge: S_MAX_AGE });
}
