CREATE TABLE IF NOT EXISTS "workflow_revisions" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "definition" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workflow_revisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "workflow_revisions_workflowId_version_key"
  ON "workflow_revisions"("workflowId", "version");
CREATE INDEX IF NOT EXISTS "workflow_revisions_tenantId_idx"
  ON "workflow_revisions"("tenantId");
CREATE INDEX IF NOT EXISTS "workflow_revisions_organizationId_idx"
  ON "workflow_revisions"("organizationId");
CREATE INDEX IF NOT EXISTS "workflow_revisions_workflowId_idx"
  ON "workflow_revisions"("workflowId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workflow_revisions_organizationId_fkey'
      AND conrelid = 'workflow_revisions'::regclass
  ) THEN
    ALTER TABLE "workflow_revisions"
      ADD CONSTRAINT "workflow_revisions_organizationId_fkey"
      FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workflow_revisions_workflowId_fkey'
      AND conrelid = 'workflow_revisions'::regclass
  ) THEN
    ALTER TABLE "workflow_revisions"
      ADD CONSTRAINT "workflow_revisions_workflowId_fkey"
      FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

ALTER TABLE "workflow_revisions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflow_revisions" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy_workflow_revisions ON "workflow_revisions";
CREATE POLICY tenant_isolation_policy_workflow_revisions ON "workflow_revisions"
  FOR ALL
  USING (tenant_access_allowed("tenantId"))
  WITH CHECK (tenant_access_allowed("tenantId"));
