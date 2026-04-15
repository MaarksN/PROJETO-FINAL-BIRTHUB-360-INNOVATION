import {
  CalendarClock,
  LayoutGrid,
  MessageSquareQuote,
  Send,
  Sparkles
} from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import { getSdrAutomaticConfig } from "./sdr-automatic-data";
import {
  SdrAgendadorView,
  SdrAssistenteView,
  SdrHandoffView,
  SdrLeadScoreView
} from "./SdrAutomaticViews";
import styles from "./sdr-automatic-platform.module.css";

export function SdrAutomaticPlatform(input: { locale: SupportedLocale }) {
  const { locale } = input;
  const { copy, leads, timeSlots } = getSdrAutomaticConfig(locale);

  const navigation = [
    {
      id: "score",
      icon: <Sparkles size={18} />,
      subtitle: copy.leadSubtitle,
      title: copy.leadTitle
    },
    {
      id: "assistant",
      icon: <MessageSquareQuote size={18} />,
      subtitle: copy.assistantSubtitle,
      title: copy.assistantTitle
    },
    {
      id: "agenda",
      icon: <CalendarClock size={18} />,
      subtitle: copy.agendaSubtitle,
      title: copy.agendaTitle
    },
    {
      id: "handoff",
      icon: <Send size={18} />,
      subtitle: copy.handoffSubtitle,
      title: copy.handoffTitle
    }
  ];

  return (
    <div className={styles.platformShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <LayoutGrid size={18} />
          </div>
          <div>
            <span className={styles.sectionEyebrow}>{copy.sidebarTitle}</span>
            <strong>{copy.heroTitle}</strong>
            <p>{copy.heroDescription}</p>
          </div>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.sectionEyebrow}>{copy.heroEyebrow}</span>
          <h2>{copy.heroTitle}</h2>
          <p>{copy.heroDescription}</p>

          <div className={styles.metricStack}>
            {copy.metrics.map((metric) => (
              <div className={styles.metricCard} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.navList}>
          {navigation.map((item, index) => (
            <div
              className={styles.navItem}
              data-active={index === 0 ? "true" : "false"}
              key={item.id}
            >
              <div className={styles.navIcon}>{item.icon}</div>
              <div className={styles.navCopy}>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <Sparkles size={18} />
          </div>
          <div>
            <strong>{copy.salesRepName}</strong>
            <span>{copy.salesRepRole}</span>
          </div>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div>
            <span className={styles.sectionEyebrow}>{copy.moduleLabel}</span>
            <h2>{copy.heroTitle}</h2>
            <p>{copy.heroDescription}</p>
          </div>

          <div className={styles.workspacePills}>
            <span>{copy.moduleLabel}</span>
            <span>{copy.salesRepName}</span>
          </div>
        </header>

        <SdrLeadScoreView copy={copy} leads={leads} locale={locale} />
        <SdrAssistenteView copy={copy} locale={locale} />
        <SdrAgendadorView copy={copy} locale={locale} timeSlots={timeSlots} />
        <SdrHandoffView copy={copy} locale={locale} />
      </section>
    </div>
  );
}
