import assert from "node:assert/strict";
import test from "node:test";

import { getSdrAutomaticConfig } from "../components/sales-os/sdr-automatic-data";
import {
  applyPollingFrameToTrend,
  buildLeadCsv,
  buildSupportReply,
  createInitialMetrics,
  createInitialTrendSeries,
  filterLeads,
  LEAD_POLLING_FRAMES,
  paginateLeads
} from "../components/sales-os/sdr-automatic-dashboard";

void test("lead dashboard filters by stage, score band, email, region, and creation date", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const filtered = filterLeads(leads, {
    createdFrom: "2026-04-14",
    createdTo: "2026-04-15",
    query: "connecta",
    regions: ["latin-america"],
    scoreBands: ["critical"],
    stages: ["proposal"]
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.name, "Julia Andrade");
});

void test("lead dashboard paginates large lead queues safely", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const page = paginateLeads(leads, 2, 4);

  assert.equal(page.currentPage, 2);
  assert.equal(page.totalPages, 3);
  assert.equal(page.items.length, 4);
  assert.equal(page.items[0]?.id, "lead_marcos_lima");
});

void test("lead dashboard CSV export includes localized headers and row content", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const csv = buildLeadCsv(leads.slice(0, 1), "pt-BR");

  assert.match(csv, /"E-mail"/);
  assert.match(csv, /"Regiao"/);
  assert.match(csv, /"Julia Andrade"/);
  assert.match(csv, /"Violado"/);
});

void test("support reply summarizes SLA pressure from live metrics", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const reply = buildSupportReply({
    filters: {
      createdFrom: "",
      createdTo: "",
      query: "",
      regions: [],
      scoreBands: [],
      stages: []
    },
    leads,
    locale: "pt-BR",
    metrics: createInitialMetrics(leads),
    question: "Resuma o risco de SLA"
  });

  assert.match(reply, /violacoes de SLA/i);
  assert.match(reply, /Julia Andrade|Rafael Castro/i);
});

void test("live trend polling keeps a rolling chart window with fresh timestamps", () => {
  const trend = createInitialTrendSeries("pt-BR");
  const frame = LEAD_POLLING_FRAMES[0];
  const expectedLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date("2026-04-15T13:45:30.000Z"));

  assert.ok(frame);

  const updated = applyPollingFrameToTrend(
    trend,
    frame,
    "pt-BR",
    new Date("2026-04-15T13:45:30.000Z")
  );

  assert.equal(updated.length, trend.length);
  assert.equal(updated[0]?.label, trend[1]?.label);
  assert.equal(updated[updated.length - 1]?.label, expectedLabel);
  assert.equal(
    updated[updated.length - 1]?.leads,
    (trend[trend.length - 1]?.leads ?? 0) + frame.activeLeadsDelta
  );
});

void test("support reply lists active date, stage, and score filters", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const reply = buildSupportReply({
    filters: {
      createdFrom: "2026-04-14",
      createdTo: "2026-04-15",
      query: "connecta",
      regions: [],
      scoreBands: ["critical"],
      stages: ["proposal"]
    },
    leads,
    locale: "pt-BR",
    metrics: createInitialMetrics(leads),
    question: "Quais filtros estao ativos?"
  });

  assert.match(reply, /E-mail: connecta/i);
  assert.match(reply, /De: 2026-04-14/i);
  assert.match(reply, /Ate: 2026-04-15/i);
  assert.match(reply, /Estagios: Proposta/i);
  assert.match(reply, /Faixas de score: Critico/i);
});

void test("support reply handles empty score views gracefully", () => {
  const reply = buildSupportReply({
    filters: {
      createdFrom: "2026-04-14",
      createdTo: "2026-04-15",
      query: "sem.resultado@birthub.com",
      regions: [],
      scoreBands: [],
      stages: []
    },
    leads: [],
    locale: "pt-BR",
    metrics: createInitialMetrics([]),
    question: "Quem tem maior score?"
  });

  assert.match(reply, /Nao ha leads na visao filtrada atual/i);
});
