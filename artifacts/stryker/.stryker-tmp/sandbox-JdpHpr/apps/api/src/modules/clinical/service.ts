// @ts-nocheck
// 
import { randomUUID } from "node:crypto";

import {
  AppointmentStatus,
  AppointmentType,
  ClinicalNoteKind,
  NeonatalOutcome,
  NeonatalSex,
  PatientStatus,
  PregnancyOutcome,
  PregnancyRiskLevel,
  PregnancyStatus,
  Prisma,
  prisma,
  withTenantDatabaseContext
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";

type ClinicalContext = {
  organizationId: string;
  tenantId: string;
  userId?: string | null;
};

type DateWindowView = "day" | "month" | "week";

const CLINICAL_APPOINTMENT_PAGE_LIMIT = 250;
const CLINICAL_NOTE_HISTORY_PAGE_LIMIT = 100;
const CLINICAL_RECORD_PAGE_LIMIT = 100;

type PatientRecord = {
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

type PregnancyRecordModel = {
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

type AppointmentRecord = {
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

type ClinicalNoteRecord = {
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

type NeonatalRecordModel = {
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

type GrowthCurvePoint = {
  appointmentId: string;
  deviationPercent: number | null;
  fetalWeightGrams: number;
  gestationalWeek: number;
  recordedAt: string;
  referenceGrams: number | null;
};

type ReferenceWeightPoint = {
  grams: number;
  week: number;
};

const FETAL_WEIGHT_REFERENCE_POINTS: ReferenceWeightPoint[] = [
  { grams: 320, week: 20 },
  { grams: 630, week: 24 },
  { grams: 1005, week: 28 },
  { grams: 1700, week: 32 },
  { grams: 2620, week: 36 },
  { grams: 3400, week: 40 }
];

function assertFound<T>(value: T | null, detail: string): T {
  if (!value) {
    throw new ProblemDetailsError({
      detail,
      status: 404,
      title: "Not Found"
    });
  }

  return value;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeOptionalString(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeStringArray(value: string[] | undefined): string[] {
  return (value ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseOptionalDate(value: string | null | undefined): Date | null {
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

function parseRequiredDate(value: string | null | undefined, fieldName: string): Date {
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

function toPrismaJsonInput(
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

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function calculateEstimatedDeliveryDate(input: {
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

function calculateGestationalAgeDays(input: {
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

function formatGestationalAge(days: number | null): string | null {
  if (days === null || days < 0) {
    return null;
  }

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  return `${weeks} sem ${remainingDays} d`;
}

function calculateDaysUntil(referenceDate: Date, targetDate: Date | null): number | null {
  if (!targetDate) {
    return null;
  }

  return Math.ceil(
    (startOfDay(targetDate).getTime() - startOfDay(referenceDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function interpolateReferenceWeight(gestationalWeek: number): number | null {
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

function serializePatient(record: PatientRecord) {
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

function serializePregnancyRecord(record: PregnancyRecordModel) {
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

function serializeAppointment(record: AppointmentRecord) {
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

function serializeClinicalNote(record: ClinicalNoteRecord) {
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

function serializeNeonatalRecord(record: NeonatalRecordModel) {
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

function deriveClinicalAlerts(input: {
  activePregnancy: PregnancyRecordModel | null;
  latestAppointment: AppointmentRecord | null;
  latestClinicalNote: ClinicalNoteRecord | null;
  nextAppointment: AppointmentRecord | null;
}) {
  const alerts: Array<{
    description: string;
    id: string;
    severity: "high" | "low" | "medium";
    title: string;
  }> = [];
  const now = new Date();

  if (input.activePregnancy?.riskLevel === PregnancyRiskLevel.HIGH) {
    alerts.push({
      description: "A gestacao ativa esta marcada como alto risco e precisa de acompanhamento prioritario.",
      id: "high-risk-pregnancy",
      severity: "high",
      title: "Gestacao de alto risco"
    });
  }

  const dueDate = calculateEstimatedDeliveryDate(input.activePregnancy ?? {});
  const daysUntilDueDate = calculateDaysUntil(now, dueDate);
  if (daysUntilDueDate !== null && daysUntilDueDate < 0) {
    alerts.push({
      description: "A data provavel do parto ja passou e ainda nao existe desfecho registrado.",
      id: "overdue-dpp",
      severity: "high",
      title: "DPP ultrapassada"
    });
  } else if (daysUntilDueDate !== null && daysUntilDueDate <= 14) {
    alerts.push({
      description: "A paciente entrou na janela final da gestacao e vale revisar plano de parto e sinais de alerta.",
      id: "near-dpp",
      severity: "medium",
      title: "DPP nas proximas duas semanas"
    });
  }

  if (input.latestAppointment) {
    const daysSinceLastAppointment = calculateDaysUntil(
      input.latestAppointment.scheduledAt,
      now
    );

    if (daysSinceLastAppointment !== null && daysSinceLastAppointment > 28) {
      alerts.push({
        description: "Nao ha consulta recente registrada nas ultimas quatro semanas.",
        id: "follow-up-delay",
        severity: "medium",
        title: "Seguimento prenatal em atraso"
      });
    }

    const systolic = input.latestAppointment.bloodPressureSystolic ?? 0;
    const diastolic = input.latestAppointment.bloodPressureDiastolic ?? 0;
    if (systolic >= 140 || diastolic >= 90) {
      alerts.push({
        description: "A ultima consulta registrou pressao arterial em faixa de atencao.",
        id: "blood-pressure-alert",
        severity: "high",
        title: "Pressao arterial elevada"
      });
    }

    const fetalHeartRate = input.latestAppointment.fetalHeartRateBpm ?? null;
    if (fetalHeartRate !== null && (fetalHeartRate < 110 || fetalHeartRate > 160)) {
      alerts.push({
        description: "A frequencia cardiaca fetal registrada ficou fora da faixa usada pela tela.",
        id: "fetal-heart-rate-alert",
        severity: "medium",
        title: "FCF fora da faixa"
      });
    }
  } else if (input.activePregnancy) {
    alerts.push({
      description: "Existe gestacao ativa, mas ainda nao ha consulta registrada no modulo clinico.",
      id: "missing-follow-up",
      severity: "medium",
      title: "Sem consultas registradas"
    });
  }

  if (!input.nextAppointment && input.activePregnancy) {
    alerts.push({
      description: "Nao existe consulta futura agendada para a gestacao ativa.",
      id: "missing-next-appointment",
      severity: "low",
      title: "Agenda futura ausente"
    });
  }

  if (!input.latestClinicalNote && input.activePregnancy) {
    alerts.push({
      description: "Ainda nao existe nota clinica versionada para esta paciente.",
      id: "missing-clinical-note",
      severity: "low",
      title: "Sem nota clinica"
    });
  }

  return alerts;
}

function buildGrowthCurve(input: {
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

function buildPatientWhere(input: {
  organizationId: string;
  riskLevel?: PregnancyRiskLevel | undefined;
  search?: string | undefined;
  status?: PatientStatus | undefined;
  tenantId: string;
}): Prisma.PatientWhereInput {
  const normalizedSearch = input.search?.trim();

  return {
    deletedAt: null,
    organizationId: input.organizationId,
    tenantId: input.tenantId,
    ...(input.status ? { status: input.status } : {}),
    ...(input.riskLevel
      ? {
          pregnancyRecords: {
            some: {
              deletedAt: null,
              riskLevel: input.riskLevel,
              status: PregnancyStatus.ACTIVE
            }
          }
        }
      : {}),
    ...(normalizedSearch
      ? {
          OR: [
            {
              fullName: {
                contains: normalizedSearch,
                mode: "insensitive"
              }
            },
            {
              preferredName: {
                contains: normalizedSearch,
                mode: "insensitive"
              }
            },
            {
              medicalRecordNumber: {
                contains: normalizedSearch,
                mode: "insensitive"
              }
            },
            {
              email: {
                contains: normalizedSearch,
                mode: "insensitive"
              }
            }
          ]
        }
      : {})
  };
}

function buildPatientSelect() {
  return {
    allergies: true,
    birthDate: true,
    bloodType: true,
    chronicConditions: true,
    createdAt: true,
    documentId: true,
    email: true,
    fullName: true,
    id: true,
    medicalRecordNumber: true,
    notes: true,
    phone: true,
    preferredName: true,
    status: true,
    updatedAt: true
  } satisfies Prisma.PatientSelect;
}

function buildPregnancySelect() {
  return {
    abortions: true,
    complications: true,
    createdAt: true,
    estimatedDeliveryDate: true,
    fetalCount: true,
    gravidity: true,
    id: true,
    lastMenstrualPeriod: true,
    notes: true,
    outcome: true,
    outcomeDate: true,
    parity: true,
    previousCesareans: true,
    riskLevel: true,
    status: true,
    updatedAt: true
  } satisfies Prisma.PregnancyRecordSelect;
}

function buildAppointmentSelect(includePatient = true) {
  return {
    bloodPressureDiastolic: true,
    bloodPressureSystolic: true,
    chiefComplaint: true,
    createdAt: true,
    durationMinutes: true,
    fetalHeartRateBpm: true,
    fetalWeightGrams: true,
    fundalHeightCm: true,
    id: true,
    location: true,
    patient: includePatient
      ? {
          select: {
            fullName: true,
            id: true,
            preferredName: true
          }
        }
      : false,
    patientId: true,
    pregnancyRecordId: true,
    providerName: true,
    scheduledAt: true,
    status: true,
    summary: true,
    temperatureC: true,
    type: true,
    updatedAt: true,
    weightKg: true
  } satisfies Prisma.AppointmentSelect;
}

function buildClinicalNoteSelect() {
  return {
    appointmentId: true,
    assessment: true,
    author: {
      select: {
        id: true,
        name: true
      }
    },
    content: true,
    createdAt: true,
    id: true,
    isLatest: true,
    kind: true,
    noteGroupId: true,
    objective: true,
    patientId: true,
    plan: true,
    pregnancyRecordId: true,
    subjective: true,
    title: true,
    updatedAt: true,
    version: true
  } satisfies Prisma.ClinicalNoteSelect;
}

function buildNeonatalSelect() {
  return {
    apgar1: true,
    apgar5: true,
    birthLengthCm: true,
    birthWeightGrams: true,
    bornAt: true,
    createdAt: true,
    headCircumferenceCm: true,
    id: true,
    newbornName: true,
    notes: true,
    outcome: true,
    sex: true,
    updatedAt: true
  } satisfies Prisma.NeonatalRecordSelect;
}

function buildPregnancyMutation(data: {
  abortions?: number;
  complications?: string[];
  estimatedDeliveryDate?: string | null;
  fetalCount?: number;
  gravidity?: number;
  lastMenstrualPeriod?: string | null;
  notes?: string | null;
  outcome?: PregnancyOutcome | null;
  outcomeDate?: string | null;
  parity?: number;
  previousCesareans?: number;
  riskLevel?: PregnancyRiskLevel;
  status?: PregnancyStatus;
}) {
  const lastMenstrualPeriod = parseOptionalDate(data.lastMenstrualPeriod);
  const estimatedDeliveryDate = calculateEstimatedDeliveryDate({
    estimatedDeliveryDate: parseOptionalDate(data.estimatedDeliveryDate),
    lastMenstrualPeriod
  });

  return {
    ...(data.abortions !== undefined ? { abortions: data.abortions } : {}),
    ...(data.fetalCount !== undefined ? { fetalCount: data.fetalCount } : {}),
    ...(data.gravidity !== undefined ? { gravidity: data.gravidity } : {}),
    ...(data.outcome !== undefined ? { outcome: data.outcome } : {}),
    ...(data.parity !== undefined ? { parity: data.parity } : {}),
    ...(data.previousCesareans !== undefined ? { previousCesareans: data.previousCesareans } : {}),
    ...(data.riskLevel !== undefined ? { riskLevel: data.riskLevel } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    complications: normalizeStringArray(data.complications),
    estimatedDeliveryDate,
    lastMenstrualPeriod,
    notes: normalizeOptionalString(data.notes),
    outcomeDate: parseOptionalDate(data.outcomeDate)
  };
}

function buildDateWindow(anchorDate: string | undefined, view: DateWindowView) {
  const reference = parseOptionalDate(anchorDate ?? null) ?? new Date();
  const anchor = startOfDay(reference);
  const from = new Date(anchor);
  let to = new Date(anchor);

  if (view === "day") {
    to = addDays(from, 1);
  } else if (view === "week") {
    const day = from.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = addDays(from, diffToMonday);
    weekStart.setHours(0, 0, 0, 0);
    from.setTime(weekStart.getTime());
    to = addDays(from, 7);
  } else {
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setMonth(to.getMonth() + 1);
  }

  return {
    anchorDate: from.toISOString().slice(0, 10),
    from,
    label:
      view === "day"
        ? "Agenda do dia"
        : view === "week"
          ? "Agenda da semana"
          : "Agenda do mes",
    to,
    view
  };
}

async function listPregnancyRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<PregnancyRecordModel[]> {
  const records: PregnancyRecordModel[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Prisma.PregnancyRecordFindManyArgs = {
      orderBy: [
        { status: "asc" },
        { estimatedDeliveryDate: "desc" },
        { createdAt: "desc" },
        { id: "desc" }
      ],
      select: buildPregnancySelect(),
      take: CLINICAL_RECORD_PAGE_LIMIT,
      where: {
        deletedAt: null,
        organizationId: context.organizationId,
        patientId,
        tenantId: context.tenantId
      }
    };

    if (cursorId) {
      findArgs.cursor = { id: cursorId };
      findArgs.skip = 1;
    }

    const page = await tx.pregnancyRecord.findMany(findArgs);
    records.push(...page);

    if (page.length < CLINICAL_RECORD_PAGE_LIMIT) {
      return records;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listNeonatalRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<NeonatalRecordModel[]> {
  const records: NeonatalRecordModel[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Prisma.NeonatalRecordFindManyArgs = {
      orderBy: [{ bornAt: "desc" }, { id: "desc" }],
      select: buildNeonatalSelect(),
      take: CLINICAL_RECORD_PAGE_LIMIT,
      where: {
        deletedAt: null,
        organizationId: context.organizationId,
        patientId,
        tenantId: context.tenantId
      }
    };

    if (cursorId) {
      findArgs.cursor = { id: cursorId };
      findArgs.skip = 1;
    }

    const page = await tx.neonatalRecord.findMany(findArgs);
    records.push(...page);

    if (page.length < CLINICAL_RECORD_PAGE_LIMIT) {
      return records;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listAppointmentsInWindow(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  filters: {
    patientId?: string;
    status?: AppointmentStatus;
  },
  window: {
    from: Date;
    to: Date;
  }
): Promise<AppointmentRecord[]> {
  const items: AppointmentRecord[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Prisma.AppointmentFindManyArgs = {
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }, { id: "asc" }],
      select: buildAppointmentSelect(true),
      take: CLINICAL_APPOINTMENT_PAGE_LIMIT,
      where: {
        deletedAt: null,
        organizationId: context.organizationId,
        scheduledAt: {
          gte: window.from,
          lt: window.to
        },
        tenantId: context.tenantId,
        ...(filters.patientId ? { patientId: filters.patientId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        patient: {
          deletedAt: null
        }
      }
    };

    if (cursorId) {
      findArgs.cursor = { id: cursorId };
      findArgs.skip = 1;
    }

    const page = await tx.appointment.findMany(findArgs);
    items.push(...page);

    if (page.length < CLINICAL_APPOINTMENT_PAGE_LIMIT) {
      return items;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listClinicalNoteHistoryRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  noteGroupId: string
): Promise<ClinicalNoteRecord[]> {
  const items: ClinicalNoteRecord[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Prisma.ClinicalNoteFindManyArgs = {
      orderBy: [{ version: "desc" }, { id: "desc" }],
      select: buildClinicalNoteSelect(),
      take: CLINICAL_NOTE_HISTORY_PAGE_LIMIT,
      where: {
        deletedAt: null,
        noteGroupId,
        organizationId: context.organizationId,
        tenantId: context.tenantId
      }
    };

    if (cursorId) {
      findArgs.cursor = { id: cursorId };
      findArgs.skip = 1;
    }

    const page = await tx.clinicalNote.findMany(findArgs);
    items.push(...page);

    if (page.length < CLINICAL_NOTE_HISTORY_PAGE_LIMIT) {
      return items;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function findActivePregnancy(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<PregnancyRecordModel | null> {
  return tx.pregnancyRecord.findFirst({
    orderBy: [{ estimatedDeliveryDate: "asc" }, { createdAt: "desc" }],
    select: buildPregnancySelect(),
    where: {
      deletedAt: null,
      organizationId: context.organizationId,
      patientId,
      status: PregnancyStatus.ACTIVE,
      tenantId: context.tenantId
    }
  });
}

async function getClinicalNoteRecord(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  noteId: string
): Promise<ClinicalNoteRecord> {
  return assertFound(
    await tx.clinicalNote.findFirst({
      select: buildClinicalNoteSelect(),
      where: {
        deletedAt: null,
        id: noteId,
        organizationId: context.organizationId,
        tenantId: context.tenantId
      }
    }),
    "Clinical note could not be loaded for the active tenant."
  );
}

async function getPatientDetailInternal(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
) {
  const patient = assertFound(
    await tx.patient.findFirst({
      select: buildPatientSelect(),
      where: {
        deletedAt: null,
        id: patientId,
        organizationId: context.organizationId,
        tenantId: context.tenantId
      }
    }),
    "Patient was not found for the active tenant."
  );

  const pregnancyRecords = await listPregnancyRecords(tx, context, patientId);

  const appointments = await tx.appointment.findMany({
    orderBy: { scheduledAt: "desc" },
    select: buildAppointmentSelect(false),
    take: 24,
    where: {
      deletedAt: null,
      organizationId: context.organizationId,
      patientId,
      tenantId: context.tenantId
    }
  });

  const clinicalNotes = await tx.clinicalNote.findMany({
    orderBy: [{ updatedAt: "desc" }, { version: "desc" }],
    select: buildClinicalNoteSelect(),
    take: 20,
    where: {
      deletedAt: null,
      isLatest: true,
      organizationId: context.organizationId,
      patientId,
      tenantId: context.tenantId
    }
  });

  const neonatalRecords = await listNeonatalRecords(tx, context, patientId);

  const activePregnancy = pregnancyRecords.find((item) => item.status === PregnancyStatus.ACTIVE) ?? null;
  const latestAppointment = appointments[0] ?? null;
  const nextAppointment =
    [...appointments]
      .filter((appointment) => appointment.scheduledAt >= new Date())
      .sort((left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime())[0] ?? null;
  const latestClinicalNote = clinicalNotes[0] ?? null;

  return {
    activePregnancy: activePregnancy ? serializePregnancyRecord(activePregnancy) : null,
    alerts: deriveClinicalAlerts({
      activePregnancy,
      latestAppointment,
      latestClinicalNote,
      nextAppointment
    }),
    clinicalNotes: clinicalNotes.map((item) => serializeClinicalNote(item)),
    growthCurve: buildGrowthCurve({
      activePregnancy,
      appointments
    }),
    neonatalRecords: neonatalRecords.map((item) => serializeNeonatalRecord(item)),
    patient: serializePatient(patient),
    pregnancyRecords: pregnancyRecords.map((item) => serializePregnancyRecord(item)),
    recentAppointments: appointments.slice(0, 6).map((item) => serializeAppointment(item)),
    upcomingAppointments: appointments
      .filter((appointment) => appointment.scheduledAt >= new Date())
      .sort((left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime())
      .slice(0, 6)
      .map((item) => serializeAppointment(item))
  };
}

export const clinicalService = {
  async createPatient(
    context: ClinicalContext,
    payload: {
      allergies?: string[];
      birthDate?: string | null;
      bloodType?: string | null;
      chronicConditions?: string[];
      documentId?: string | null;
      email?: string | null;
      fullName: string;
      medicalRecordNumber?: string | null;
      notes?: string | null;
      phone?: string | null;
      preferredName?: string | null;
      pregnancyRecord?: {
        abortions?: number;
        complications?: string[];
        estimatedDeliveryDate?: string | null;
        fetalCount?: number;
        gravidity?: number;
        lastMenstrualPeriod?: string | null;
        notes?: string | null;
        outcome?: PregnancyOutcome | null;
        outcomeDate?: string | null;
        parity?: number;
        previousCesareans?: number;
        riskLevel?: PregnancyRiskLevel;
        status?: PregnancyStatus;
      };
      status?: PatientStatus;
    }
  ) {
    const patientId = await withTenantDatabaseContext(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          allergies: normalizeStringArray(payload.allergies),
          birthDate: parseOptionalDate(payload.birthDate),
          bloodType: normalizeOptionalString(payload.bloodType),
          chronicConditions: normalizeStringArray(payload.chronicConditions),
          documentId: normalizeOptionalString(payload.documentId),
          email: normalizeOptionalString(payload.email),
          fullName: payload.fullName.trim(),
          medicalRecordNumber: normalizeOptionalString(payload.medicalRecordNumber),
          notes: normalizeOptionalString(payload.notes),
          organizationId: context.organizationId,
          phone: normalizeOptionalString(payload.phone),
          preferredName: normalizeOptionalString(payload.preferredName),
          status: payload.status ?? PatientStatus.ACTIVE,
          tenantId: context.tenantId
        },
        select: {
          id: true
        }
      });

      if (payload.pregnancyRecord) {
        await tx.pregnancyRecord.create({
          data: {
            ...buildPregnancyMutation(payload.pregnancyRecord),
            organizationId: context.organizationId,
            patientId: patient.id,
            tenantId: context.tenantId
          }
        });
      }

      return patient.id;
    }, prisma);

    return this.getPatientDetail(context, patientId);
  },

  async listPatients(
    context: ClinicalContext,
    filters: {
      riskLevel?: PregnancyRiskLevel;
      search?: string;
      status?: PatientStatus;
    }
  ) {
    return withTenantDatabaseContext(async (tx) => {
      const patients = await tx.patient.findMany({
        include: {
          appointments: {
            orderBy: {
              scheduledAt: "desc"
            },
            select: buildAppointmentSelect(false),
            take: 8,
            where: {
              deletedAt: null,
              tenantId: context.tenantId
            }
          },
          clinicalNotes: {
            orderBy: {
              updatedAt: "desc"
            },
            select: buildClinicalNoteSelect(),
            take: 1,
            where: {
              deletedAt: null,
              isLatest: true,
              tenantId: context.tenantId
            }
          },
          pregnancyRecords: {
            orderBy: [{ estimatedDeliveryDate: "asc" }, { createdAt: "desc" }],
            select: buildPregnancySelect(),
            take: 3,
            where: {
              deletedAt: null,
              tenantId: context.tenantId
            }
          },
          ...buildPatientSelect()
        },
        orderBy: [{ createdAt: "desc" }, { fullName: "asc" }],
        take: 100,
        where: buildPatientWhere({
          organizationId: context.organizationId,
          riskLevel: filters.riskLevel,
          search: filters.search,
          status: filters.status,
          tenantId: context.tenantId
        })
      });

      return {
        items: patients.map((patient) => {
          const activePregnancy =
            patient.pregnancyRecords.find((record) => record.status === PregnancyStatus.ACTIVE) ?? null;
          const nextAppointment =
            [...patient.appointments]
              .filter((appointment) => appointment.scheduledAt >= new Date())
              .sort((left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime())[0] ?? null;
          const latestAppointment = patient.appointments[0] ?? null;
          const latestClinicalNote = patient.clinicalNotes[0] ?? null;
          const alerts = deriveClinicalAlerts({
            activePregnancy,
            latestAppointment,
            latestClinicalNote,
            nextAppointment
          });

          return {
            activePregnancy: activePregnancy ? serializePregnancyRecord(activePregnancy) : null,
            alertCount: alerts.length,
            nextAppointment: nextAppointment ? serializeAppointment(nextAppointment) : null,
            patient: serializePatient(patient)
          };
        })
      };
    }, prisma);
  },

  async getPatientDetail(context: ClinicalContext, patientId: string) {
    return withTenantDatabaseContext(
      async (tx) => getPatientDetailInternal(tx, context, patientId),
      prisma
    );
  },

  async updatePatient(
    context: ClinicalContext,
    patientId: string,
    payload: {
      allergies?: string[];
      birthDate?: string | null;
      bloodType?: string | null;
      chronicConditions?: string[];
      documentId?: string | null;
      email?: string | null;
      fullName?: string;
      medicalRecordNumber?: string | null;
      notes?: string | null;
      phone?: string | null;
      preferredName?: string | null;
      status?: PatientStatus;
    }
  ) {
    await withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for update."
      );

      await tx.patient.updateMany({
        data: {
          ...(payload.fullName ? { fullName: payload.fullName.trim() } : {}),
          ...(payload.status ? { status: payload.status } : {}),
          ...(payload.birthDate !== undefined ? { birthDate: parseOptionalDate(payload.birthDate) } : {}),
          ...(payload.bloodType !== undefined
            ? { bloodType: normalizeOptionalString(payload.bloodType) }
            : {}),
          ...(payload.documentId !== undefined
            ? { documentId: normalizeOptionalString(payload.documentId) }
            : {}),
          ...(payload.email !== undefined ? { email: normalizeOptionalString(payload.email) } : {}),
          ...(payload.medicalRecordNumber !== undefined
            ? { medicalRecordNumber: normalizeOptionalString(payload.medicalRecordNumber) }
            : {}),
          ...(payload.notes !== undefined ? { notes: normalizeOptionalString(payload.notes) } : {}),
          ...(payload.phone !== undefined ? { phone: normalizeOptionalString(payload.phone) } : {}),
          ...(payload.preferredName !== undefined
            ? { preferredName: normalizeOptionalString(payload.preferredName) }
            : {}),
          ...(payload.allergies !== undefined ? { allergies: normalizeStringArray(payload.allergies) } : {}),
          ...(payload.chronicConditions !== undefined
            ? { chronicConditions: normalizeStringArray(payload.chronicConditions) }
            : {})
        },
        where: {
          deletedAt: null,
          id: patientId,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });
    }, prisma);

    return this.getPatientDetail(context, patientId);
  },

  async deletePatient(context: ClinicalContext, patientId: string) {
    const deletedAt = new Date();

    return withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for deletion."
      );

      await Promise.all([
        tx.patient.updateMany({
          data: {
            deletedAt,
            status: PatientStatus.ARCHIVED
          },
          where: {
            deletedAt: null,
            id: patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        tx.pregnancyRecord.updateMany({
          data: {
            deletedAt,
            status: PregnancyStatus.CLOSED
          },
          where: {
            deletedAt: null,
            organizationId: context.organizationId,
            patientId,
            tenantId: context.tenantId
          }
        }),
        tx.appointment.updateMany({
          data: {
            deletedAt,
            status: AppointmentStatus.CANCELLED
          },
          where: {
            deletedAt: null,
            organizationId: context.organizationId,
            patientId,
            tenantId: context.tenantId
          }
        }),
        tx.clinicalNote.updateMany({
          data: {
            deletedAt,
            isLatest: false,
            supersededAt: deletedAt
          },
          where: {
            deletedAt: null,
            organizationId: context.organizationId,
            patientId,
            tenantId: context.tenantId
          }
        }),
        tx.neonatalRecord.updateMany({
          data: {
            deletedAt
          },
          where: {
            deletedAt: null,
            organizationId: context.organizationId,
            patientId,
            tenantId: context.tenantId
          }
        })
      ]);

      return {
        deleted: true,
        patientId
      };
    }, prisma);
  },

  async savePregnancyRecord(
    context: ClinicalContext,
    input: {
      patientId: string;
      payload: {
        abortions?: number;
        complications?: string[];
        estimatedDeliveryDate?: string | null;
        fetalCount?: number;
        gravidity?: number;
        lastMenstrualPeriod?: string | null;
        notes?: string | null;
        outcome?: PregnancyOutcome | null;
        outcomeDate?: string | null;
        parity?: number;
        previousCesareans?: number;
        riskLevel?: PregnancyRiskLevel;
        status?: PregnancyStatus;
      };
      recordId?: string;
    }
  ) {
    await withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: input.patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for pregnancy save."
      );

      if (input.recordId) {
        assertFound(
          await tx.pregnancyRecord.findFirst({
            select: {
              id: true
            },
            where: {
              deletedAt: null,
              id: input.recordId,
              organizationId: context.organizationId,
              patientId: input.patientId,
              tenantId: context.tenantId
            }
          }),
          "Pregnancy record was not found."
        );

        if (input.payload.status === PregnancyStatus.ACTIVE) {
          await tx.pregnancyRecord.updateMany({
            data: {
              status: PregnancyStatus.CLOSED
            },
            where: {
              deletedAt: null,
              id: {
                not: input.recordId
              },
              organizationId: context.organizationId,
              patientId: input.patientId,
              status: PregnancyStatus.ACTIVE,
              tenantId: context.tenantId
            }
          });
        }

        await tx.pregnancyRecord.updateMany({
          data: buildPregnancyMutation(input.payload),
          where: {
            deletedAt: null,
            id: input.recordId,
            organizationId: context.organizationId,
            patientId: input.patientId,
            tenantId: context.tenantId
          }
        });
      } else {
        if ((input.payload.status ?? PregnancyStatus.ACTIVE) === PregnancyStatus.ACTIVE) {
          await tx.pregnancyRecord.updateMany({
            data: {
              status: PregnancyStatus.CLOSED
            },
            where: {
              deletedAt: null,
              organizationId: context.organizationId,
              patientId: input.patientId,
              status: PregnancyStatus.ACTIVE,
              tenantId: context.tenantId
            }
          });
        }

        await tx.pregnancyRecord.create({
          data: {
            ...buildPregnancyMutation(input.payload),
            organizationId: context.organizationId,
            patientId: input.patientId,
            status: input.payload.status ?? PregnancyStatus.ACTIVE,
            tenantId: context.tenantId
          }
        });
      }
    }, prisma);

    return this.getPatientDetail(context, input.patientId);
  },

  async saveNeonatalRecord(
    context: ClinicalContext,
    input: {
      patientId: string;
      payload: {
        apgar1?: number;
        apgar5?: number;
        birthLengthCm?: number;
        birthWeightGrams?: number;
        bornAt: string;
        headCircumferenceCm?: number;
        newbornName?: string | null;
        notes?: string | null;
        outcome?: NeonatalOutcome;
        pregnancyRecordId?: string | null;
        sex?: NeonatalSex | null;
      };
      recordId?: string;
    }
  ) {
    await withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: input.patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for neonatal save."
      );

      const activePregnancy = await findActivePregnancy(tx, context, input.patientId);
      const pregnancyRecordId =
        normalizeOptionalString(input.payload.pregnancyRecordId) ?? activePregnancy?.id ?? null;

      const neonatalData = {
        ...(input.payload.apgar1 !== undefined ? { apgar1: input.payload.apgar1 } : {}),
        ...(input.payload.apgar5 !== undefined ? { apgar5: input.payload.apgar5 } : {}),
        ...(input.payload.birthLengthCm !== undefined
          ? { birthLengthCm: input.payload.birthLengthCm }
          : {}),
        ...(input.payload.birthWeightGrams !== undefined
          ? { birthWeightGrams: input.payload.birthWeightGrams }
          : {}),
        ...(input.payload.headCircumferenceCm !== undefined
          ? { headCircumferenceCm: input.payload.headCircumferenceCm }
          : {}),
        ...(input.payload.outcome !== undefined ? { outcome: input.payload.outcome } : {}),
        ...(input.payload.sex !== undefined ? { sex: input.payload.sex } : {}),
        bornAt: parseRequiredDate(input.payload.bornAt, "bornAt"),
        newbornName: normalizeOptionalString(input.payload.newbornName),
        notes: normalizeOptionalString(input.payload.notes),
        pregnancyRecordId
      };

      if (input.recordId) {
        assertFound(
          await tx.neonatalRecord.findFirst({
            select: {
              id: true
            },
            where: {
              deletedAt: null,
              id: input.recordId,
              organizationId: context.organizationId,
              patientId: input.patientId,
              tenantId: context.tenantId
            }
          }),
          "Neonatal record was not found."
        );

        await tx.neonatalRecord.updateMany({
          data: neonatalData,
          where: {
            deletedAt: null,
            id: input.recordId,
            organizationId: context.organizationId,
            patientId: input.patientId,
            tenantId: context.tenantId
          }
        });
      } else {
        await tx.neonatalRecord.create({
          data: {
            ...neonatalData,
            organizationId: context.organizationId,
            patientId: input.patientId,
            tenantId: context.tenantId
          }
        });
      }

      if (pregnancyRecordId) {
        await tx.pregnancyRecord.updateMany({
          data: {
            outcome:
              (input.payload.outcome ?? NeonatalOutcome.ALIVE) === NeonatalOutcome.STILLBIRTH
                ? PregnancyOutcome.STILLBIRTH
                : PregnancyOutcome.LIVE_BIRTH,
            outcomeDate: parseRequiredDate(input.payload.bornAt, "bornAt"),
            status: PregnancyStatus.DELIVERED
          },
          where: {
            deletedAt: null,
            id: pregnancyRecordId,
            organizationId: context.organizationId,
            patientId: input.patientId,
            tenantId: context.tenantId
          }
        });
      }
    }, prisma);

    return this.getPatientDetail(context, input.patientId);
  },

  async listAppointments(
    context: ClinicalContext,
    filters: {
      anchorDate?: string;
      patientId?: string;
      status?: AppointmentStatus;
      view: DateWindowView;
    }
  ) {
    return withTenantDatabaseContext(async (tx) => {
      const window = buildDateWindow(filters.anchorDate, filters.view);
      const appointmentFilters: {
        patientId?: string;
        status?: AppointmentStatus;
      } = {};

      if (filters.patientId) {
        appointmentFilters.patientId = filters.patientId;
      }

      if (filters.status) {
        appointmentFilters.status = filters.status;
      }

      const items = await listAppointmentsInWindow(tx, context, appointmentFilters, window);

      const summary = items.reduce(
        (accumulator, item) => {
          accumulator.total += 1;
          if (item.status === AppointmentStatus.SCHEDULED || item.status === AppointmentStatus.CHECKED_IN) {
            accumulator.scheduled += 1;
          }
          if (item.status === AppointmentStatus.COMPLETED) {
            accumulator.completed += 1;
          }
          if (item.status === AppointmentStatus.CANCELLED || item.status === AppointmentStatus.NO_SHOW) {
            accumulator.cancelled += 1;
          }
          return accumulator;
        },
        {
          cancelled: 0,
          completed: 0,
          scheduled: 0,
          total: 0
        }
      );

      return {
        items: items.map((item) => serializeAppointment(item)),
        summary,
        window: {
          anchorDate: window.anchorDate,
          from: window.from.toISOString(),
          label: window.label,
          to: window.to.toISOString(),
          view: window.view
        }
      };
    }, prisma);
  },

  async getAppointment(context: ClinicalContext, appointmentId: string) {
    return withTenantDatabaseContext(async (tx) => {
      const appointment = assertFound(
        await tx.appointment.findFirst({
          select: buildAppointmentSelect(true),
          where: {
            deletedAt: null,
            id: appointmentId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Appointment was not found for the active tenant."
      );

      return {
        appointment: serializeAppointment(appointment)
      };
    }, prisma);
  },

  async createAppointment(
    context: ClinicalContext,
    payload: {
      bloodPressureDiastolic?: number;
      bloodPressureSystolic?: number;
      chiefComplaint?: string | null;
      durationMinutes?: number;
      fetalHeartRateBpm?: number;
      fetalWeightGrams?: number;
      fundalHeightCm?: number;
      location?: string | null;
      patientId: string;
      pregnancyRecordId?: string | null;
      providerName?: string | null;
      scheduledAt: string;
      status?: AppointmentStatus;
      summary?: string | null;
      temperatureC?: number;
      type?: AppointmentType;
      weightKg?: number;
    }
  ) {
    const appointmentId = await withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: payload.patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for appointment creation."
      );

      const activePregnancy = payload.pregnancyRecordId
        ? null
        : await findActivePregnancy(tx, context, payload.patientId);

      const appointment = await tx.appointment.create({
        data: {
          ...(payload.bloodPressureDiastolic !== undefined
            ? { bloodPressureDiastolic: payload.bloodPressureDiastolic }
            : {}),
          ...(payload.bloodPressureSystolic !== undefined
            ? { bloodPressureSystolic: payload.bloodPressureSystolic }
            : {}),
          ...(payload.durationMinutes !== undefined ? { durationMinutes: payload.durationMinutes } : {}),
          ...(payload.fetalHeartRateBpm !== undefined ? { fetalHeartRateBpm: payload.fetalHeartRateBpm } : {}),
          ...(payload.fetalWeightGrams !== undefined ? { fetalWeightGrams: payload.fetalWeightGrams } : {}),
          ...(payload.fundalHeightCm !== undefined ? { fundalHeightCm: payload.fundalHeightCm } : {}),
          ...(payload.temperatureC !== undefined ? { temperatureC: payload.temperatureC } : {}),
          ...(payload.weightKg !== undefined ? { weightKg: payload.weightKg } : {}),
          chiefComplaint: normalizeOptionalString(payload.chiefComplaint),
          location: normalizeOptionalString(payload.location),
          organizationId: context.organizationId,
          patientId: payload.patientId,
          pregnancyRecordId: normalizeOptionalString(payload.pregnancyRecordId) ?? activePregnancy?.id ?? null,
          providerName: normalizeOptionalString(payload.providerName),
          scheduledAt: parseRequiredDate(payload.scheduledAt, "scheduledAt"),
          status: payload.status ?? AppointmentStatus.SCHEDULED,
          summary: normalizeOptionalString(payload.summary),
          tenantId: context.tenantId,
          type: payload.type ?? AppointmentType.PRENATAL
        },
        select: {
          id: true
        }
      });

      return appointment.id;
    }, prisma);

    return this.getAppointment(context, appointmentId);
  },

  async updateAppointment(
    context: ClinicalContext,
    appointmentId: string,
    payload: {
      bloodPressureDiastolic?: number;
      bloodPressureSystolic?: number;
      chiefComplaint?: string | null;
      durationMinutes?: number;
      fetalHeartRateBpm?: number;
      fetalWeightGrams?: number;
      fundalHeightCm?: number;
      location?: string | null;
      pregnancyRecordId?: string | null;
      providerName?: string | null;
      scheduledAt?: string;
      status?: AppointmentStatus;
      summary?: string | null;
      temperatureC?: number;
      type?: AppointmentType;
      weightKg?: number;
    }
  ) {
    await withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.appointment.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: appointmentId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Appointment was not found for update."
      );

      await tx.appointment.updateMany({
        data: {
          ...(payload.bloodPressureDiastolic !== undefined
            ? { bloodPressureDiastolic: payload.bloodPressureDiastolic }
            : {}),
          ...(payload.bloodPressureSystolic !== undefined
            ? { bloodPressureSystolic: payload.bloodPressureSystolic }
            : {}),
          ...(payload.durationMinutes !== undefined ? { durationMinutes: payload.durationMinutes } : {}),
          ...(payload.fetalHeartRateBpm !== undefined ? { fetalHeartRateBpm: payload.fetalHeartRateBpm } : {}),
          ...(payload.fetalWeightGrams !== undefined ? { fetalWeightGrams: payload.fetalWeightGrams } : {}),
          ...(payload.fundalHeightCm !== undefined ? { fundalHeightCm: payload.fundalHeightCm } : {}),
          ...(payload.temperatureC !== undefined ? { temperatureC: payload.temperatureC } : {}),
          ...(payload.weightKg !== undefined ? { weightKg: payload.weightKg } : {}),
          ...(payload.type !== undefined ? { type: payload.type } : {}),
          ...(payload.status !== undefined ? { status: payload.status } : {}),
          ...(payload.scheduledAt !== undefined
            ? { scheduledAt: parseRequiredDate(payload.scheduledAt, "scheduledAt") }
            : {}),
          ...(payload.pregnancyRecordId !== undefined
            ? { pregnancyRecordId: normalizeOptionalString(payload.pregnancyRecordId) }
            : {}),
          ...(payload.chiefComplaint !== undefined
            ? { chiefComplaint: normalizeOptionalString(payload.chiefComplaint) }
            : {}),
          ...(payload.location !== undefined ? { location: normalizeOptionalString(payload.location) } : {}),
          ...(payload.providerName !== undefined
            ? { providerName: normalizeOptionalString(payload.providerName) }
            : {}),
          ...(payload.summary !== undefined ? { summary: normalizeOptionalString(payload.summary) } : {})
        },
        where: {
          deletedAt: null,
          id: appointmentId,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });
    }, prisma);

    return this.getAppointment(context, appointmentId);
  },

  async deleteAppointment(context: ClinicalContext, appointmentId: string) {
    return withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.appointment.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: appointmentId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Appointment was not found for deletion."
      );

      await tx.appointment.updateMany({
        data: {
          deletedAt: new Date(),
          status: AppointmentStatus.CANCELLED
        },
        where: {
          deletedAt: null,
          id: appointmentId,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });

      return {
        appointmentId,
        deleted: true
      };
    }, prisma);
  },

  async listClinicalNotes(
    context: ClinicalContext,
    filters: {
      appointmentId?: string;
      patientId?: string;
    }
  ) {
    return withTenantDatabaseContext(async (tx) => {
      const items = await tx.clinicalNote.findMany({
        orderBy: [{ updatedAt: "desc" }, { version: "desc" }],
        select: buildClinicalNoteSelect(),
        take: 50,
        where: {
          deletedAt: null,
          isLatest: true,
          organizationId: context.organizationId,
          tenantId: context.tenantId,
          ...(filters.appointmentId ? { appointmentId: filters.appointmentId } : {}),
          ...(filters.patientId ? { patientId: filters.patientId } : {})
        }
      });

      return {
        items: items.map((item) => serializeClinicalNote(item))
      };
    }, prisma);
  },

  async getClinicalNoteHistory(context: ClinicalContext, noteGroupId: string) {
    return withTenantDatabaseContext(async (tx) => {
      const items = await listClinicalNoteHistoryRecords(tx, context, noteGroupId);

      if (items.length === 0) {
        throw new ProblemDetailsError({
          detail: "Clinical note history was not found.",
          status: 404,
          title: "Not Found"
        });
      }

      return {
        items: items.map((item) => serializeClinicalNote(item))
      };
    }, prisma);
  },

  async createClinicalNote(
    context: ClinicalContext,
    payload: {
      appointmentId?: string | null;
      assessment?: string | null;
      content?: Prisma.JsonValue | null;
      kind?: ClinicalNoteKind;
      objective?: string | null;
      patientId: string;
      plan?: string | null;
      pregnancyRecordId?: string | null;
      subjective?: string | null;
      title?: string | null;
    }
  ) {
    const noteGroupId = randomUUID();

    return withTenantDatabaseContext(async (tx) => {
      assertFound(
        await tx.patient.findFirst({
          select: {
            id: true
          },
          where: {
            deletedAt: null,
            id: payload.patientId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Patient was not found for note creation."
      );

      const appointment = payload.appointmentId
        ? await tx.appointment.findFirst({
            select: {
              id: true,
              pregnancyRecordId: true
            },
            where: {
              deletedAt: null,
              id: payload.appointmentId,
              organizationId: context.organizationId,
              patientId: payload.patientId,
              tenantId: context.tenantId
            }
          })
        : null;

      const activePregnancy =
        normalizeOptionalString(payload.pregnancyRecordId) || appointment?.pregnancyRecordId
          ? null
          : await findActivePregnancy(tx, context, payload.patientId);
      const content = toPrismaJsonInput(payload.content);

      const createdNote = await tx.clinicalNote.create({
        data: {
          appointmentId: normalizeOptionalString(payload.appointmentId),
          assessment: normalizeOptionalString(payload.assessment),
          authoredByUserId: context.userId ?? null,
          ...(content !== undefined ? { content } : {}),
          isLatest: true,
          kind: payload.kind ?? ClinicalNoteKind.SOAP,
          noteGroupId,
          objective: normalizeOptionalString(payload.objective),
          organizationId: context.organizationId,
          patientId: payload.patientId,
          plan: normalizeOptionalString(payload.plan),
          pregnancyRecordId:
            normalizeOptionalString(payload.pregnancyRecordId) ??
            appointment?.pregnancyRecordId ??
            activePregnancy?.id ??
            null,
          subjective: normalizeOptionalString(payload.subjective),
          tenantId: context.tenantId,
          title: normalizeOptionalString(payload.title),
          version: 1
        },
        select: {
          id: true
        }
      });
      const note = await getClinicalNoteRecord(tx, context, createdNote.id);

      return {
        note: serializeClinicalNote(note)
      };
    }, prisma);
  },

  async updateClinicalNote(
    context: ClinicalContext,
    noteGroupId: string,
    payload: {
      appointmentId?: string | null;
      assessment?: string | null;
      content?: Prisma.JsonValue | null;
      kind?: ClinicalNoteKind;
      objective?: string | null;
      plan?: string | null;
      pregnancyRecordId?: string | null;
      subjective?: string | null;
      title?: string | null;
    }
  ) {
    return withTenantDatabaseContext(async (tx) => {
      const current = assertFound(
        await tx.clinicalNote.findFirst({
          orderBy: {
            version: "desc"
          },
          select: {
            appointmentId: true,
            assessment: true,
            content: true,
            id: true,
            kind: true,
            objective: true,
            patientId: true,
            plan: true,
            pregnancyRecordId: true,
            subjective: true,
            title: true,
            version: true
          },
          where: {
            deletedAt: null,
            isLatest: true,
            noteGroupId,
            organizationId: context.organizationId,
            tenantId: context.tenantId
          }
        }),
        "Clinical note was not found for update."
      );

      const now = new Date();
      await tx.clinicalNote.updateMany({
        data: {
          isLatest: false,
          supersededAt: now
        },
        where: {
          deletedAt: null,
          id: current.id,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });
      const content =
        payload.content !== undefined
          ? toPrismaJsonInput(payload.content)
          : toPrismaJsonInput(current.content);

      const createdNote = await tx.clinicalNote.create({
        data: {
          appointmentId:
            payload.appointmentId !== undefined
              ? normalizeOptionalString(payload.appointmentId)
              : current.appointmentId,
          assessment:
            payload.assessment !== undefined
              ? normalizeOptionalString(payload.assessment)
              : current.assessment,
          authoredByUserId: context.userId ?? null,
          ...(content !== undefined ? { content } : {}),
          isLatest: true,
          kind: payload.kind ?? current.kind,
          noteGroupId,
          objective:
            payload.objective !== undefined
              ? normalizeOptionalString(payload.objective)
              : current.objective,
          organizationId: context.organizationId,
          patientId: current.patientId,
          plan: payload.plan !== undefined ? normalizeOptionalString(payload.plan) : current.plan,
          pregnancyRecordId:
            payload.pregnancyRecordId !== undefined
              ? normalizeOptionalString(payload.pregnancyRecordId)
              : current.pregnancyRecordId,
          previousVersionId: current.id,
          subjective:
            payload.subjective !== undefined
              ? normalizeOptionalString(payload.subjective)
              : current.subjective,
          tenantId: context.tenantId,
          title: payload.title !== undefined ? normalizeOptionalString(payload.title) : current.title,
          version: current.version + 1
        },
        select: {
          id: true
        }
      });
      const note = await getClinicalNoteRecord(tx, context, createdNote.id);

      return {
        note: serializeClinicalNote(note)
      };
    }, prisma);
  },

  async deleteClinicalNote(context: ClinicalContext, noteGroupId: string) {
    return withTenantDatabaseContext(async (tx) => {
      const existing = await tx.clinicalNote.findFirst({
        select: {
          id: true
        },
        where: {
          deletedAt: null,
          noteGroupId,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });

      if (!existing) {
        throw new ProblemDetailsError({
          detail: "Clinical note was not found for deletion.",
          status: 404,
          title: "Not Found"
        });
      }

      await tx.clinicalNote.updateMany({
        data: {
          deletedAt: new Date(),
          isLatest: false
        },
        where: {
          deletedAt: null,
          noteGroupId,
          organizationId: context.organizationId,
          tenantId: context.tenantId
        }
      });

      return {
        deleted: true,
        noteGroupId
      };
    }, prisma);
  }
};
