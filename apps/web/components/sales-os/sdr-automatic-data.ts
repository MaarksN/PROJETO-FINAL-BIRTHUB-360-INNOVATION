import type { SupportedLocale } from "../../lib/i18n";

import {
  SDR_AUTOMATIC_COPY,
  SDR_AUTOMATIC_LEADS,
  SDR_AUTOMATIC_TIME_SLOTS
} from "./sdr-automatic-data.catalog";

export type SdrAutomaticLead = {
  action: string;
  company: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  owner: string;
  priority: string;
  priorityTone: "critical" | "high" | "warm";
  role: string;
  score: number;
  slaDueAt: string;
  slaStatus: "breached" | "healthy" | "watch";
  source: string;
  stage: "demo" | "negotiation" | "new" | "proposal" | "qualified";
};

export type SdrAutomaticTimeSlot = {
  label: string;
  recommended?: boolean;
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
