// @ts-nocheck
//
// default-surface-assertion: clinical-workspace-disabled
import { expect, test } from "@playwright/test";

import { bootstrapSession } from "./support";

test("clinical routes render the controlled disabled state when the workspace is off", async ({
  page
}) => {
  await bootstrapSession(page);

  await page.goto("/patients");
  await expect(page.getByText("Modulo clinico indisponivel no caminho padrao")).toBeVisible();
  await expect(page.getByText("Superficie clinica preservada fora do produto ativo")).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar ao dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir workflows" })).toBeVisible();

  await page.goto("/appointments");
  await expect(page.getByText("Modulo clinico indisponivel no caminho padrao")).toBeVisible();
  await expect(page.getByText("Superficie clinica preservada fora do produto ativo")).toBeVisible();
});
