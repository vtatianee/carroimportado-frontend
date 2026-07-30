import { NextRequest } from "next/server";
import { STEPS, COSTS_SUMMARY, CHECKLIST_GROUPS } from "../../../../data/guia";
import { contentResponse } from "../../../../lib/content/respond";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 3600;

// Mesma chave usada pelo ChecklistClient no localStorage. Vai no payload para
// que app e site possam convergir o estado do checklist no futuro.
const CHECKLIST_STORAGE_KEY = "carroimportado_checklist_v1";

export async function GET(req: NextRequest) {
  return contentResponse(
    req,
    {
      steps: STEPS,
      costsSummary: COSTS_SUMMARY,
      checklist: CHECKLIST_GROUPS,
      checklistStorageKey: CHECKLIST_STORAGE_KEY,
    },
    { sMaxAge: S_MAX_AGE }
  );
}
