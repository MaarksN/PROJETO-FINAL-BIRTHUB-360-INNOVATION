"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  CalendarPlus,
  Filter,
  MessageSquareQuote,
  Send,
  UserRound
} from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import {
  getSdrAutomaticConfig,
  type SdrAutomaticCopy,
  type SdrAutomaticLead,
  type SdrAutomaticTimeSlot
} from "./sdr-automatic-data";
import {
  SdrAgendadorView,
  SdrAssistenteView,
  SdrHandoffView,
  SdrLeadScoreView
} from "./SdrAutomaticViews";
import styles from "./sdr-automatic-platform.module.css";

type ViewId = "agendador" | "assistente" | "handoff" | "leadScore";

type ViewDefinition = {
  description: string;
  icon: LucideIcon;
  id: ViewId;
  label: string;
};

function buildViews(copy: SdrAutomaticCopy): ViewDefinition[] {
  return [
    {
      description: copy.leadSubtitle,
      icon: Filter,
      id: "leadScore",
      label: copy.leadTitle
    },
    {
      description: copy.assistantSubtitle,
      icon: MessageSquareQuote,
      id: "assistente",
      label: copy.assistantTitle
    },
    {
      description: copy.agendaSubtitle,
      icon: CalendarPlus,
      id: "agendador",
      label: copy.agendaTitle
    },
    {
      description: copy.handoffSubtitle,
      icon: Send,
      id: "handoff",
      label: copy.handoffTitle
    }
  ];
}

function renderActiveView(input: {
  activeView: ViewId;
  copy: SdrAutomaticCopy;
  leads: SdrAutomaticLead[];
  locale: SupportedLocale;
  timeSlots: SdrAutomaticTimeSlot[];
}) {
  switch (input.activeView) {
    case "assistente":
      return <SdrAssistenteView copy={input.copy} locale={input.locale} />;
    case "agendador":
      return (
        <SdrAgendadorView
          copy={input.copy}
          locale={input.locale}
          timeSlots={input.timeSlots}
        />
      );
    case "handoff":
      return <SdrHandoffView copy={input.copy} locale={input.locale} />;
    case "leadScore":
    default:
      return (
        <SdrLeadScoreView
          copy={input.copy}
          leads={input.leads}
          locale={input.locale}
        />
      );
  }
}

export function SdrAutomaticPlatform(input: { locale: SupportedLocale }) {
  const [activeView, setActiveView] = useState<ViewId>("leadScore");
  const { copy, leads, timeSlots } = useMemo(
    () => getSdrAutomaticConfig(input.locale),
    [input.locale]
  );
  const views = useMemo(() => buildViews(copy), [copy]);
  const currentView = views.find((view) => view.id === activeView) ?? views.at(0);

  if (!currentView) {
    return null;
  }

  return (
    <section className={styles.platformShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <BrainCircuit size={22} />
          </div>
          <div>
            <span className={styles.sectionEyebrow}>{copy.moduleLabel}</span>
            <strong>{copy.sidebarTitle}</strong>
          </div>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.sectionEyebrow}>{copy.heroEyebrow}</span>
          <h2>{copy.heroTitle}</h2>
          <p>{copy.heroDescription}</p>
          <div className={styles.metricStack}>
            {copy.metrics.map((metric) => (
              <article className={styles.metricCard} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <nav aria-label={copy.moduleLabel} className={styles.navList}>
          {views.map((view) => {
            const Icon = view.icon;
            const active = view.id === activeView;

            return (
              <button
                className={styles.navItem}
                data-active={active ? "true" : "false"}
                key={view.id}
                onClick={() => setActiveView(view.id)}
                type="button"
              >
                <span className={styles.navIcon}>
                  <Icon size={18} />
                </span>
                <span className={styles.navCopy}>
                  <strong>{view.label}</strong>
                  <small>{view.description}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <UserRound size={18} />
          </div>
          <div>
            <strong>{copy.salesRepName}</strong>
            <span>{copy.salesRepRole}</span>
          </div>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div>
            <span className={styles.sectionEyebrow}>{copy.moduleLabel}</span>
            <h2>{currentView.label}</h2>
            <p>{currentView.description}</p>
          </div>
          <div className={styles.workspacePills}>
            <span>{copy.quickBrief}</span>
            <span>{copy.summaryLabel}</span>
            <span>{copy.nextStepLabel}</span>
          </div>
        </header>

        {renderActiveView({
          activeView,
          copy,
          leads,
          locale: input.locale,
          timeSlots
        })}
      </div>
    </section>
  );
}
