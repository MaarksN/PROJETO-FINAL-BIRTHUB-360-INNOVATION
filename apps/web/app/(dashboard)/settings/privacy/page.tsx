// @ts-expect-error TODO: remover suppressão ampla
//
import { getProductCapabilities } from "../../../../lib/product-capabilities.js";

export default async function PrivacySettingsPage() {
  const capabilities = getProductCapabilities();

  if (!capabilities.privacyAdvancedEnabled) {
    const { default: PrivacySelfServicePageClient } = await import("./privacy-self-service-page.js");
    return <PrivacySelfServicePageClient />;
  }

  const { default: PrivacySettingsPageClient } = await import("./privacy-settings-page.js");
  return <PrivacySettingsPageClient />;
}

