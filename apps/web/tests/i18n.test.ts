import assert from "node:assert/strict";
import test from "node:test";

import { formatPtBrDateTime, getDictionary } from "../lib/i18n";

void test("pt-BR dictionary exposes canonical product navigation and consent copy", () => {
  const copy = getDictionary();

  assert.equal(copy.navbar.identityTitle, "Central de Operacao");
  assert.equal(copy.navbar.items[0]?.href, "/dashboard");
  assert.equal(copy.navbar.items[6]?.label, "Conversas");
  assert.equal(copy.consentBanner.settings, "Abrir central LGPD");
});

void test("formatPtBrDateTime uses the pt-BR locale baseline", () => {
  const formatted = formatPtBrDateTime("2026-04-07T12:34:00.000Z", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });

  assert.equal(formatted, "07/04/2026");
});
