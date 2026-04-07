CREATE TYPE "PatientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
CREATE TYPE "PregnancyStatus" AS ENUM ('ACTIVE', 'DELIVERED', 'CLOSED');
CREATE TYPE "PregnancyRiskLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');
CREATE TYPE "PregnancyOutcome" AS ENUM ('LIVE_BIRTH', 'STILLBIRTH', 'MISCARRIAGE', 'ABORTION');
CREATE TYPE "AppointmentType" AS ENUM ('PRENATAL', 'ULTRASOUND', 'EXAM', 'POSTPARTUM', 'VACCINATION');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "ClinicalNoteKind" AS ENUM ('SOAP', 'EVOLUTION', 'TRIAGE', 'DISCHARGE');
CREATE TYPE "NeonatalSex" AS ENUM ('FEMALE', 'MALE', 'UNDETERMINED');
CREATE TYPE "NeonatalOutcome" AS ENUM ('ALIVE', 'ICU', 'STILLBIRTH', 'TRANSFERRED');

CREATE TABLE "patients" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "medical_record_number" TEXT,
  "full_name" TEXT NOT NULL,
  "preferred_name" TEXT,
  "birth_date" TIMESTAMP(3),
  "email" TEXT,
  "phone" TEXT,
  "document_id" TEXT,
  "blood_type" TEXT,
  "allergies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "chronic_conditions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" "PatientStatus" NOT NULL DEFAULT 'ACTIVE',
  "notes" TEXT,
  "deleted_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pregnancy_records" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "status" "PregnancyStatus" NOT NULL DEFAULT 'ACTIVE',
  "risk_level" "PregnancyRiskLevel" NOT NULL DEFAULT 'LOW',
  "gravidity" INTEGER NOT NULL DEFAULT 1,
  "parity" INTEGER NOT NULL DEFAULT 0,
  "abortions" INTEGER NOT NULL DEFAULT 0,
  "previous_cesareans" INTEGER NOT NULL DEFAULT 0,
  "fetal_count" INTEGER NOT NULL DEFAULT 1,
  "last_menstrual_period" TIMESTAMP(3),
  "estimated_delivery_date" TIMESTAMP(3),
  "complications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT,
  "outcome" "PregnancyOutcome",
  "outcome_date" TIMESTAMP(3),
  "deleted_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "pregnancy_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "pregnancy_record_id" TEXT,
  "type" "AppointmentType" NOT NULL DEFAULT 'PRENATAL',
  "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
  "scheduled_at" TIMESTAMP(3) NOT NULL,
  "duration_minutes" INTEGER NOT NULL DEFAULT 30,
  "location" TEXT,
  "provider_name" TEXT,
  "chief_complaint" TEXT,
  "summary" TEXT,
  "blood_pressure_systolic" INTEGER,
  "blood_pressure_diastolic" INTEGER,
  "weight_kg" DOUBLE PRECISION,
  "fetal_heart_rate_bpm" INTEGER,
  "fetal_weight_grams" INTEGER,
  "fundal_height_cm" DOUBLE PRECISION,
  "temperature_c" DOUBLE PRECISION,
  "deleted_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "clinical_notes" (
  "id" TEXT NOT NULL,
  "note_group_id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "appointment_id" TEXT,
  "pregnancy_record_id" TEXT,
  "authored_by_user_id" TEXT,
  "kind" "ClinicalNoteKind" NOT NULL DEFAULT 'SOAP',
  "version" INTEGER NOT NULL DEFAULT 1,
  "is_latest" BOOLEAN NOT NULL DEFAULT true,
  "previous_version_id" TEXT,
  "title" TEXT,
  "subjective" TEXT,
  "objective" TEXT,
  "assessment" TEXT,
  "plan" TEXT,
  "content" JSONB,
  "superseded_at" TIMESTAMP(3),
  "deleted_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "clinical_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "neonatal_records" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "pregnancy_record_id" TEXT,
  "newborn_name" TEXT,
  "sex" "NeonatalSex",
  "born_at" TIMESTAMP(3) NOT NULL,
  "birth_weight_grams" INTEGER,
  "birth_length_cm" DOUBLE PRECISION,
  "head_circumference_cm" DOUBLE PRECISION,
  "apgar_1" INTEGER,
  "apgar_5" INTEGER,
  "outcome" "NeonatalOutcome" NOT NULL DEFAULT 'ALIVE',
  "notes" TEXT,
  "deleted_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "neonatal_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patients_organizationId_medical_record_number_key"
  ON "patients"("organizationId", "medical_record_number");
