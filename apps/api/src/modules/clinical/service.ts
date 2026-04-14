import { randomUUID } from "node:crypto";

import {
  Prisma,
  prisma,
  withTenantDatabaseContext
} from "@birthub/database";

import {
  assertPrismaModelsAvailable,
  readPrismaModel
} from "../../lib/prisma-runtime.js";
import { ProblemDetailsError } from "../../lib/problem-details.js";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
  CLINICAL_APPOINTMENT_PAGE_LIMIT,
  CLINICAL_RUNTIME_MODELS,
  CLINICAL_NOTE_HISTORY_PAGE_LIMIT,
  CLINICAL_NOTE_KIND,
  CLINICAL_NOTE_LIST_PAGE_LIMIT,
  CLINICAL_PATIENT_LIST_PAGE_LIMIT,
  CLINICAL_RECORD_PAGE_LIMIT,
  NEONATAL_OUTCOME,
  PATIENT_STATUS,
  PREGNANCY_OUTCOME,
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
  parseRequiredDate,
  resolvePageLimit,
  serializeAppointment,
  serializeClinicalNote,
  serializeNeonatalRecord,
  serializePatient,
  serializePregnancyRecord,
  startOfDay,
  toPrismaJsonInput,
  type AppointmentRecord,
  type AppointmentStatus,
  type AppointmentType,
  type ClinicalContext,
  type ClinicalNoteKind,
  type ClinicalNoteRecord,
  type DateWindowView,
  type NeonatalOutcome,
  type NeonatalRecordModel,
  type NeonatalSex,
  type PatientRecord,
  type PatientStatus,
  type PregnancyStatus,
  type PregnancyRiskLevel,
  type PregnancyOutcome,
  type PregnancyRecordModel
} from "./service-support.js";

