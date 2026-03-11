import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ONBOARDING_STEPS,
  normalizeOnboardingSteps,
  onboardingProgress,
  pendingOnboardingSteps,
} from "../lib/onboarding.ts";

test("normalizeOnboardingSteps returns default when payload is invalid", () => {
  const normalized = normalizeOnboardingSteps([{ id: "create-org", done: true }] as typeof DEFAULT_ONBOARDING_STEPS);
  assert.deepEqual(normalized, DEFAULT_ONBOARDING_STEPS);
});

test("pendingOnboardingSteps and onboardingProgress calculate expected values", () => {
  const steps = [
    { id: "create-org", done: true },
    { id: "setup-profile", done: true },
    { id: "install-pack", done: false },
    { id: "invite-team", done: false },
  ] as typeof DEFAULT_ONBOARDING_STEPS;

  assert.equal(pendingOnboardingSteps(steps), 2);
  assert.equal(onboardingProgress(steps), 50);
});