CREATE INDEX "patients_tenantId_idx" ON "patients"("tenantId");
CREATE INDEX "patients_tenantId_id_idx" ON "patients"("tenantId", "id");
CREATE INDEX "patients_tenantId_full_name_idx" ON "patients"("tenantId", "full_name");
CREATE INDEX "patients_tenantId_status_deleted_at_idx" ON "patients"("tenantId", "status", "deleted_at");
CREATE INDEX "patients_organizationId_createdAt_idx" ON "patients"("organizationId", "createdAt");

CREATE INDEX "pregnancy_records_tenantId_idx" ON "pregnancy_records"("tenantId");
CREATE INDEX "pregnancy_records_tenantId_id_idx" ON "pregnancy_records"("tenantId", "id");
CREATE INDEX "pregnancy_records_tenantId_patientId_status_idx"
  ON "pregnancy_records"("tenantId", "patientId", "status");
CREATE INDEX "pregnancy_records_tenantId_risk_level_status_idx"
  ON "pregnancy_records"("tenantId", "risk_level", "status");
CREATE INDEX "pregnancy_records_organizationId_estimated_delivery_date_idx"
  ON "pregnancy_records"("organizationId", "estimated_delivery_date");

CREATE INDEX "appointments_tenantId_idx" ON "appointments"("tenantId");
CREATE INDEX "appointments_tenantId_id_idx" ON "appointments"("tenantId", "id");
CREATE INDEX "appointments_tenantId_scheduled_at_idx" ON "appointments"("tenantId", "scheduled_at");
CREATE INDEX "appointments_tenantId_patientId_scheduled_at_idx"
  ON "appointments"("tenantId", "patientId", "scheduled_at");
CREATE INDEX "appointments_tenantId_status_scheduled_at_idx"
  ON "appointments"("tenantId", "status", "scheduled_at");
CREATE INDEX "appointments_organizationId_pregnancy_record_id_idx"
  ON "appointments"("organizationId", "pregnancy_record_id");

CREATE UNIQUE INDEX "clinical_notes_note_group_id_version_key"
  ON "clinical_notes"("note_group_id", "version");
CREATE INDEX "clinical_notes_tenantId_idx" ON "clinical_notes"("tenantId");
CREATE INDEX "clinical_notes_tenantId_id_idx" ON "clinical_notes"("tenantId", "id");
CREATE INDEX "clinical_notes_tenantId_patientId_is_latest_idx"
  ON "clinical_notes"("tenantId", "patientId", "is_latest");
CREATE INDEX "clinical_notes_tenantId_appointment_id_is_latest_idx"
  ON "clinical_notes"("tenantId", "appointment_id", "is_latest");
CREATE INDEX "clinical_notes_tenantId_note_group_id_deleted_at_idx"
  ON "clinical_notes"("tenantId", "note_group_id", "deleted_at");

CREATE INDEX "neonatal_records_tenantId_idx" ON "neonatal_records"("tenantId");
CREATE INDEX "neonatal_records_tenantId_id_idx" ON "neonatal_records"("tenantId", "id");
CREATE INDEX "neonatal_records_tenantId_patientId_born_at_idx"
  ON "neonatal_records"("tenantId", "patientId", "born_at");
CREATE INDEX "neonatal_records_organizationId_outcome_idx"
  ON "neonatal_records"("organizationId", "outcome");

ALTER TABLE "patients"
  ADD CONSTRAINT "patients_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pregnancy_records"
  ADD CONSTRAINT "pregnancy_records_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pregnancy_records"
  ADD CONSTRAINT "pregnancy_records_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_pregnancy_record_id_fkey"
  FOREIGN KEY ("pregnancy_record_id") REFERENCES "pregnancy_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_appointment_id_fkey"
  FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_pregnancy_record_id_fkey"
  FOREIGN KEY ("pregnancy_record_id") REFERENCES "pregnancy_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_authored_by_user_id_fkey"
  FOREIGN KEY ("authored_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinical_notes"
  ADD CONSTRAINT "clinical_notes_previous_version_id_fkey"
  FOREIGN KEY ("previous_version_id") REFERENCES "clinical_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "neonatal_records"
  ADD CONSTRAINT "neonatal_records_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "neonatal_records"
  ADD CONSTRAINT "neonatal_records_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "neonatal_records"
  ADD CONSTRAINT "neonatal_records_pregnancy_record_id_fkey"
  FOREIGN KEY ("pregnancy_record_id") REFERENCES "pregnancy_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "patients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "patients" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_patients ON "patients"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "pregnancy_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pregnancy_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_pregnancy_records ON "pregnancy_records"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "appointments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_appointments ON "appointments"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "clinical_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical_notes" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_clinical_notes ON "clinical_notes"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "neonatal_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "neonatal_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_neonatal_records ON "neonatal_records"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));
