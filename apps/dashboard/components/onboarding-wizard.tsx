"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
  onboardingProgress,
  type OnboardingStepState,
} from "../lib/onboarding";

type WizardStep = OnboardingStepState & {
  title: string;
  description: string;
};

const initialSteps: WizardStep[] = [
  { id: "create-org", title: "Criar organização", description: "Defina nome da empresa e segmento principal.", done: false },
  { id: "setup-profile", title: "Configurar perfil", description: "Complete seu perfil e preferências iniciais.", done: false },
  { id: "install-pack", title: "Instalar pack", description: "Escolha o primeiro pack recomendado para começar.", done: false },
  { id: "invite-team", title: "Convidar time", description: "Adicione colegas para colaboração no workspace.", done: false },
];

function loadSteps() {
  if (typeof window === "undefined") {
    return initialSteps;
  }

  const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!raw) return initialSteps;

  try {
    const parsed = JSON.parse(raw) as { steps?: OnboardingStepState[] };
    if (!parsed.steps?.length) return initialSteps;
    return initialSteps.map((step) => ({
      ...step,
      done: Boolean(parsed.steps?.find((saved) => saved.id === step.id)?.done),
    }));
  } catch {
    return initialSteps;
  }
}

export function OnboardingWizard() {
  const [steps, setSteps] = useState<WizardStep[]>(loadSteps);
  const currentIndex = steps.findIndex((step) => !step.done);
  const activeIndex = currentIndex === -1 ? steps.length - 1 : currentIndex;

  const progress = useMemo(() => onboardingProgress(steps), [steps]);

  const persist = (next: WizardStep[]) => {
    setSteps(next);
    const storagePayload = next.map(({ id, done }) => ({ id, done }));
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ steps: storagePayload }));
  };

  const completeCurrentStep = () => {
    const next = steps.map((step, index) => (index === activeIndex ? { ...step, done: true } : step));
    persist(next);
  };

  const resetWizard = () => {
    persist(DEFAULT_ONBOARDING_STEPS.map((step) => ({
      ...initialSteps.find((candidate) => candidate.id === step.id)!,
      done: false,
    })));
  };

  return (
    <section className="card onboarding-card">
      <header>
        <h2>Onboarding Wizard</h2>
        <p>Conclua as 4 etapas para ativar completamente sua operação.</p>
      </header>

      <div className="onboarding-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <small>{progress}% concluído</small>

      <ol className="onboarding-steps">
        {steps.map((step, index) => (
          <li key={step.id} className={step.done ? "done" : index === activeIndex ? "active" : "pending"}>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="inline-row">
        <button type="button" onClick={completeCurrentStep} disabled={progress === 100}>
          {progress === 100 ? "Onboarding concluído" : "Marcar etapa atual como concluída"}
        </button>
        <button type="button" className="secondary" onClick={resetWizard}>
          Reiniciar
        </button>
      </div>
    </section>
  );
}
