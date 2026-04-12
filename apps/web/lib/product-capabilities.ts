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
  if (isClinicalWorkspacePath(href) && !capabilities.clinicalWorkspaceEnabled) {
    return false;
  }

  return true;
}

export function isClinicalWorkspacePath(path: string): boolean {
  return path === "/patients" || path.startsWith("/patients/") || path === "/appointments" || path.startsWith("/appointments/");
}

export function sanitizeCapabilityScopedLink(
  path: string | null,
  capabilities: ProductCapabilities = getProductCapabilities()
): string | null {
  if (!path) {
    return null;
  }

  if (isClinicalWorkspacePath(path) && !capabilities.clinicalWorkspaceEnabled) {
    return null;
  }

  return path;
}
