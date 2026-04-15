import assert from "node:assert/strict";
import test from "node:test";

import { getSdrAutomaticConfig } from "../components/sales-os/sdr-automatic-data";
import {
  buildLeadCsv,
  buildSupportReply,
  createInitialMetrics,
  filterLeads,
  paginateLeads
} from "../components/sales-os/sdr-automatic-dashboard";

void test("lead dashboard filters by stage, score band, email, and creation date", () => {
  const { leads } = getSdrAutomaticConfig("pt-BR");
  const filtered = filterLeads(leads, {
    createdFrom: "2026-04-14",
    createdTo: "2026-04-15",
    query: "connecta",
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
