"use client";

import type { CSSProperties, ReactNode } from "react";
import { Info, LoaderCircle, Send, Sparkles } from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import type { SdrAutomaticLead } from "./sdr-automatic-data";
import {
  resolveSlaLabel,
  type LeadColumnId,
  type LeadDashboardCopy
} from "./sdr-automatic-dashboard";
import {
  buildScoreFillColor,
  buildSequenceStatusTone,
  buildStageColor,
  type LeadInsightState
} from "./SdrLeadScoreWorkspace.helpers";
import shellStyles from "./sdr-automatic-platform.module.css";
import styles from "./sdr-lead-score.module.css";

type InfoTooltipProps = {
  align?: "left" | "right";
  bullets?: string[];
  content: string;
  label: string;
};

type StandardCellRendererInput = {
  dashboardCopy: LeadDashboardCopy;
  lead: SdrAutomaticLead;
  locale: SupportedLocale;
};

type LeadTableCellProps = StandardCellRendererInput & {
  column: LeadColumnId;
  handleLeadInsight: (lead: SdrAutomaticLead) => Promise<void>;
  handleSendSequence: (lead: SdrAutomaticLead) => void;
  insight: LeadInsightState | undefined;
  openInsightLeadId: string | null;
};

type InsightSectionProps = {
  items: string[];
  title: string;
};

const STANDARD_CELL_RENDERERS: Record<
  Exclude<LeadColumnId, "action">,
  (input: StandardCellRendererInput) => ReactNode
> = {
  company: ({ lead }) => <span>{lead.company}</span>,
  createdAt: ({ lead, locale }) => (
    <span>
      {new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "short"
      }).format(new Date(lead.createdAt))}
    </span>
  ),
  email: ({ lead }) => <span>{lead.email}</span>,
  lead: ({ lead }) => (
    <div className={styles.leadCell}>
      <strong>{lead.name}</strong>
      <span>{lead.role}</span>
    </div>
  ),
  owner: ({ lead }) => <span>{lead.owner}</span>,
  region: ({ dashboardCopy, lead }) => <span>{dashboardCopy.regionLabels[lead.region]}</span>,
  score: ({ lead }) => (
    <div className={styles.scoreCell}>
      <div className={styles.scoreTrack}>
        <span
          className={styles.scoreFill}
          style={{
            background: `linear-gradient(90deg, ${buildScoreFillColor(lead.score)}, rgba(255,255,255,0.88))`,
            width: `${lead.score}%`
          }}
        />
      </div>
      <strong>{lead.score}</strong>
    </div>
  ),
  sequenceStatus: ({ dashboardCopy, lead }) => (
    <span className={styles.slaPill} data-tone={buildSequenceStatusTone(lead.sequenceStatus)}>
      {dashboardCopy.sequenceStatusLabels[lead.sequenceStatus]}
    </span>
  ),
  sla: ({ lead, locale }) => (
    <span className={styles.slaPill} data-tone={lead.slaStatus}>
      {resolveSlaLabel(locale, lead.slaStatus)}
    </span>
  ),
  source: ({ lead }) => <span>{lead.source}</span>,
  stage: ({ dashboardCopy, lead }) => (
    <span
      className={styles.stagePill}
      style={
        {
          "--pill-color": buildStageColor(lead.stage)
        } as CSSProperties
      }
    >
      {dashboardCopy.stageLabels[lead.stage]}
    </span>
  )
};

