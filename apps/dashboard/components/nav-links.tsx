"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlatform } from "./platform-provider";
import { t } from "../lib/platform-i18n";
import {
  DEFAULT_ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
  pendingOnboardingSteps,
  type OnboardingStepState,
} from "../lib/onboarding";

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

export function NavLinks() {
  const pathname = usePathname();
  const { language } = usePlatform();
  const [pendingSteps, setPendingSteps] = useState(DEFAULT_ONBOARDING_STEPS.length);

  useEffect(() => {
    const readPending = () => {
      const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!raw) {
        setPendingSteps(DEFAULT_ONBOARDING_STEPS.length);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as { steps?: OnboardingStepState[] };
        setPendingSteps(pendingOnboardingSteps(parsed.steps ?? DEFAULT_ONBOARDING_STEPS));
      } catch {
        setPendingSteps(DEFAULT_ONBOARDING_STEPS.length);
      }
    };

    readPending();
    window.addEventListener("storage", readPending);

    return () => {
      window.removeEventListener("storage", readPending);
    };
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
