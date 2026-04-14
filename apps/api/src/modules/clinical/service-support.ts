import { Prisma } from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
export type ClinicalContext = {
  organizationId: string;
  tenantId: string;
  userId?: string | null;
};

export type DateWindowView = "day" | "month" | "week";

export const CLINICAL_APPOINTMENT_PAGE_LIMIT = 250;
export const CLINICAL_NOTE_HISTORY_PAGE_LIMIT = 100;
export const CLINICAL_RECORD_PAGE_LIMIT = 100;
export const CLINICAL_NOTE_LIST_PAGE_LIMIT = 50;
export const CLINICAL_PATIENT_LIST_PAGE_LIMIT = 100;
export const CLINICAL_RUNTIME_MODELS = [
  "appointment",
  "clinicalNote",
  "neonatalRecord",
  "patient",
  "pregnancyRecord"
] as const;

export const PREGNANCY_RISK_LEVEL = {
  HIGH: "HIGH"
} as const;

export const PREGNANCY_STATUS = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
  DELIVERED: "DELIVERED"
} as const;

export const PATIENT_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED"
} as const;

export const APPOINTMENT_STATUS = {
  CANCELLED: "CANCELLED",
  CHECKED_IN: "CHECKED_IN",
  COMPLETED: "COMPLETED",
  NO_SHOW: "NO_SHOW",
  SCHEDULED: "SCHEDULED"
} as const;

export const APPOINTMENT_TYPE = {
  PRENATAL: "PRENATAL"
} as const;

export const NEONATAL_OUTCOME = {
  ALIVE: "ALIVE",
  STILLBIRTH: "STILLBIRTH"
} as const;

export const PREGNANCY_OUTCOME = {
  LIVE_BIRTH: "LIVE_BIRTH",
  STILLBIRTH: "STILLBIRTH"
} as const;

export const CLINICAL_NOTE_KIND = {
  SOAP: "SOAP"
} as const;

export type PregnancyRiskLevel = "HIGH" | "LOW" | "MODERATE";
export type PregnancyStatus = keyof typeof PREGNANCY_STATUS;
export type PatientStatus = "ACTIVE" | "ARCHIVED" | "INACTIVE";
export type AppointmentStatus = keyof typeof APPOINTMENT_STATUS;
export type AppointmentType = keyof typeof APPOINTMENT_TYPE;
export type PregnancyOutcome = "LIVE_BIRTH" | "STILLBIRTH";
export type NeonatalOutcome = "ALIVE" | "ICU" | "STILLBIRTH" | "TRANSFERRED";
export type ClinicalNoteKind = keyof typeof CLINICAL_NOTE_KIND;
export type NeonatalSex = "FEMALE" | "MALE" | "UNDETERMINED";

export type PatientRecord = {
  allergies: string[];
  birthDate: Date | null;
  bloodType: string | null;
  chronicConditions: string[];
  createdAt: Date;
  documentId: string | null;
  email: string | null;
  fullName: string;
  id: string;
  medicalRecordNumber: string | null;
  notes: string | null;
  phone: string | null;
  preferredName: string | null;
  status: PatientStatus;
  updatedAt: Date;
};

export type PregnancyRecordModel = {
  abortions: number;
  complications: string[];
  createdAt: Date;
  estimatedDeliveryDate: Date | null;
  fetalCount: number;
  gravidity: number;
  id: string;
  lastMenstrualPeriod: Date | null;
  notes: string | null;
  outcome: PregnancyOutcome | null;
  outcomeDate: Date | null;
  parity: number;
  previousCesareans: number;
  riskLevel: PregnancyRiskLevel;
  status: PregnancyStatus;
  updatedAt: Date;
};

export type AppointmentRecord = {
  bloodPressureDiastolic: number | null;
  bloodPressureSystolic: number | null;
  chiefComplaint: string | null;
  createdAt: Date;
  durationMinutes: number;
  fetalHeartRateBpm: number | null;
  fetalWeightGrams: number | null;
  fundalHeightCm: number | null;
  id: string;
  location: string | null;
  patient?: {
    fullName: string;
    id: string;
    preferredName: string | null;
  } | null;
  patientId: string;
  pregnancyRecordId: string | null;
  providerName: string | null;
  scheduledAt: Date;
  status: AppointmentStatus;
  summary: string | null;
  temperatureC: number | null;
  type: AppointmentType;
  updatedAt: Date;
  weightKg: number | null;
};

