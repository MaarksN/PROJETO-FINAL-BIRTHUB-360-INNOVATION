"use client";

import type { CSSProperties } from "react";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Info,
  LayoutPanelTop,
  ListFilter,
  LoaderCircle,
  MapPinned,
  Search,
  Send,
  Sparkles
} from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import type {
  LeadRegionId,
  SdrAutomaticLead
} from "./sdr-automatic-data";
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
  buildSequenceStatusTone,
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
  handleExportCsv: () => void;
  handleLeadInsight: (lead: SdrAutomaticLead) => Promise<void>;
  handleSendSequence: (lead: SdrAutomaticLead) => void;
  insights: Record<string, LeadInsightState>;
  liveLeadsLength: number;
  locale: SupportedLocale;
  openInsightLeadId: string | null;
  pagination: PaginationState;
  setFilters: (value: LeadFilters) => void;
  setPage: (value: number | ((current: number) => number)) => void;
  toggleColumn: (column: LeadColumnId) => void;
  toggleRegion: (region: LeadRegionId) => void;
  toggleScoreBand: (band: LeadScoreBandId) => void;
  toggleStage: (stage: SdrAutomaticLead["stage"]) => void;
  updateFilter: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  visibleColumns: LeadColumnId[];
};

type InfoTooltipProps = {
  align?: "left" | "right";
  bullets?: string[];
  content: string;
  label: string;
};

function InfoTooltip(props: InfoTooltipProps) {
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

export function SdrLeadScoreWorkspaceTable(props: SdrLeadScoreWorkspaceTableProps) {
  const {
    columnLabels,
    dashboardCopy,
    filteredLeadsLength,
    filters,
    handleExportCsv,
    handleLeadInsight,
    handleSendSequence,
    insights,
    liveLeadsLength,
    locale,
    openInsightLeadId,
    pagination,
    setFilters,
    setPage,
    toggleColumn,
    toggleRegion,
    toggleScoreBand,
    toggleStage,
    updateFilter,
    visibleColumns
  } = props;

  function renderColumnLabel(column: LeadColumnId) {
    return columnLabels[column];
  }

  function renderColumnHeader(column: LeadColumnId) {
    return (
      <span className={styles.headerLabel}>
        <span>{renderColumnLabel(column)}</span>
        <InfoTooltip
          align="left"
          content={dashboardCopy.columnTooltips[column]}
          label={renderColumnLabel(column)}
        />
      </span>
    );
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

    if (column === "region") {
      return <span>{dashboardCopy.regionLabels[lead.region]}</span>;
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

    if (column === "sequenceStatus") {
      return (
        <span
          className={styles.slaPill}
          data-tone={buildSequenceStatusTone(lead.sequenceStatus)}
        >
          {dashboardCopy.sequenceStatusLabels[lead.sequenceStatus]}
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

    const insight = insights[lead.id];
    const isLoading = insight?.status === "loading";
    const summaryLabel = locale === "en-US" ? "Summary" : "Resumo";
    const highlightsLabel = locale === "en-US" ? "Key signals" : "Sinais principais";
    const breakdownLabel = locale === "en-US" ? "Score breakdown" : "Detalhamento do score";
    const actionsLabel = locale === "en-US" ? "Recommended actions" : "Acoes recomendadas";

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
              <div className={styles.aiPopover}>
                <div className={styles.aiPopoverHeader}>
                  <strong>{dashboardCopy.aiAgentLabel}</strong>
                  <small>{insight?.source ?? dashboardCopy.aiAgentLabel}</small>
                </div>

                <div className={styles.aiPopoverSection}>
                  <strong>{summaryLabel}</strong>
                  <p>{insight?.detail.summary ?? dashboardCopy.aiTooltipEmpty}</p>
                </div>

                {insight?.detail.highlights.length ? (
                  <div className={styles.aiPopoverSection}>
                    <strong>{highlightsLabel}</strong>
                    <ul>
                      {insight.detail.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {insight?.detail.scoreBreakdown.length ? (
                  <div className={styles.aiPopoverSection}>
                    <strong>{breakdownLabel}</strong>
                    <ul>
                      {insight.detail.scoreBreakdown.map((entry) => (
                        <li key={entry.label}>
                          <strong>{entry.label}:</strong> {entry.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {insight?.detail.recommendedActions.length ? (
                  <div className={styles.aiPopoverSection}>
                    <strong>{actionsLabel}</strong>
                    <ul>
                      {insight.detail.recommendedActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
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

          <div className={styles.filterControl}>
            <details className={styles.dropdown}>
              <summary title={dashboardCopy.filterTooltips.stage}>
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
            <InfoTooltip
              content={dashboardCopy.filterTooltips.stage}
              label={dashboardCopy.stageFilterLabel}
            />
          </div>

          <div className={styles.filterControl}>
            <details className={styles.dropdown}>
              <summary title={dashboardCopy.filterTooltips.region}>
                <MapPinned size={16} />
                <span>{dashboardCopy.regionFilterLabel}</span>
              </summary>
              <div className={styles.dropdownBody}>
                {(Object.keys(dashboardCopy.regionLabels) as LeadRegionId[]).map((region) => (
                  <label className={styles.dropdownOption} key={region}>
                    <input
                      checked={filters.regions.includes(region)}
                      onChange={() => toggleRegion(region)}
                      type="checkbox"
                    />
                    <span>{dashboardCopy.regionLabels[region]}</span>
                  </label>
                ))}
              </div>
            </details>
            <InfoTooltip
              content={dashboardCopy.filterTooltips.region}
              label={dashboardCopy.regionFilterLabel}
            />
          </div>

          <div className={styles.filterControl}>
            <details className={styles.dropdown}>
              <summary title={dashboardCopy.filterTooltips.score}>
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
            <InfoTooltip
              content={dashboardCopy.filterTooltips.score}
              label={dashboardCopy.scoreFilterLabel}
            />
          </div>

          <div className={styles.filterControl}>
            <details className={styles.dropdown}>
              <summary title={dashboardCopy.filterTooltips.columns}>
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
                    <span>{renderColumnLabel(column)}</span>
                  </label>
                ))}
              </div>
            </details>
            <InfoTooltip
              content={dashboardCopy.filterTooltips.columns}
              label={dashboardCopy.columnsLabel}
            />
          </div>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.dateGroup}>
          <div className={styles.filterControl}>
            <strong>{dashboardCopy.dateFilterLabel}</strong>
            <InfoTooltip
              align="left"
              content={dashboardCopy.filterTooltips.date}
              label={dashboardCopy.dateFilterLabel}
            />
          </div>
          <div className={styles.dateInputs}>
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
          </div>
        </div>
        <button className={styles.secondaryButton} onClick={handleExportCsv} type="button">
          <Download size={16} />
          <span>{dashboardCopy.exportCsvLabel}</span>
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => setFilters(DEFAULT_LEAD_FILTERS)}
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
                <th key={column} title={dashboardCopy.columnTooltips[column]}>
                  {renderColumnHeader(column)}
                </th>
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
