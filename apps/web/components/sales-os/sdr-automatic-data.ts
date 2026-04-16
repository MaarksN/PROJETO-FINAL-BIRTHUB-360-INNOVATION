import type { SupportedLocale } from "../../lib/i18n";

import {
  SDR_AUTOMATIC_COPY,
  SDR_AUTOMATIC_LEADS,
  SDR_AUTOMATIC_TIME_SLOTS
} from "./sdr-automatic-data.catalog";

export type LeadRegionId =
  | "north-america"
  | "latin-america"
  | "europe"
  | "asia-pacific";

export type LeadLifecycleStage =
  | "subscriber"
  | "lead"
  | "mql"
  | "sql"
  | "opportunity"
  | "customer";

export type LeadSequenceStatus = "active" | "completed" | "paused";

export type SdrAutomaticLead = {
  action: string;
  baseScore?: number;
  city?: string;
  company: string;
  companySize?: string;
  country?: string;
  createdAt: string;
  crmAnnualValue?: number;
  email: string;
  engagement?: {
    emailClicks: number;
    hotPages: string[];
    lastTouchpointAt: string;
    pageVisits: number;
  };
  id: string;
  latitude?: number;
  lifecycleStage?: LeadLifecycleStage;
  longitude?: number;
  name: string;
  owner: string;
  priority: string;
  priorityTone: "critical" | "high" | "warm";
  region?: LeadRegionId;
  role: string;
  score: number;
  sequenceStatus?: LeadSequenceStatus;
  slaDueAt: string;
  slaStatus: "breached" | "healthy" | "watch";
  source: string;
  stage: "demo" | "negotiation" | "new" | "proposal" | "qualified";
  support?: {
    recentTickets: number;
    sentiment: "negative" | "neutral" | "positive";
    summary: string;
  };
};

export type SdrAutomaticLeadSeed = SdrAutomaticLead;

export type SdrAutomaticTimeSlot = {
  label: string;
  recommended?: boolean;
};

export type CrmRegionSnapshot = {
  activeAccounts: number;
  lifecycle: Record<LeadLifecycleStage, number>;
  pipelineCoverage: number;
  region: LeadRegionId;
  revenuePotential: number;
  slaCompliance: number;
};

export type SdrAutomaticCopy = {
  actionPrimary: string;
  agendaCaption: string;
  agendaHelper: string;
  agendaSubtitle: string;
  agendaTitle: string;
  assistantHint: string;
  assistantSubtitle: string;
  assistantTitle: string;
  callFocus: string;
  handoffSubtitle: string;
  handoffTitle: string;
  heroDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  leadSubtitle: string;
  leadTitle: string;
  metrics: Array<{ label: string; value: string }>;
  moduleLabel: string;
  nextStepLabel: string;
  premiumDescription: string;
  premiumEyebrow: string;
  premiumLayersLabel: string;
  premiumOpenAgents: string;
  premiumSummaryLabel: string;
  premiumTitle: string;
  premiumViewAll: string;
  quickBrief: string;
  salesRepName: string;
  salesRepRole: string;
  sidebarTitle: string;
  spinLabel: string;
  summaryLabel: string;
  tableAction: string;
  tableLead: string;
  tablePriority: string;
  tableScore: string;
  tableSource: string;
  timelineLabel: string;
};

export type SdrAutomaticViewDefinition = {
  description: string;
  id: "agendador" | "assistente" | "handoff" | "leadScore";
  label: string;
};

type SdrAutomaticConfig = {
  copy: SdrAutomaticCopy;
  leads: SdrAutomaticLead[];
  timeSlots: SdrAutomaticTimeSlot[];
};

export function toneForScore(score: number): "critical" | "high" | "warm" {
  if (score >= 90) {
    return "critical";
  }

  if (score >= 75) {
    return "high";
  }

  return "warm";
}

export function getSdrAutomaticConfig(locale: SupportedLocale): SdrAutomaticConfig {
  return {
    copy: SDR_AUTOMATIC_COPY[locale],
    leads: SDR_AUTOMATIC_LEADS[locale],
    timeSlots: SDR_AUTOMATIC_TIME_SLOTS
  };
}

export function getSdrAutomaticViewDefinitions(
  copy: SdrAutomaticCopy
): SdrAutomaticViewDefinition[] {
  return [
    {
      description: copy.leadSubtitle,
      id: "leadScore",
      label: copy.leadTitle
    },
    {
      description: copy.assistantSubtitle,
      id: "assistente",
      label: copy.assistantTitle
    },
    {
      description: copy.agendaSubtitle,
      id: "agendador",
      label: copy.agendaTitle
    },
    {
      description: copy.handoffSubtitle,
      id: "handoff",
      label: copy.handoffTitle
    }
  ];
}
