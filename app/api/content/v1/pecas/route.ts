import { NextRequest } from "next/server";
import { PECAS, ESPECIALIDADE_CORES } from "../../../../data/pecas";
import { contentResponse } from "../../../../lib/content/respond";
import { coresToHex } from "../../../../lib/content/palette";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 3600;

export async function GET(req: NextRequest) {
  return contentResponse(
    req,
    {
      pecas: PECAS,
      especialidadeCores: coresToHex(ESPECIALIDADE_CORES),
    },
    { sMaxAge: S_MAX_AGE }
  );
}
