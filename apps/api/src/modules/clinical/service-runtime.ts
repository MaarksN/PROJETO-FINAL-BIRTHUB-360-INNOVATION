import {
  Prisma,
  prisma
} from "@birthub/database";

import {
  assertPrismaModelsAvailable,
  readPrismaModel
} from "../../lib/prisma-runtime.js";
import {
  APPOINTMENT_STATUS,
  CLINICAL_APPOINTMENT_PAGE_LIMIT,
  CLINICAL_RUNTIME_MODELS,
  CLINICAL_NOTE_HISTORY_PAGE_LIMIT,
  CLINICAL_NOTE_KIND,
  CLINICAL_RECORD_PAGE_LIMIT,
  PREGNANCY_STATUS,
  addDays,
  assertFound,
  buildGrowthCurve,
  calculateEstimatedDeliveryDate,
  deriveClinicalAlerts,
  findNextAppointment,
  normalizeOptionalString,
  normalizeStringArray,
  parseOptionalDate,
  serializeAppointment,
  serializeClinicalNote,
  serializeNeonatalRecord,
  serializePatient,
  serializePregnancyRecord,
  startOfDay,
  type AppointmentRecord,
  type AppointmentStatus,
  type ClinicalContext,
  type ClinicalNoteRecord,
  type DateWindowView,
  type NeonatalRecordModel,
  type PatientRecord,
  type PatientStatus,
  type PregnancyRiskLevel,
  type PregnancyOutcome,
  type PregnancyRecordModel,
  type PregnancyStatus
} from "./service-support.js";

export type ClinicalModelQuery = {
  cursor?: {
    id: string;
  };
  data?: object;
  include?: object;
  orderBy?: object | object[];
  select?: object;
  skip?: number;
  take?: number;
  where?: object;
};

export type ClinicalModelDelegate = {
  create<TResult extends object>(args: ClinicalModelQuery & { data: object }): Promise<TResult>;
  findFirst<TResult extends object>(
    args: Omit<ClinicalModelQuery, "cursor" | "data" | "skip" | "take">
  ): Promise<TResult | null>;
  findMany<TResult extends object>(
    args: Omit<ClinicalModelQuery, "data">
  ): Promise<TResult[]>;
  updateMany(
    args: ClinicalModelQuery & { data: object; where: object }
  ): Promise<Prisma.BatchPayload>;
};

export type ClinicalTransactionClient = Prisma.TransactionClient & {
  appointment: ClinicalModelDelegate;
  clinicalNote: ClinicalModelDelegate;
  neonatalRecord: ClinicalModelDelegate;
  patient: ClinicalModelDelegate;
  pregnancyRecord: ClinicalModelDelegate;
};

export type PatientListRecord = {
  appointments: AppointmentRecord[];
  clinicalNotes: ClinicalNoteRecord[];
  pregnancyRecords: PregnancyRecordModel[];
} & PatientRecord;

export function asClinicalTransaction(
  tx: Prisma.TransactionClient
): ClinicalTransactionClient {
  readPrismaModel<ClinicalModelDelegate>(tx, "appointment", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "clinicalNote", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "neonatalRecord", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "patient", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "pregnancyRecord", "the clinical module");

  return tx as unknown as ClinicalTransactionClient;
}

export function ensureClinicalRuntimeAvailable(): void {
  assertPrismaModelsAvailable(prisma, CLINICAL_RUNTIME_MODELS, "the clinical module");
}

export function buildPatientWhere(input: {
  organizationId: string;
  riskLevel?: PregnancyRiskLevel | undefined;
  search?: string | undefined;
  status?: PatientStatus | undefined;
  tenantId: string;
}) {
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
              status: PREGNANCY_STATUS.ACTIVE
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

export function buildPatientSelect() {
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
  } as const;
}

export function buildPregnancySelect() {
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
  } as const;
}

export function buildAppointmentSelect(includePatient = true) {
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
  } as const;
}

