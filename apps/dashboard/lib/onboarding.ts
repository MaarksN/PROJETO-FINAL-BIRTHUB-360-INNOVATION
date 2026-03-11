export const ONBOARDING_STORAGE_KEY = "birthhub:onboarding:v1";

export type OnboardingStepId = "create-org" | "setup-profile" | "install-pack" | "invite-team";

export type OnboardingStepState = {
  id: OnboardingStepId;
  done: boolean;
};

export const DEFAULT_ONBOARDING_STEPS: OnboardingStepState[] = [
  { id: "create-org", done: false },
  { id: "setup-profile", done: false },
  { id: "install-pack", done: false },
  { id: "invite-team", done: false },
];

export function normalizeOnboardingSteps(steps?: OnboardingStepState[]) {
  if (!steps || steps.length !== DEFAULT_ONBOARDING_STEPS.length) {
    return DEFAULT_ONBOARDING_STEPS;
  }

  const validIds = new Set(DEFAULT_ONBOARDING_STEPS.map((step) => step.id));
  const hasOnlyValidIds = steps.every((step) => validIds.has(step.id));
  return hasOnlyValidIds ? steps : DEFAULT_ONBOARDING_STEPS;
}

export function pendingOnboardingSteps(steps: OnboardingStepState[]) {
  return normalizeOnboardingSteps(steps).filter((step) => !step.done).length;
}

export function onboardingProgress(steps: OnboardingStepState[]) {
  const normalized = normalizeOnboardingSteps(steps);
  const completed = normalized.filter((step) => step.done).length;
  return Math.round((completed / normalized.length) * 100);
}
