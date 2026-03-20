// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-DASH-003
import { expect, test } from "@playwright/test";

test.describe("Dashboard modules parity", () => {
  test("SDR: pipeline module should render stages", async ({ page }) => {
    await page.goto("/pipeline");

    await expect(page.getByRole("heading", { name: "Pipeline de Vendas" })).toBeVisible();
    await expect(page.getByText("Filtrar etapa")).toBeVisible();
    await expect(page.getByText("Prospecção")).toBeVisible();
  });

  test("CS: health score module should render account risk list", async ({ page }) => {
    await page.goto("/health-score");

    await expect(page.getByRole("heading", { name: "Health Score Board" })).toBeVisible();
    await expect(page.getByLabel("Risco")).toBeVisible();
    await expect(page.getByText("Atlas Log")).toBeVisible();
  });

  test("Finance: financial module should render metrics", async ({ page }) => {
    await page.goto("/financeiro");

    await expect(page.getByRole("heading", { name: "Visão Financeira" })).toBeVisible();
    await expect(page.getByText("MRR")).toBeVisible();
    await expect(page.getByText("Cash In")).toBeVisible();
  });
});