export type ClinicalNoteRecord = {
  appointmentId: string | null;
  assessment: string | null;
  author?: {
    id: string;
    name: string;
  } | null;
  content: Prisma.JsonValue | null;
  createdAt: Date;
  id: string;
  isLatest: boolean;
  kind: ClinicalNoteKind;
  noteGroupId: string;
  objective: string | null;
  patientId: string;
  plan: string | null;
  pregnancyRecordId: string | null;
  subjective: string | null;
  title: string | null;
  updatedAt: Date;
  version: number;
};

export type ClinicalAlert = {
  description: string;
  id: string;
  severity: "high" | "low" | "medium";
  title: string;
};

export type NeonatalRecordModel = {
  apgar1: number | null;
  apgar5: number | null;
  birthLengthCm: number | null;
  birthWeightGrams: number | null;
  bornAt: Date;
  createdAt: Date;
  headCircumferenceCm: number | null;
  id: string;
  newbornName: string | null;
  notes: string | null;
  outcome: NeonatalOutcome;
  sex: NeonatalSex | null;
  updatedAt: Date;
};

export type GrowthCurvePoint = {
  appointmentId: string;
  deviationPercent: number | null;
  fetalWeightGrams: number;
  gestationalWeek: number;
  recordedAt: string;
  referenceGrams: number | null;
};

export type ReferenceWeightPoint = {
  grams: number;
  week: number;
};

export const FETAL_WEIGHT_REFERENCE_POINTS: ReferenceWeightPoint[] = [
  { grams: 320, week: 20 },
  { grams: 630, week: 24 },
  { grams: 1005, week: 28 },
  { grams: 1700, week: 32 },
  { grams: 2620, week: 36 },
  { grams: 3400, week: 40 }
];

export function assertFound<T>(value: T | null, detail: string): T {
  if (!value) {
    throw new ProblemDetailsError({
      detail,
      status: 404,
      title: "Not Found"
    });
  }

  return value;
}

