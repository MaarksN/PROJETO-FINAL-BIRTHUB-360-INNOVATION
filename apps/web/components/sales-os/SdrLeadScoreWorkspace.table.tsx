"use client";

import type { CSSProperties } from "react";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  LayoutPanelTop,
  ListFilter,
  Search,
  Sparkles
} from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import type { SdrAutomaticLead } from "./sdr-automatic-data";
import {
  AVAILABLE_LEAD_COLUMNS,
  DEFAULT_LEAD_FILTERS,
  resolveSlaLabel,
  type LeadColumnId,
  type LeadDashboardCopy,
  type LeadFilters,
  type LeadScoreBandId
} from "./sdr-automatic-dashboard";
import {
  buildScoreFillColor,
  buildStageColor,
  type LeadInsightState
} from "./SdrLeadScoreWorkspace.helpers";
import shellStyles from "./sdr-automatic-platform.module.css";
import styles from "./sdr-lead-score.module.css";

type PaginationState = {
  currentPage: number;
  items: SdrAutomaticLead[];
  totalPages: number;
};

type SdrLeadScoreWorkspaceTableProps = {
  columnLabels: Record<LeadColumnId, string>;
  dashboardCopy: LeadDashboardCopy;
  filteredLeadsLength: number;
  filters: LeadFilters;
  insights: Record<string, LeadInsightState>;
  liveLeadsLength: number;
  locale: SupportedLocale;
  openInsightLeadId: string | null;
  pagination: PaginationState;
  setFilters: (value: LeadFilters) => void;
  toggleColumn: (column: LeadColumnId) => void;
  toggleScoreBand: (band: LeadScoreBandId) => void;
  toggleStage: (stage: SdrAutomaticLead["stage"]) => void;
  updateFilter: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  visibleColumns: LeadColumnId[];
  handleExportCsv: () => void;
  handleLeadInsight: (lead: SdrAutomaticLead) => Promise<void>;
  setPage: (value: number | ((current: number) => number)) => void;
};