export function buildClinicalNoteSelect() {
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
  } as const;
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
  } as const;
}

export function buildPregnancyMutation(data: {
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

export function buildDateWindow(
  anchorDate: string | undefined,
  view: DateWindowView
) {
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

export async function listPregnancyRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<PregnancyRecordModel[]> {
  const clinicalTx = asClinicalTransaction(tx);
  const records: PregnancyRecordModel[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Omit<ClinicalModelQuery, "data"> = {
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

    const page = await clinicalTx.pregnancyRecord.findMany<PregnancyRecordModel>(findArgs);
    records.push(...page);

    if (page.length < CLINICAL_RECORD_PAGE_LIMIT) {
      return records;
    }

    cursorId = page.at(-1)?.id;
  }
}

export async function listNeonatalRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<NeonatalRecordModel[]> {
  const clinicalTx = asClinicalTransaction(tx);
  const records: NeonatalRecordModel[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Omit<ClinicalModelQuery, "data"> = {
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

    const page = await clinicalTx.neonatalRecord.findMany<NeonatalRecordModel>(findArgs);
    records.push(...page);

    if (page.length < CLINICAL_RECORD_PAGE_LIMIT) {
      return records;
    }

    cursorId = page.at(-1)?.id;
  }
}

export async function listAppointmentsInWindow(
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
  const clinicalTx = asClinicalTransaction(tx);
  const items: AppointmentRecord[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Omit<ClinicalModelQuery, "data"> = {
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

    const page = await clinicalTx.appointment.findMany<AppointmentRecord>(findArgs);
    items.push(...page);

    if (page.length < CLINICAL_APPOINTMENT_PAGE_LIMIT) {
      return items;
    }

    cursorId = page.at(-1)?.id;
  }
}

export async function listClinicalNoteHistoryRecords(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  noteGroupId: string
): Promise<ClinicalNoteRecord[]> {
  const clinicalTx = asClinicalTransaction(tx);
  const items: ClinicalNoteRecord[] = [];
  let cursorId: string | undefined;

  while (true) {
    const findArgs: Omit<ClinicalModelQuery, "data"> = {
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

    const page = await clinicalTx.clinicalNote.findMany<ClinicalNoteRecord>(findArgs);
    items.push(...page);

    if (page.length < CLINICAL_NOTE_HISTORY_PAGE_LIMIT) {
      return items;
    }

    cursorId = page.at(-1)?.id;
  }
}

export async function findActivePregnancy(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
): Promise<PregnancyRecordModel | null> {
  return asClinicalTransaction(tx).pregnancyRecord.findFirst<PregnancyRecordModel>({
    orderBy: [{ estimatedDeliveryDate: "asc" }, { createdAt: "desc" }],
    select: buildPregnancySelect(),
    where: {
      deletedAt: null,
      organizationId: context.organizationId,
      patientId,
      status: PREGNANCY_STATUS.ACTIVE,
      tenantId: context.tenantId
    }
  });
}

export async function getClinicalNoteRecord(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  noteId: string
): Promise<ClinicalNoteRecord> {
  return assertFound(
    await asClinicalTransaction(tx).clinicalNote.findFirst<ClinicalNoteRecord>({
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

export async function getPatientDetailInternal(
  tx: Prisma.TransactionClient,
  context: ClinicalContext,
  patientId: string
) {
  const clinicalTx = asClinicalTransaction(tx);
  const patient = assertFound(
    await clinicalTx.patient.findFirst<PatientRecord>({
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

  const appointments = await clinicalTx.appointment.findMany<AppointmentRecord>({
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

  const clinicalNotes = await clinicalTx.clinicalNote.findMany<ClinicalNoteRecord>({
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

  const activePregnancy =
    pregnancyRecords.find((item) => item.status === PREGNANCY_STATUS.ACTIVE) ?? null;
  const latestAppointment = appointments[0] ?? null;
  const nextAppointment = findNextAppointment(appointments);
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
