import { NextRequest } from "next/server";
import { EMPRESAS, CATEGORIAS_RFQ, ESPECIALIDADE_CORES } from "../../../../data/empresas";
import { contentResponse } from "../../../../lib/content/respond";
import { coresToHex } from "../../../../lib/content/palette";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 3600;

export async function GET(req: NextRequest) {
  return contentResponse(
    req,
    {
      empresas: EMPRESAS,
      categorias: CATEGORIAS_RFQ,
      // Hex derivado das classes Tailwind — o site ignora este campo e segue
      // usando as classes; o app não tem como interpretar "bg-blue-100".
      especialidadeCores: coresToHex(ESPECIALIDADE_CORES),
    },
    { sMaxAge: S_MAX_AGE }
  );
}