export function SdrLeadScoreWorkspaceTable(props: SdrLeadScoreWorkspaceTableProps) {
  const {
    columnLabels,
    dashboardCopy,
    filteredLeadsLength,
    filters,
    handleExportCsv,
    handleLeadInsight,
    insights,
    liveLeadsLength,
    locale,
    openInsightLeadId,
    pagination,
    setFilters,
    setPage,
    toggleColumn,
    toggleScoreBand,
    toggleStage,
    updateFilter,
    visibleColumns
  } = props;

  function renderColumnHeader(column: LeadColumnId) {
    return columnLabels[column];
  }

  function renderCell(lead: SdrAutomaticLead, column: LeadColumnId) {
    if (column === "lead") {
      return (
        <div className={styles.leadCell}>
          <strong>{lead.name}</strong>
          <span>{lead.role}</span>
        </div>
      );
    }

    if (column === "email") {
      return <span>{lead.email}</span>;
    }

    if (column === "company") {
      return <span>{lead.company}</span>;
    }

    if (column === "owner") {
      return <span>{lead.owner}</span>;
    }

    if (column === "stage") {
      return (
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
      );
    }

    if (column === "score") {
      return (
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
      );
    }

    if (column === "source") {
      return <span>{lead.source}</span>;
    }

    if (column === "createdAt") {
      return (
        <span>
          {new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            month: "short"
          }).format(new Date(lead.createdAt))}
        </span>
      );
    }

    if (column === "sla") {
      return (
        <span className={styles.slaPill} data-tone={lead.slaStatus}>
          {resolveSlaLabel(locale, lead.slaStatus)}
        </span>
      );
    }

    return (
      <div className={styles.actionGroup}>
        <button className={shellStyles.actionButton} type="button">
          {lead.action}
        </button>
        <div className={styles.aiWrap}>
          <button
            className={styles.aiButton}
            onClick={() => {
              void handleLeadInsight(lead);
            }}
            type="button"
          >
            <Sparkles size={14} />
            <span>{dashboardCopy.aiAnalysisLabel}</span>
          </button>
          {openInsightLeadId === lead.id ? (
            <div className={styles.aiPopover}>
              <strong>{dashboardCopy.aiAgentLabel}</strong>
              <p>{insights[lead.id]?.text ?? dashboardCopy.aiTooltipEmpty}</p>
              <small>{insights[lead.id]?.source ?? dashboardCopy.aiAgentLabel}</small>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <article className={`${shellStyles.surfaceCard} ${styles.tableCard}`}>
      <div className={styles.tableToolbar}>
        <div>
          <strong>{dashboardCopy.filtersTitle}</strong>
          <p>{dashboardCopy.leadsVisibleLabel(filteredLeadsLength, liveLeadsLength)}</p>
        </div>
        <div className={styles.toolbarActions}>
          <label className={styles.searchField}>
            <Search size={16} />
            <input
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder={dashboardCopy.emailSearchPlaceholder}
              type="search"
              value={filters.query}
            />
          </label>

          <details className={styles.dropdown}>
            <summary>
              <Filter size={16} />
              <span>{dashboardCopy.stageFilterLabel}</span>
            </summary>
            <div className={styles.dropdownBody}>
              {(Object.keys(dashboardCopy.stageLabels) as SdrAutomaticLead["stage"][]).map((stage) => (
                <label className={styles.dropdownOption} key={stage}>
                  <input
                    checked={filters.stages.includes(stage)}
                    onChange={() => toggleStage(stage)}
                    type="checkbox"
                  />
                  <span>{dashboardCopy.stageLabels[stage]}</span>
                </label>
              ))}
            </div>
          </details>

          <details className={styles.dropdown}>
            <summary>
              <ListFilter size={16} />
              <span>{dashboardCopy.scoreFilterLabel}</span>
            </summary>
            <div className={styles.dropdownBody}>
              {(Object.keys(dashboardCopy.scoreBandLabels) as LeadScoreBandId[]).map((band) => (
                <label className={styles.dropdownOption} key={band}>
                  <input
                    checked={filters.scoreBands.includes(band)}
                    onChange={() => toggleScoreBand(band)}
                    type="checkbox"
                  />
                  <span>{dashboardCopy.scoreBandLabels[band]}</span>
                </label>
              ))}
            </div>
          </details>

          <details className={styles.dropdown}>
            <summary>
              <LayoutPanelTop size={16} />
              <span>{dashboardCopy.columnsLabel}</span>
            </summary>
            <div className={styles.dropdownBody}>
              {AVAILABLE_LEAD_COLUMNS.map((column) => (
                <label className={styles.dropdownOption} key={column}>
                  <input
                    checked={visibleColumns.includes(column)}
                    onChange={() => toggleColumn(column)}
                    type="checkbox"
                  />
                  <span>{renderColumnHeader(column)}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <label className={styles.dateField}>
          <span>{dashboardCopy.dateFromLabel}</span>
          <div>
            <CalendarRange size={14} />
            <input
              onChange={(event) => updateFilter("createdFrom", event.target.value)}
              type="date"
              value={filters.createdFrom}
            />
          </div>
        </label>
        <label className={styles.dateField}>
          <span>{dashboardCopy.dateToLabel}</span>
          <div>
            <CalendarRange size={14} />
            <input
              onChange={(event) => updateFilter("createdTo", event.target.value)}
              type="date"
              value={filters.createdTo}
            />
          </div>
        </label>
        <button className={styles.secondaryButton} onClick={handleExportCsv} type="button">
          <Download size={16} />
          <span>{dashboardCopy.exportCsvLabel}</span>
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => {
            setFilters(DEFAULT_LEAD_FILTERS);
          }}
          type="button"
        >
          {dashboardCopy.clearFiltersLabel}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={shellStyles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column}>{renderColumnHeader(column)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.items.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length}>{dashboardCopy.noLeadsLabel}</td>
              </tr>
            ) : (
              pagination.items.map((lead) => (
                <tr key={lead.id}>
                  {visibleColumns.map((column) => (
                    <td key={`${lead.id}_${column}`}>{renderCell(lead, column)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationRow}>
        <span>{dashboardCopy.pageLabel(pagination.currentPage, pagination.totalPages)}</span>
        <div className={styles.paginationActions}>
          <button
            className={styles.secondaryButton}
            disabled={pagination.currentPage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft size={16} />
            <span>{dashboardCopy.previousPageLabel}</span>
          </button>
          <button
            className={styles.secondaryButton}
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
            type="button"
          >
            <span>{dashboardCopy.nextPageLabel}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
