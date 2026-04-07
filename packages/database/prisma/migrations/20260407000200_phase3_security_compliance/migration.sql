CREATE TYPE "SessionAccessMode" AS ENUM ('STANDARD', 'IMPERSONATION', 'BREAK_GLASS');
CREATE TYPE "ConsentPurpose" AS ENUM ('ANALYTICS', 'MARKETING', 'HEALTH_DATA_SHARING');
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'GRANTED', 'REVOKED');
CREATE TYPE "ConsentSource" AS ENUM ('BANNER', 'SETTINGS', 'API');
CREATE TYPE "LawfulBasis" AS ENUM ('CONSENT', 'CONTRACT', 'LEGAL_OBLIGATION', 'LEGITIMATE_INTEREST');
CREATE TYPE "RetentionDataCategory" AS ENUM (
  'OUTPUT_ARTIFACTS',
  'LOGIN_ALERTS',
  'MFA_CHALLENGES',
  'MFA_RECOVERY_CODES',
  'SUSPENDED_USERS'
);
CREATE TYPE "RetentionAction" AS ENUM ('DELETE', 'ANONYMIZE');
CREATE TYPE "RetentionExecutionMode" AS ENUM ('AUTOMATED', 'MANUAL', 'DRY_RUN');

ALTER TABLE "users"
  ADD COLUMN "mfa_failed_attempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "mfa_locked_until" TIMESTAMP(3);

ALTER TABLE "sessions"
  ADD COLUMN "ip_hash" TEXT,
  ADD COLUMN "access_mode" "SessionAccessMode" NOT NULL DEFAULT 'STANDARD',
  ADD COLUMN "break_glass_grant_id" TEXT,
  ADD COLUMN "break_glass_reason" TEXT,
  ADD COLUMN "break_glass_ticket" TEXT,
  ADD COLUMN "break_glass_expires_at" TIMESTAMP(3),
  ADD COLUMN "impersonated_by_user_id" TEXT;

ALTER TABLE "login_alerts"
  ADD COLUMN "ip_hash" TEXT;

CREATE TABLE "privacy_consents" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "purpose" "ConsentPurpose" NOT NULL,
  "status" "ConsentStatus" NOT NULL DEFAULT 'PENDING',
  "lawful_basis" "LawfulBasis" NOT NULL DEFAULT 'CONSENT',
  "source" "ConsentSource" NOT NULL DEFAULT 'SETTINGS',
  "granted_at" TIMESTAMP(3),
  "revoked_at" TIMESTAMP(3),
  "last_changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "privacy_consents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "privacy_consent_events" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "purpose" "ConsentPurpose" NOT NULL,
  "lawful_basis" "LawfulBasis" NOT NULL DEFAULT 'CONSENT',
  "source" "ConsentSource" NOT NULL DEFAULT 'SETTINGS',
  "previous_status" "ConsentStatus",
  "new_status" "ConsentStatus" NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "privacy_consent_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "data_retention_policies" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "data_category" "RetentionDataCategory" NOT NULL,
  "action" "RetentionAction" NOT NULL,
  "lawful_basis" "LawfulBasis" NOT NULL DEFAULT 'LEGAL_OBLIGATION',
  "retention_days" INTEGER NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "data_retention_policies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "data_retention_executions" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "policy_id" TEXT,
  "data_category" "RetentionDataCategory" NOT NULL,
  "action" "RetentionAction" NOT NULL,
  "mode" "RetentionExecutionMode" NOT NULL DEFAULT 'AUTOMATED',
  "scanned_count" INTEGER NOT NULL DEFAULT 0,
  "affected_count" INTEGER NOT NULL DEFAULT 0,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "data_retention_executions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "break_glass_grants" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "session_id" TEXT,
  "target_resource_type" TEXT NOT NULL,
  "target_resource_id" TEXT,
  "ticket_id" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "justification" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "revoked_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "break_glass_grants_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "users_mfa_locked_until_idx" ON "users"("mfa_locked_until");
CREATE INDEX "sessions_ip_hash_idx" ON "sessions"("ip_hash");
CREATE INDEX "sessions_access_mode_idx" ON "sessions"("access_mode");
CREATE INDEX "login_alerts_ip_hash_idx" ON "login_alerts"("ip_hash");

