// @ts-nocheck
"use client";

import { use } from "react";

import { ClinicalWorkspaceDisabledState } from "../../../../../components/dashboard/ClinicalWorkspaceDisabledState";
import { getProductCapabilities } from "../../../../../lib/product-capabilities";
import { AppointmentsBoard } from "../../appointments-board";

const productCapabilities = getProductCapabilities();

export default function PatientAppointmentsPage({ params }: { params: Promise<{ id: string }> }) {
  if (!productCapabilities.clinicalWorkspaceEnabled) {
    return <ClinicalWorkspaceDisabledState />;
  }

  return <PatientAppointmentsPageEnabled params={params} />;
}

function PatientAppointmentsPageEnabled({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AppointmentsBoard
      description="Agenda focada na paciente, com criacao rapida de consultas e atualizacao de status."
      patientId={id}
      title="Consultas da paciente"
    />
  );
}
