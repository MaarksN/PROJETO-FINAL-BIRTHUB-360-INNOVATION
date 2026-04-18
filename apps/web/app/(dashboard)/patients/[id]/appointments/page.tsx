// @ts-expect-error TODO: remover suppressão ampla
//
import { ClinicalWorkspaceDisabledState } from "../../../../../components/dashboard/ClinicalWorkspaceDisabledState.js";
import { getProductCapabilities } from "../../../../../lib/product-capabilities.js";

export default async function PatientAppointmentsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const capabilities = getProductCapabilities();

  if (!capabilities.clinicalWorkspaceEnabled) {
    return <ClinicalWorkspaceDisabledState />;
  }

  const { default: PatientAppointmentsPageClient } = await import("./page.client.js");
  return <PatientAppointmentsPageClient {...props} />;
}

