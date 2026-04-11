import {
  getWebConfig,
  type ProductCapabilities as SharedProductCapabilities
} from "@birthub/config";

export type ProductCapabilities = SharedProductCapabilities;

function withWebEnvDefaults(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...env,
    NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT ?? "development"
  };
}

export function getProductCapabilities(
  env: NodeJS.ProcessEnv = process.env
): ProductCapabilities {
  const config = getWebConfig(withWebEnvDefaults(env));

  return {
    clinicalWorkspaceEnabled: config.clinicalWorkspaceEnabled,
    fhirFacadeEnabled: config.fhirFacadeEnabled,
    privacyAdvancedEnabled: config.privacyAdvancedEnabled,
    privacySelfServiceEnabled: config.privacySelfServiceEnabled
  };
}

export function isDashboardNavigationItemEnabled(
  href: string,
  capabilities: ProductCapabilities = getProductCapabilities()
): boolean {
  if ((href === "/patients" || href === "/appointments") && !capabilities.clinicalWorkspaceEnabled) {
    return false;
  }

  return true;
}
