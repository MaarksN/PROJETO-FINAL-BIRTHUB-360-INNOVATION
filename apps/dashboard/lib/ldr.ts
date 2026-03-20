// [SOURCE] apps/dashboard/README.md — LDR
import type { AttributionItem, LeadIntent, LeadScoringItem, LeadTier } from "./dashboard-types";

const ENRICHMENT_BY_SOURCE: Record<string, { segment: string; region: string; signal: string }> = {
  outbound: {
    segment: "Mid-Market SaaS",
    region: "BR + LATAM",
    signal: "Expansão comercial ativa"
  },
  inbound: {
    segment: "B2B Growth",
    region: "Brasil",
    signal: "Busca por eficiência de funil"
  },
  indicação: {
    segment: "Enterprise Services",
    region: "Brasil",
    signal: "Confiança alta por referral"
  }
};

function parsePercent(value: string): number {
  const sanitized = value.replace("%", "").replace(",", ".").trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCurrency(value: string): number {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveTier(score: number): LeadTier {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  return "C";
}

function resolveIntent(score: number): LeadIntent {
  if (score >= 80) return "alto";
  if (score >= 60) return "médio";
  return "baixo";
}

export function buildLeadScoringItems(attribution: AttributionItem[]): LeadScoringItem[] {
  return attribution.map((item, index) => {
    const sourceKey = item.source.trim().toLowerCase();
    const conversion = parsePercent(item.conversion);
    const cac = parseCurrency(item.cac);

    const conversionPoints = Math.min(50, conversion * 1.5);
    const volumePoints = Math.min(35, item.leads * 0.4);
    const efficiencyPoints = Math.max(0, 25 - cac / 100);
    const score = Math.max(0, Math.min(100, Math.round(conversionPoints + volumePoints + efficiencyPoints)));
    const tier = resolveTier(score);
    const enrichmentBase = ENRICHMENT_BY_SOURCE[sourceKey] ?? {
      segment: "General B2B",
      region: "Brasil",
      signal: "Sinal comercial monitorado"
    };

    return {
      account: `${item.source} Cluster ${index + 1}`,
      source: item.source,
      leadCount: item.leads,
      conversion: item.conversion,
      leadScore: score,
      tier,
      enrichment: {
        ...enrichmentBase,
        intent: resolveIntent(score)
      }
    };
  });
}