type ClinicalModelQuery = {
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

type ClinicalModelDelegate = {
  create<TResult extends object>(args: ClinicalModelQuery & { data: object }): Promise<TResult>;
  findFirst<TResult extends object>(
    args: Omit<ClinicalModelQuery, "cursor" | "data" | "skip" | "take">
  ): Promise<TResult | null>;
  findMany<TResult extends object>(
    args: Omit<ClinicalModelQuery, "data">
  ): Promise<TResult[]>;
  updateMany(args: ClinicalModelQuery & { data: object; where: object }): Promise<Prisma.BatchPayload>;
};

type ClinicalTransactionClient = Prisma.TransactionClient & {
  appointment: ClinicalModelDelegate;
  clinicalNote: ClinicalModelDelegate;
  neonatalRecord: ClinicalModelDelegate;
  patient: ClinicalModelDelegate;
  pregnancyRecord: ClinicalModelDelegate;
};

type PatientListRecord = {
  appointments: AppointmentRecord[];
  clinicalNotes: ClinicalNoteRecord[];
  pregnancyRecords: PregnancyRecordModel[];
} & PatientRecord;

function asClinicalTransaction(tx: Prisma.TransactionClient): ClinicalTransactionClient {
  readPrismaModel<ClinicalModelDelegate>(tx, "appointment", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "clinicalNote", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "neonatalRecord", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "patient", "the clinical module");
  readPrismaModel<ClinicalModelDelegate>(tx, "pregnancyRecord", "the clinical module");

  return tx as unknown as ClinicalTransactionClient;
}

function ensureClinicalRuntimeAvailable(): void {
  assertPrismaModelsAvailable(prisma, CLINICAL_RUNTIME_MODELS, "the clinical module");
}

function buildPatientWhere(input: {
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
  } as const;
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
  } as const;
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
  } as const;
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
      status: PREGNANCY_STATUS.ACTIVE,
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

  const activePregnancy = pregnancyRecords.find((item) => item.status === PREGNANCY_STATUS.ACTIVE) ?? null;
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
    ensureClinicalRuntimeAvailable();

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
          status: payload.status ?? PATIENT_STATUS.ACTIVE,
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
      limit?: number;
      riskLevel?: PregnancyRiskLevel;
      search?: string;
      status?: PatientStatus;
    }
  ) {
    ensureClinicalRuntimeAvailable();

    return withTenantDatabaseContext(async (tx) => {
      const patientPageLimit = resolvePageLimit(
        filters.limit,
        CLINICAL_PATIENT_LIST_PAGE_LIMIT
      );
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
        take: patientPageLimit,
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
            patient.pregnancyRecords.find((record) => record.status === PREGNANCY_STATUS.ACTIVE) ?? null;
          const nextAppointment = findNextAppointment(patient.appointments);
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
        }),
        pageSize: patientPageLimit
      };
    }, prisma);
  },

  async getPatientDetail(context: ClinicalContext, patientId: string) {
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
            status: PATIENT_STATUS.ARCHIVED
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
            status: PREGNANCY_STATUS.CLOSED
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
            status: APPOINTMENT_STATUS.CANCELLED
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
    ensureClinicalRuntimeAvailable();

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

        if (input.payload.status === PREGNANCY_STATUS.ACTIVE) {
          await tx.pregnancyRecord.updateMany({
            data: {
              status: PREGNANCY_STATUS.CLOSED
            },
            where: {
              deletedAt: null,
              id: {
                not: input.recordId
              },
              organizationId: context.organizationId,
              patientId: input.patientId,
              status: PREGNANCY_STATUS.ACTIVE,
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
        if ((input.payload.status ?? PREGNANCY_STATUS.ACTIVE) === PREGNANCY_STATUS.ACTIVE) {
          await tx.pregnancyRecord.updateMany({
            data: {
              status: PREGNANCY_STATUS.CLOSED
            },
            where: {
              deletedAt: null,
              organizationId: context.organizationId,
              patientId: input.patientId,
              status: PREGNANCY_STATUS.ACTIVE,
              tenantId: context.tenantId
            }
          });
        }

        await tx.pregnancyRecord.create({
          data: {
            ...buildPregnancyMutation(input.payload),
            organizationId: context.organizationId,
            patientId: input.patientId,
            status: input.payload.status ?? PREGNANCY_STATUS.ACTIVE,
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
    ensureClinicalRuntimeAvailable();

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
              (input.payload.outcome ?? NEONATAL_OUTCOME.ALIVE) === NEONATAL_OUTCOME.STILLBIRTH
                ? PREGNANCY_OUTCOME.STILLBIRTH
                : PREGNANCY_OUTCOME.LIVE_BIRTH,
            outcomeDate: parseRequiredDate(input.payload.bornAt, "bornAt"),
            status: PREGNANCY_STATUS.DELIVERED
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
    ensureClinicalRuntimeAvailable();

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
          if (item.status === APPOINTMENT_STATUS.SCHEDULED || item.status === APPOINTMENT_STATUS.CHECKED_IN) {
            accumulator.scheduled += 1;
          }
          if (item.status === APPOINTMENT_STATUS.COMPLETED) {
            accumulator.completed += 1;
          }
          if (item.status === APPOINTMENT_STATUS.CANCELLED || item.status === APPOINTMENT_STATUS.NO_SHOW) {
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
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
          status: payload.status ?? APPOINTMENT_STATUS.SCHEDULED,
          summary: normalizeOptionalString(payload.summary),
          tenantId: context.tenantId,
          type: payload.type ?? APPOINTMENT_TYPE.PRENATAL
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
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
          status: APPOINTMENT_STATUS.CANCELLED
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
      limit?: number;
      patientId?: string;
    }
  ) {
    ensureClinicalRuntimeAvailable();

    return withTenantDatabaseContext(async (tx) => {
      const notePageLimit = resolvePageLimit(filters.limit, CLINICAL_NOTE_LIST_PAGE_LIMIT);
      const items = await tx.clinicalNote.findMany({
        orderBy: [{ updatedAt: "desc" }, { version: "desc" }],
        select: buildClinicalNoteSelect(),
        take: notePageLimit,
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
        items: items.map((item) => serializeClinicalNote(item)),
        pageSize: notePageLimit
      };
    }, prisma);
  },

  async getClinicalNoteHistory(context: ClinicalContext, noteGroupId: string) {
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
          kind: payload.kind ?? CLINICAL_NOTE_KIND.SOAP,
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
    ensureClinicalRuntimeAvailable();

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
    ensureClinicalRuntimeAvailable();

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
