import { ClinicalWorkspaceDisabledState } from "../../../../components/dashboard/ClinicalWorkspaceDisabledState.js";
import { getProductCapabilities } from "../../../../lib/product-capabilities.js";

export default async function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const capabilities = getProductCapabilities();

  if (!capabilities.clinicalWorkspaceEnabled) {
    return <ClinicalWorkspaceDisabledState />;
  }

  const { default: PatientDetailPageClient } = await import("./page.client.js");
  return <PatientDetailPageClient {...props} />;
}
