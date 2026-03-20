// [SOURCE] apps/dashboard/README.md — SDR, CS e Finance
import type { DashboardSnapshot } from "./dashboard-types";

export const DASHBOARD_STATIC_SNAPSHOT: DashboardSnapshot = {
  attribution: [
    { source: "Outbound", leads: 84, conversion: "22%", cac: "R$ 680" },
    { source: "Indicação", leads: 51, conversion: "34%", cac: "R$ 220" },
    { source: "Inbound", leads: 67, conversion: "27%", cac: "R$ 390" }
  ],
  contracts: [
    { customer: "Atlas Log", status: "Renovação em 30 dias", mrr: "R$ 18.000", owner: "Camila" },
    { customer: "Nexa Care", status: "Reajuste em aprovação", mrr: "R$ 12.500", owner: "Rafael" },
    { customer: "Loop Retail", status: "Assinatura ativa", mrr: "R$ 9.800", owner: "Ana" }
  ],
  finance: [
    { label: "MRR", value: "R$ 228.000", delta: "+8,1%" },
    { label: "Cash In", value: "R$ 311.400", delta: "+5,4%" },
    { label: "Inadimplência", value: "2,3%", delta: "-0,4pp" }
  ],
  healthScore: [
    { client: "Atlas Log", score: 87, risk: "baixo", nps: 61 },
    { client: "Nexa Care", score: 72, risk: "médio", nps: 44 },
    { client: "Loop Retail", score: 58, risk: "alto", nps: 31 }
  ],
  pipeline: [
    { stage: "Prospecção", value: 38, trend: "+12%" },
    { stage: "Diagnóstico", value: 24, trend: "+5%" },
    { stage: "Negociação", value: 16, trend: "-3%" },
    { stage: "Fechamento", value: 9, trend: "+9%" }
  ]
};
