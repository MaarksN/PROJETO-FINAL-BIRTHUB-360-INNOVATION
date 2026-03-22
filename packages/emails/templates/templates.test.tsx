import assert from "node:assert/strict";
import test from "node:test";

import { CriticalErrorEmail } from "./critical-error.tsx";
import { OrganizationInviteEmail } from "./org-invite.tsx";
import { WorkflowFinishedEmail } from "./workflow-finished.tsx";

void test("email templates return element trees with expected top-level nodes", () => {
  const invite = OrganizationInviteEmail({
    acceptUrl: "https://birthhub.test/invite",
    email: "owner@birthub.local",
    organizationName: "BirthHub",
    role: "ADMIN"
  });
  const critical = CriticalErrorEmail({
    agentId: "ceo-pack",
    errorMessage: "boom",
    executionId: "exec_1",
    link: "https://birthhub.test/logs/1"
  });
  const finished = WorkflowFinishedEmail({
    agentId: "ops-pack",
    executionId: "exec_2",
    link: "https://birthhub.test/runs/2"
  });

  assert.equal(invite.type, "html");
  assert.equal(critical.type, "html");
  assert.equal(finished.type, "html");
});