CREATE UNIQUE INDEX "privacy_consents_organizationId_userId_purpose_key"
  ON "privacy_consents"("organizationId", "userId", "purpose");
CREATE INDEX "privacy_consents_tenantId_idx" ON "privacy_consents"("tenantId");
CREATE INDEX "privacy_consents_tenantId_userId_purpose_idx"
  ON "privacy_consents"("tenantId", "userId", "purpose");
CREATE INDEX "privacy_consents_organizationId_updatedAt_idx"
  ON "privacy_consents"("organizationId", "updatedAt");

CREATE INDEX "privacy_consent_events_tenantId_idx" ON "privacy_consent_events"("tenantId");
CREATE INDEX "privacy_consent_events_tenantId_userId_createdAt_idx"
  ON "privacy_consent_events"("tenantId", "userId", "createdAt");
CREATE INDEX "privacy_consent_events_organizationId_createdAt_idx"
  ON "privacy_consent_events"("organizationId", "createdAt");

CREATE UNIQUE INDEX "data_retention_policies_organizationId_data_category_key"
  ON "data_retention_policies"("organizationId", "data_category");
CREATE INDEX "data_retention_policies_tenantId_idx" ON "data_retention_policies"("tenantId");
CREATE INDEX "data_retention_policies_tenantId_enabled_data_category_idx"
  ON "data_retention_policies"("tenantId", "enabled", "data_category");

CREATE INDEX "data_retention_executions_tenantId_idx" ON "data_retention_executions"("tenantId");
CREATE INDEX "data_retention_executions_organizationId_createdAt_idx"
  ON "data_retention_executions"("organizationId", "createdAt");
CREATE INDEX "data_retention_executions_policy_id_idx"
  ON "data_retention_executions"("policy_id");

CREATE INDEX "break_glass_grants_tenantId_idx" ON "break_glass_grants"("tenantId");
CREATE INDEX "break_glass_grants_organizationId_createdAt_idx"
  ON "break_glass_grants"("organizationId", "createdAt");
CREATE INDEX "break_glass_grants_actorId_createdAt_idx"
  ON "break_glass_grants"("actorId", "createdAt");
CREATE INDEX "break_glass_grants_session_id_idx" ON "break_glass_grants"("session_id");

ALTER TABLE "privacy_consents"
  ADD CONSTRAINT "privacy_consents_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "privacy_consents"
  ADD CONSTRAINT "privacy_consents_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "privacy_consent_events"
  ADD CONSTRAINT "privacy_consent_events_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "privacy_consent_events"
  ADD CONSTRAINT "privacy_consent_events_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "data_retention_policies"
  ADD CONSTRAINT "data_retention_policies_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "data_retention_executions"
  ADD CONSTRAINT "data_retention_executions_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "data_retention_executions"
  ADD CONSTRAINT "data_retention_executions_policy_id_fkey"
  FOREIGN KEY ("policy_id") REFERENCES "data_retention_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "break_glass_grants"
  ADD CONSTRAINT "break_glass_grants_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "privacy_consents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "privacy_consents" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_privacy_consents ON "privacy_consents";
CREATE POLICY tenant_isolation_policy_privacy_consents ON "privacy_consents"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "privacy_consent_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "privacy_consent_events" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_privacy_consent_events ON "privacy_consent_events";
CREATE POLICY tenant_isolation_policy_privacy_consent_events ON "privacy_consent_events"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "data_retention_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "data_retention_policies" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_data_retention_policies ON "data_retention_policies";
CREATE POLICY tenant_isolation_policy_data_retention_policies ON "data_retention_policies"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "data_retention_executions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "data_retention_executions" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_data_retention_executions ON "data_retention_executions";
CREATE POLICY tenant_isolation_policy_data_retention_executions ON "data_retention_executions"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));

ALTER TABLE "break_glass_grants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "break_glass_grants" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_break_glass_grants ON "break_glass_grants";
CREATE POLICY tenant_isolation_policy_break_glass_grants ON "break_glass_grants"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));
