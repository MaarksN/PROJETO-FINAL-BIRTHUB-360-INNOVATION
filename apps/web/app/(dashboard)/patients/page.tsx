import { ClinicalWorkspaceDisabledState } from "../../../components/dashboard/ClinicalWorkspaceDisabledState.js";
import { getProductCapabilities } from "../../../lib/product-capabilities.js";

export default async function PatientsPage() {
  const capabilities = getProductCapabilities();

  if (!capabilities.clinicalWorkspaceEnabled) {
    return <ClinicalWorkspaceDisabledState />;
  }

  const { default: PatientsPageClient } = await import("./page.client.js");
  return <PatientsPageClient />;
}
