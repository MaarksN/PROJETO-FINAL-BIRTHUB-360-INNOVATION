"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlatform } from "./platform-provider";
import { t } from "../lib/platform-i18n";

const links = [
  ["/", "overview"],
  ["/pipeline", "salesPipeline"],
  ["/health-score", "healthScore"],
  ["/financeiro", "financialView"],
  ["/analytics", "analytics"],
  ["/contratos", "contracts"],
  ["/atividades", "agentActivities"],
  ["/sales", "salesOs"],
] as const;

const ONBOARDING_STORAGE_KEY = "birthhub:onboarding:v1";

type OnboardingStepState = {
  id: string;
  done: boolean;
};

const defaultSteps: OnboardingStepState[] = [
  { id: "create-org", done: false },
  { id: "setup-profile", done: false },
  { id: "install-pack", done: false },
  { id: "invite-team", done: false },
];

export function NavLinks() {
  const pathname = usePathname();
  const { language } = usePlatform();
  const [pendingSteps, setPendingSteps] = useState(defaultSteps.length);

  useEffect(() => {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { steps?: OnboardingStepState[] };
      const steps = parsed.steps ?? defaultSteps;
      setPendingSteps(steps.filter((step) => !step.done).length);
    } catch {
      setPendingSteps(defaultSteps.length);
    }
  }, [pathname]);

  return (
    <nav className="top-nav" aria-label="Navegação do dashboard">
      {pendingSteps > 0 ? (
        <Link href="/onboarding" className="onboarding-chip" aria-label="Retomar onboarding">
          Onboarding pendente: {pendingSteps}/4
        </Link>
      ) : null}
      {links.map(([href, key]) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`nav-link${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {t(language, key)}
          </Link>
        );
      })}
    </nav>
  );
}
