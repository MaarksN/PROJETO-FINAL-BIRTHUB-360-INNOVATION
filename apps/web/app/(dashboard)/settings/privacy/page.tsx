// @ts-nocheck
//
import { getProductCapabilities } from "../../../../lib/product-capabilities";

import PrivacySettingsPageClient from "./privacy-settings-page";
import PrivacySelfServicePageClient from "./privacy-self-service-page";

export default function PrivacySettingsPage() {
  const capabilities = getProductCapabilities();

  if (!capabilities.privacyAdvancedEnabled) {
    return <PrivacySelfServicePageClient />;
  }

  return <PrivacySettingsPageClient />;
}
