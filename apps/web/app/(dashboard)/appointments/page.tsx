// @ts-nocheck
"use client";

import { ClinicalWorkspaceDisabledState } from "../../../components/dashboard/ClinicalWorkspaceDisabledState";
import { getProductCapabilities } from "../../../lib/product-capabilities";
import { AppointmentsBoard } from "../patients/appointments-board";

const productCapabilities = getProductCapabilities();

export default function AppointmentsPage() {
  if (!productCapabilities.clinicalWorkspaceEnabled) {
    return <ClinicalWorkspaceDisabledState />;
  }

  return (
    <AppointmentsBoard
      description="Agenda transversal com vistas por dia, semana e mes para o nucleo materno-infantil."
      title="Agenda geral"
    />
  );
}