export function resolvePageLimit(requested: number | undefined, max: number): number {
  if (!requested || Number.isNaN(requested) || requested <= 0) {
    return max;
  }

  return Math.min(requested, max);
}

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function normalizeOptionalString(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeStringArray(value: string[] | undefined): string[] {
  return (value ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function parseOptionalDate(value: string | null | undefined): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ProblemDetailsError({
      detail: `Invalid date value '${value}'.`,
      status: 400,
      title: "Bad Request"
    });
  }

  return parsed;
}

export function parseRequiredDate(value: string | null | undefined, fieldName: string): Date {
  const parsed = parseOptionalDate(value);
  if (!parsed) {
    throw new ProblemDetailsError({
      detail: `${fieldName} is required.`,
      status: 400,
      title: "Bad Request"
    });
  }

  return parsed;
}

export function toPrismaJsonInput(
  value: Prisma.JsonValue | null | undefined
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

export function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function calculateEstimatedDeliveryDate(input: {
  estimatedDeliveryDate?: Date | null;
  lastMenstrualPeriod?: Date | null;
}): Date | null {
  if (input.estimatedDeliveryDate) {
    return input.estimatedDeliveryDate;
  }

  if (!input.lastMenstrualPeriod) {
    return null;
  }

  return addDays(input.lastMenstrualPeriod, 280);
}

export function calculateGestationalAgeDays(input: {
  estimatedDeliveryDate?: Date | null;
  lastMenstrualPeriod?: Date | null;
  referenceDate?: Date;
}): number | null {
  const referenceDate = input.referenceDate ?? new Date();

  if (input.lastMenstrualPeriod) {
    return Math.floor(
      (startOfDay(referenceDate).getTime() - startOfDay(input.lastMenstrualPeriod).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  const estimatedDeliveryDate = calculateEstimatedDeliveryDate(input);
  if (!estimatedDeliveryDate) {
    return null;
  }

  return 280 - Math.floor(
    (startOfDay(estimatedDeliveryDate).getTime() - startOfDay(referenceDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export function formatGestationalAge(days: number | null): string | null {
  if (days === null || days < 0) {
    return null;
  }

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  return `${weeks} sem ${remainingDays} d`;
}

export function calculateDaysUntil(referenceDate: Date, targetDate: Date | null): number | null {
  if (!targetDate) {
    return null;
  }

  return Math.ceil(
    (startOfDay(targetDate).getTime() - startOfDay(referenceDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export function interpolateReferenceWeight(gestationalWeek: number): number | null {
  if (!Number.isFinite(gestationalWeek)) {
    return null;
  }

  const sorted = FETAL_WEIGHT_REFERENCE_POINTS;
  if (gestationalWeek <= sorted[0]!.week) {
    return sorted[0]!.grams;
  }
  if (gestationalWeek >= sorted[sorted.length - 1]!.week) {
    return sorted[sorted.length - 1]!.grams;
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index]!;
    const next = sorted[index + 1]!;
    if (gestationalWeek >= current.week && gestationalWeek <= next.week) {
      const ratio = (gestationalWeek - current.week) / (next.week - current.week);
      return Math.round(current.grams + (next.grams - current.grams) * ratio);
    }
  }

  return null;
}

export function serializePatient(record: PatientRecord) {
  return {
    allergies: record.allergies,
    birthDate: toIsoString(record.birthDate),
    bloodType: record.bloodType,
    chronicConditions: record.chronicConditions,
    createdAt: record.createdAt.toISOString(),
    documentId: record.documentId,
    email: record.email,
    fullName: record.fullName,
    id: record.id,
    medicalRecordNumber: record.medicalRecordNumber,
    notes: record.notes,
    phone: record.phone,
    preferredName: record.preferredName,
    status: record.status,
    updatedAt: record.updatedAt.toISOString()
  };
}

export function serializePregnancyRecord(record: PregnancyRecordModel) {
  const estimatedDeliveryDate = calculateEstimatedDeliveryDate(record);
  const gestationalAgeDays = calculateGestationalAgeDays(record);
  const daysUntilDueDate = calculateDaysUntil(new Date(), estimatedDeliveryDate);

  return {
    abortions: record.abortions,
    complications: record.complications,
    createdAt: record.createdAt.toISOString(),
    daysUntilDueDate,
    estimatedDeliveryDate: toIsoString(estimatedDeliveryDate),
    fetalCount: record.fetalCount,
    gestationalAgeDays,
    gestationalAgeLabel: formatGestationalAge(gestationalAgeDays),
    gravidity: record.gravidity,
    id: record.id,
    lastMenstrualPeriod: toIsoString(record.lastMenstrualPeriod),
    notes: record.notes,
    outcome: record.outcome,
    outcomeDate: toIsoString(record.outcomeDate),
    parity: record.parity,
    previousCesareans: record.previousCesareans,
    riskLevel: record.riskLevel,
    status: record.status,
    updatedAt: record.updatedAt.toISOString()
  };
}

export function serializeAppointment(record: AppointmentRecord) {
  return {
    bloodPressureDiastolic: record.bloodPressureDiastolic,
    bloodPressureSystolic: record.bloodPressureSystolic,
    chiefComplaint: record.chiefComplaint,
    createdAt: record.createdAt.toISOString(),
    durationMinutes: record.durationMinutes,
    fetalHeartRateBpm: record.fetalHeartRateBpm,
    fetalWeightGrams: record.fetalWeightGrams,
    fundalHeightCm: record.fundalHeightCm,
    id: record.id,
    location: record.location,
    patient: record.patient,
    patientId: record.patientId,
    pregnancyRecordId: record.pregnancyRecordId,
    providerName: record.providerName,
    scheduledAt: record.scheduledAt.toISOString(),
    status: record.status,
    summary: record.summary,
    temperatureC: record.temperatureC,
    type: record.type,
    updatedAt: record.updatedAt.toISOString(),
    weightKg: record.weightKg
  };
}

export function serializeClinicalNote(record: ClinicalNoteRecord) {
  return {
    appointmentId: record.appointmentId,
    assessment: record.assessment,
    author: record.author,
    content: record.content,
    createdAt: record.createdAt.toISOString(),
    id: record.id,
    isLatest: record.isLatest,
    kind: record.kind,
    noteGroupId: record.noteGroupId,
    objective: record.objective,
    patientId: record.patientId,
    plan: record.plan,
    pregnancyRecordId: record.pregnancyRecordId,
    subjective: record.subjective,
    title: record.title,
    updatedAt: record.updatedAt.toISOString(),
    version: record.version
  };
}

export function serializeNeonatalRecord(record: NeonatalRecordModel) {
  return {
    apgar1: record.apgar1,
    apgar5: record.apgar5,
    birthLengthCm: record.birthLengthCm,
    birthWeightGrams: record.birthWeightGrams,
    bornAt: record.bornAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    headCircumferenceCm: record.headCircumferenceCm,
    id: record.id,
    newbornName: record.newbornName,
    notes: record.notes,
    outcome: record.outcome,
    sex: record.sex,
    updatedAt: record.updatedAt.toISOString()
  };
}

export function createClinicalAlert(alert: ClinicalAlert): ClinicalAlert {
  return alert;
}

export function deriveRiskAlerts(activePregnancy: PregnancyRecordModel | null): ClinicalAlert[] {
  if (activePregnancy?.riskLevel !== PREGNANCY_RISK_LEVEL.HIGH) {
    return [];
  }

  return [
    createClinicalAlert({
      description: "A gestacao ativa esta marcada como alto risco e precisa de acompanhamento prioritario.",
      id: "high-risk-pregnancy",
      severity: "high",
      title: "Gestacao de alto risco"
    })
  ];
}

export function deriveDueDateAlerts(
  activePregnancy: PregnancyRecordModel | null,
  now: Date
): ClinicalAlert[] {
  const dueDate = calculateEstimatedDeliveryDate(activePregnancy ?? {});
  const daysUntilDueDate = calculateDaysUntil(now, dueDate);

  if (daysUntilDueDate === null) {
    return [];
  }

  if (daysUntilDueDate < 0) {
    return [
      createClinicalAlert({
        description: "A data provavel do parto ja passou e ainda nao existe desfecho registrado.",
        id: "overdue-dpp",
        severity: "high",
        title: "DPP ultrapassada"
      })
    ];
  }

  if (daysUntilDueDate <= 14) {
    return [
      createClinicalAlert({
        description: "A paciente entrou na janela final da gestacao e vale revisar plano de parto e sinais de alerta.",
        id: "near-dpp",
        severity: "medium",
        title: "DPP nas proximas duas semanas"
      })
    ];
  }

  return [];
}

export function deriveAppointmentAlerts(
  latestAppointment: AppointmentRecord | null,
  activePregnancy: PregnancyRecordModel | null,
  now: Date
): ClinicalAlert[] {
  if (!latestAppointment) {
    return activePregnancy
      ? [
          createClinicalAlert({
            description: "Existe gestacao ativa, mas ainda nao ha consulta registrada no modulo clinico.",
            id: "missing-follow-up",
            severity: "medium",
            title: "Sem consultas registradas"
          })
        ]
      : [];
  }

  const alerts: ClinicalAlert[] = [];
  const daysSinceLastAppointment = calculateDaysUntil(latestAppointment.scheduledAt, now);

  if (daysSinceLastAppointment !== null && daysSinceLastAppointment > 28) {
    alerts.push(
      createClinicalAlert({
        description: "Nao ha consulta recente registrada nas ultimas quatro semanas.",
        id: "follow-up-delay",
        severity: "medium",
        title: "Seguimento prenatal em atraso"
      })
    );
  }

  const systolic = latestAppointment.bloodPressureSystolic ?? 0;
  const diastolic = latestAppointment.bloodPressureDiastolic ?? 0;
  if (systolic >= 140 || diastolic >= 90) {
    alerts.push(
      createClinicalAlert({
        description: "A ultima consulta registrou pressao arterial em faixa de atencao.",
        id: "blood-pressure-alert",
        severity: "high",
        title: "Pressao arterial elevada"
      })
    );
  }

  const fetalHeartRate = latestAppointment.fetalHeartRateBpm ?? null;
  if (fetalHeartRate !== null && (fetalHeartRate < 110 || fetalHeartRate > 160)) {
    alerts.push(
      createClinicalAlert({
        description: "A frequencia cardiaca fetal registrada ficou fora da faixa usada pela tela.",
        id: "fetal-heart-rate-alert",
        severity: "medium",
        title: "FCF fora da faixa"
      })
    );
  }

  return alerts;
}

export function deriveMissingClinicalCoverageAlerts(
  activePregnancy: PregnancyRecordModel | null,
  nextAppointment: AppointmentRecord | null,
  latestClinicalNote: ClinicalNoteRecord | null
): ClinicalAlert[] {
  if (!activePregnancy) {
    return [];
  }

  const alerts: ClinicalAlert[] = [];

  if (!nextAppointment) {
    alerts.push(
      createClinicalAlert({
        description: "Nao existe consulta futura agendada para a gestacao ativa.",
        id: "missing-next-appointment",
        severity: "low",
        title: "Agenda futura ausente"
      })
    );
  }

  if (!latestClinicalNote) {
    alerts.push(
      createClinicalAlert({
        description: "Ainda nao existe nota clinica versionada para esta paciente.",
        id: "missing-clinical-note",
        severity: "low",
        title: "Sem nota clinica"
      })
    );
  }

  return alerts;
}

export function findNextAppointment(
  appointments: AppointmentRecord[],
  now: Date = new Date()
): AppointmentRecord | null {
  return (
    [...appointments]
      .filter((appointment) => appointment.scheduledAt >= now)
      .sort((left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime())[0] ?? null
  );
}

export function deriveClinicalAlerts(input: {
  activePregnancy: PregnancyRecordModel | null;
  latestAppointment: AppointmentRecord | null;
  latestClinicalNote: ClinicalNoteRecord | null;
  nextAppointment: AppointmentRecord | null;
}) {
  const now = new Date();

  return [
    ...deriveRiskAlerts(input.activePregnancy),
    ...deriveDueDateAlerts(input.activePregnancy, now),
    ...deriveAppointmentAlerts(input.latestAppointment, input.activePregnancy, now),
    ...deriveMissingClinicalCoverageAlerts(
      input.activePregnancy,
      input.nextAppointment,
      input.latestClinicalNote
    )
  ];
}

export function buildGrowthCurve(input: {
  activePregnancy: PregnancyRecordModel | null;
  appointments: AppointmentRecord[];
}): GrowthCurvePoint[] {
  const activePregnancy = input.activePregnancy;
  if (!activePregnancy) {
    return [];
  }

  return input.appointments
    .filter((appointment) => appointment.fetalWeightGrams !== null)
    .map((appointment) => {
      const gestationalAgeDays = calculateGestationalAgeDays({
        estimatedDeliveryDate: calculateEstimatedDeliveryDate(activePregnancy),
        lastMenstrualPeriod: activePregnancy.lastMenstrualPeriod,
        referenceDate: appointment.scheduledAt
      });
      const gestationalWeek = gestationalAgeDays ? Math.max(1, Math.round(gestationalAgeDays / 7)) : 0;
      const referenceGrams = gestationalWeek > 0 ? interpolateReferenceWeight(gestationalWeek) : null;
      const deviationPercent =
        referenceGrams && appointment.fetalWeightGrams
          ? Math.round(((appointment.fetalWeightGrams - referenceGrams) / referenceGrams) * 100)
          : null;

      return {
        appointmentId: appointment.id,
        deviationPercent,
        fetalWeightGrams: appointment.fetalWeightGrams ?? 0,
        gestationalWeek,
        recordedAt: appointment.scheduledAt.toISOString(),
        referenceGrams
      };
    })
    .filter((point) => point.gestationalWeek > 0)
    .sort((left, right) => left.gestationalWeek - right.gestationalWeek);
}