export function InfoTooltip(props: InfoTooltipProps) {
  const { align = "right", bullets = [], content, label } = props;

  return (
    <details className={styles.infoTooltip} data-align={align}>
      <summary aria-label={label}>
        <Info size={12} />
      </summary>
      <div className={styles.infoTooltipCard}>
        <div className={styles.tooltipStack}>
          <strong>{label}</strong>
          <p>{content}</p>
          {bullets.length > 0 ? (
            <ul>
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </details>
  );
}

function InsightSection(props: InsightSectionProps) {
  const { items, title } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.aiPopoverSection}>
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InsightBreakdownSection(props: {
  entries: LeadInsightState["detail"]["scoreBreakdown"];
  title: string;
}) {
  const { entries, title } = props;

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={styles.aiPopoverSection}>
      <strong>{title}</strong>
      <ul>
        {entries.map((entry) => (
          <li key={entry.label}>
            <strong>{entry.label}:</strong> {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeadInsightPopover(props: {
  dashboardCopy: LeadDashboardCopy;
  insight: LeadInsightState | undefined;
  locale: SupportedLocale;
}) {
  const { dashboardCopy, insight, locale } = props;
  const labels =
    locale === "en-US"
      ? {
          actions: "Recommended actions",
          breakdown: "Score breakdown",
          highlights: "Key signals",
          summary: "Summary"
        }
      : {
          actions: "Acoes recomendadas",
          breakdown: "Detalhamento do score",
          highlights: "Sinais principais",
          summary: "Resumo"
        };

  return (
    <div className={styles.aiPopover}>
      <div className={styles.aiPopoverHeader}>
        <strong>{dashboardCopy.aiAgentLabel}</strong>
        <small>{insight?.source ?? dashboardCopy.aiAgentLabel}</small>
      </div>

      <div className={styles.aiPopoverSection}>
        <strong>{labels.summary}</strong>
        <p>{insight?.detail.summary ?? dashboardCopy.aiTooltipEmpty}</p>
      </div>

      <InsightSection items={insight?.detail.highlights ?? []} title={labels.highlights} />
      <InsightBreakdownSection
        entries={insight?.detail.scoreBreakdown ?? []}
        title={labels.breakdown}
      />
      <InsightSection
        items={insight?.detail.recommendedActions ?? []}
        title={labels.actions}
      />
    </div>
  );
}

function LeadActionCell(props: {
  dashboardCopy: LeadDashboardCopy;
  handleLeadInsight: (lead: SdrAutomaticLead) => Promise<void>;
  handleSendSequence: (lead: SdrAutomaticLead) => void;
  insight: LeadInsightState | undefined;
  lead: SdrAutomaticLead;
  locale: SupportedLocale;
  openInsightLeadId: string | null;
}) {
  const {
    dashboardCopy,
    handleLeadInsight,
    handleSendSequence,
    insight,
    lead,
    locale,
    openInsightLeadId
  } = props;
  const isLoading = insight?.status === "loading";

  return (
    <div className={styles.actionGroup}>
      <button className={shellStyles.actionButton} type="button">
        {lead.action}
      </button>
      <div className={styles.actionButtonGroup}>
        <button
          className={styles.secondaryButton}
          onClick={() => handleSendSequence(lead)}
          type="button"
        >
          <Send size={14} />
          <span>{dashboardCopy.sendSequenceLabel}</span>
        </button>
        <div className={styles.aiWrap}>
          <div className={styles.actionButtonGroup}>
            <button
              className={styles.aiButton}
              disabled={isLoading}
              onClick={() => {
                void handleLeadInsight(lead);
              }}
              type="button"
            >
              {isLoading ? (
                <LoaderCircle className={styles.spinningIcon} size={14} />
              ) : (
                <Sparkles size={14} />
              )}
              <span>{dashboardCopy.aiAnalysisLabel}</span>
            </button>
            <InfoTooltip
              align="left"
              bullets={dashboardCopy.aiButtonTooltipBullets}
              content={dashboardCopy.aiButtonTooltipBullets[0] ?? dashboardCopy.aiTooltipEmpty}
              label={dashboardCopy.aiButtonTooltipTitle}
            />
          </div>
          {openInsightLeadId === lead.id ? (
            <LeadInsightPopover
              dashboardCopy={dashboardCopy}
              insight={insight}
              locale={locale}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LeadTableCell(props: LeadTableCellProps) {
  const {
    column,
    dashboardCopy,
    handleLeadInsight,
    handleSendSequence,
    insight,
    lead,
    locale,
    openInsightLeadId
  } = props;

  if (column === "action") {
    return (
      <LeadActionCell
        dashboardCopy={dashboardCopy}
        handleLeadInsight={handleLeadInsight}
        handleSendSequence={handleSendSequence}
        insight={insight}
        lead={lead}
        locale={locale}
        openInsightLeadId={openInsightLeadId}
      />
    );
  }

  return STANDARD_CELL_RENDERERS[column]({
    dashboardCopy,
    lead,
    locale
  });
}
