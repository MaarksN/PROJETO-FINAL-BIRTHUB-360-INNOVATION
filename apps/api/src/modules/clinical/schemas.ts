// @ts-nocheck
import {
  AppointmentStatus,
  AppointmentType,
  ClinicalNoteKind,
  NeonatalOutcome,
  NeonatalSex,
  PatientStatus,
  PregnancyOutcome,
  PregnancyRiskLevel,
  PregnancyStatus
} from "@birthub/database";
import { z } from "zod";

const optionalTrimmedString = z.string().trim().min(1).optional();
const optionalStringArray = z.array(z.string().trim().min(1)).optional().default([]);
const optionalDateString = z.string().trim().min(4).optional();
const optionalNumber = z.coerce.number().optional();
const optionalInteger = z.coerce.number().int().optional();

export const patientListQuerySchema = z.object({
  riskLevel: z.nativeEnum(PregnancyRiskLevel).optional(),
  search: z.string().trim().optional(),
  status: z.nativeEnum(PatientStatus).optional()
});

export const pregnancyRecordSchema = z.object({
  abortions: optionalInteger,
  complications: optionalStringArray,
  estimatedDeliveryDate: optionalDateString,
  fetalCount: z.coerce.number().int().min(1).max(5).optional(),
  gravidity: z.coerce.number().int().min(0).optional(),
  lastMenstrualPeriod: optionalDateString,
  notes: optionalTrimmedString,
  outcome: z.nativeEnum(PregnancyOutcome).nullable().optional(),
  outcomeDate: optionalDateString,
  parity: z.coerce.number().int().min(0).optional(),
  previousCesareans: z.coerce.number().int().min(0).optional(),
  riskLevel: z.nativeEnum(PregnancyRiskLevel).optional(),
  status: z.nativeEnum(PregnancyStatus).optional()
});

export const createPatientSchema = z.object({
  allergies: optionalStringArray,
  birthDate: optionalDateString,
  bloodType: optionalTrimmedString,
  chronicConditions: optionalStringArray,
  documentId: optionalTrimmedString,
  email: z.string().email().optional(),
  fullName: z.string().trim().min(2),
  medicalRecordNumber: optionalTrimmedString,
  notes: optionalTrimmedString,
  phone: optionalTrimmedString,
  preferredName: optionalTrimmedString,
  pregnancyRecord: pregnancyRecordSchema.optional(),
  status: z.nativeEnum(PatientStatus).optional()
});

export const updatePatientSchema = createPatientSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one patient field is required."
  }
);

export const neonatalRecordSchema = z.object({
  apgar1: z.coerce.number().int().min(0).max(10).optional(),
  apgar5: z.coerce.number().int().min(0).max(10).optional(),
  birthLengthCm: optionalNumber,
  birthWeightGrams: optionalInteger,
  bornAt: z.string().trim().min(4),
  headCircumferenceCm: optionalNumber,
  newbornName: optionalTrimmedString,
  notes: optionalTrimmedString,
  outcome: z.nativeEnum(NeonatalOutcome).optional(),
  pregnancyRecordId: optionalTrimmedString,
  sex: z.nativeEnum(NeonatalSex).nullable().optional()
});

export const appointmentQuerySchema = z.object({
  date: z.string().trim().optional(),
  patientId: z.string().trim().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  view: z.enum(["day", "week", "month"]).default("week")
});

export const createAppointmentSchema = z.object({
  bloodPressureDiastolic: optionalInteger,
  bloodPressureSystolic: optionalInteger,
  chiefComplaint: optionalTrimmedString,
  durationMinutes: z.coerce.number().int().positive().max(480).optional(),
  fetalHeartRateBpm: optionalInteger,
  fetalWeightGrams: optionalInteger,
  fundalHeightCm: optionalNumber,
  location: optionalTrimmedString,
  patientId: z.string().trim().min(1),
  pregnancyRecordId: optionalTrimmedString,
  providerName: optionalTrimmedString,
  scheduledAt: z.string().trim().min(4),
  status: z.nativeEnum(AppointmentStatus).optional(),
  summary: optionalTrimmedString,
  temperatureC: optionalNumber,
  type: z.nativeEnum(AppointmentType).optional(),
  weightKg: optionalNumber
});

const { patientId: _appointmentPatientId, scheduledAt: _appointmentScheduledAt, ...appointmentUpdateShape } =
  createAppointmentSchema.shape;

export const updateAppointmentSchema = z
  .object({
    ...appointmentUpdateShape,
    scheduledAt: z.string().trim().min(4).optional()
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one appointment field is required."
  });

export const clinicalNoteQuerySchema = z
  .object({
    appointmentId: z.string().trim().optional(),
    patientId: z.string().trim().optional()
  })
  .refine((value) => Boolean(value.appointmentId || value.patientId), {
    message: "patientId or appointmentId is required."
  });

const clinicalNoteObjectSchema = z.object({
  appointmentId: optionalTrimmedString,
  assessment: optionalTrimmedString,
  content: z.record(z.string(), z.unknown()).nullable().optional(),
  kind: z.nativeEnum(ClinicalNoteKind).optional(),
  objective: optionalTrimmedString,
  patientId: z.string().trim().min(1),
  plan: optionalTrimmedString,
  pregnancyRecordId: optionalTrimmedString,
  subjective: optionalTrimmedString,
  title: optionalTrimmedString
});

export const clinicalNoteSchema = clinicalNoteObjectSchema
  .refine(
    (value) =>
      Boolean(
        value.title ||
          value.subjective ||
          value.objective ||
          value.assessment ||
          value.plan ||
          value.content
      ),
    {
      message: "At least one clinical note section is required."
    }
  );

const { patientId: _clinicalNotePatientId, ...clinicalNoteUpdateShape } =
  clinicalNoteObjectSchema.shape;

export const clinicalNoteUpdateSchema = z
  .object(clinicalNoteUpdateShape)
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one clinical note field is required."
  });
