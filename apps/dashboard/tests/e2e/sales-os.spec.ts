import { expect, test, type Page } from "@playwright/test";

async function openProspectingHub(page: Page): Promise<void> {
  await page.goto("/sales");
  await expect(
    page.getByRole("heading", { name: "Bem-vindo ao seu Portal de Vendas" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Iniciar prospecção agora" }).click();
  await expect(page.getByRole("heading", { name: /SALES\s*OS/i })).toBeVisible();
}

test.describe("Sales OS Dashboard", () => {
  test("should load the Sales OS landing page", async ({ page }) => {
    await openProspectingHub(page);

    await expect(page.getByText(/LDR\s*Elite/i)).toBeVisible();
    await expect(page.getByText(/BDR\s*Intel/i)).toBeVisible();
    await expect(page.getByText(/SDR\s*Hunter/i)).toBeVisible();
    await expect(page.getByText(/Closer\s*Elite/i)).toBeVisible();
  });

  test("should navigate to LDR module tools", async ({ page }) => {
    await openProspectingHub(page);

    await page.getByText(/LDR\s*Elite/i).first().click({ force: true });

    await expect(page.getByText(/LDR\s*Module/i)).toBeVisible();
    await expect(page.getByText("Lead Qualifier")).toBeVisible();
  });

  test("should open a tool view", async ({ page }) => {
    await openProspectingHub(page);
    await page.getByText(/LDR\s*Elite/i).first().click({ force: true });
    await page.getByText("Lead Qualifier").first().click({ force: true });

    await expect(page.getByText("Lead Qualifier")).toBeVisible();
    await expect(
      page.getByPlaceholder("Setor, Tamanho, Faturamento...")
    ).toBeVisible();
  });
});
