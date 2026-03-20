// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-001 e GAP-002
import { expect, test } from "@playwright/test";

test.describe("LDR and AE modules", () => {
  test("LDR should render lead scoring and enrichment view", async ({ page }) => {
    await page.goto("/ldr");

    await expect(page.getByRole("heading", { name: "LDR — Lead Scoring & Enrichment" })).toBeVisible();
    await expect(page.getByTestId("ldr-board")).toBeVisible();
    await expect(page.getByText(/Tier [ABC]/).first()).toBeVisible();
  });

  test("AE should generate proposal and show ROI calculations", async ({ page }) => {
    await page.goto("/ae");

    await expect(page.getByRole("heading", { name: "AE — Proposal Generator & ROI Calculator" })).toBeVisible();
    await page.getByLabel("Conta alvo").fill("Acme Holdings");
    await page.getByLabel("Objetivo de negócio").fill("Aumentar receita recorrente em 15%");
    await page.getByLabel("Oferta").fill("Pacote premium de aceleração comercial");
    await page.getByLabel("Janela de implantação").fill("30 dias");
    await page.getByTestId("ae-generate-proposal").click();

    await expect(page.getByTestId("ae-proposal-output")).toContainText("Acme Holdings");
    await expect(page.getByTestId("ae-roi-results")).toContainText("ROI mensal");
  });
});
