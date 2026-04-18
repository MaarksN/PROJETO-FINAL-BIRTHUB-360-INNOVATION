import { envBoolean } from "./shared.js";
export const apiProductCapabilityEnvSchema = {
    BIRTHUB_ENABLE_CLINICAL_WORKSPACE: envBoolean.default(false),
    BIRTHUB_ENABLE_FHIR_FACADE: envBoolean.default(false),
    BIRTHUB_ENABLE_PRIVACY_ADVANCED: envBoolean.default(false),
    BIRTHUB_ENABLE_PRIVACY_SELF_SERVICE: envBoolean.default(true)
};
export const webProductCapabilityEnvSchema = {
    // Clinical remains preserved outside the active product unless explicitly re-enabled for controlled evaluation.
    NEXT_PUBLIC_ENABLE_CLINICAL_WORKSPACE: envBoolean.default(false),
    NEXT_PUBLIC_ENABLE_FHIR_FACADE: envBoolean.default(false),
    NEXT_PUBLIC_ENABLE_PRIVACY_ADVANCED: envBoolean.default(false),
    NEXT_PUBLIC_ENABLE_PRIVACY_SELF_SERVICE: envBoolean.default(true)
};
export function mapApiProductCapabilities(input) {
    return {
        clinicalWorkspaceEnabled: input.BIRTHUB_ENABLE_CLINICAL_WORKSPACE,
        fhirFacadeEnabled: input.BIRTHUB_ENABLE_FHIR_FACADE,
        privacyAdvancedEnabled: input.BIRTHUB_ENABLE_PRIVACY_ADVANCED,
        privacySelfServiceEnabled: input.BIRTHUB_ENABLE_PRIVACY_SELF_SERVICE
    };
}
export function mapWebProductCapabilities(input) {
    return {
        clinicalWorkspaceEnabled: input.NEXT_PUBLIC_ENABLE_CLINICAL_WORKSPACE,
        fhirFacadeEnabled: input.NEXT_PUBLIC_ENABLE_FHIR_FACADE,
        privacyAdvancedEnabled: input.NEXT_PUBLIC_ENABLE_PRIVACY_ADVANCED,
        privacySelfServiceEnabled: input.NEXT_PUBLIC_ENABLE_PRIVACY_SELF_SERVICE
    };
}
