# Policy: Token Expiration

## Overview
This document specifies the standard expiration times for access and refresh tokens, categorized by the security plan assigned to a user role or organization. These policies balance usability with the need to minimize the impact of compromised tokens.

## Expiration Windows

### Base Security Plan
*   **Target Audience:** Standard users performing non-sensitive operations (e.g., content creation, general application usage).
*   **Access Token:** 60 minutes
*   **Refresh Token:** 30 days
*   **Rationale:** The standard plan provides a reasonable balance between user experience and security. A compromised access token is only useful for an hour, while the refresh token ensures users remain logged in for a significant period without manual intervention.

### Advanced Security Plan
*   **Target Audience:** Administrators, managers, or roles accessing sensitive financial, personal, or administrative data.
*   **Access Token:** 15 minutes
*   **Refresh Token:** 7 days
*   **Rationale:** The advanced plan requires a much tighter security posture. The very short access token lifespan significantly reduces the window of opportunity for an attacker to use a stolen token. The shorter refresh token window forces more frequent active re-authentication, further limiting long-term unauthorized access.

### Custom Security Plan
*   **Target Audience:** Enterprise organizations requiring specific compliance or security postures not met by the standard plans.
*   **Access Token:** Configurable (min: 5 mins, max: 2 hours)
*   **Refresh Token:** Configurable (min: 1 day, max: 90 days)
*   **Rationale:** Enterprise customers often have their own internal security policies that dictate these parameters. However, limits are imposed to prevent completely insecure configurations (e.g., a non-expiring access token).

## Critical Rules
*   **Mandatory Refresh Token Rotation:** All refresh tokens must use rotation. When a refresh token is used to obtain a new access token, a new refresh token is also issued, and the old one is immediately invalidated.
*   **No Access Token Extension:** Access tokens cannot have their expiration extended. A new access token must be explicitly requested and issued.
*   **Immediate Invalidation on Key Events:** All active refresh tokens (and consequently, the ability to obtain new access tokens) must be immediately invalidated across all devices upon any of the following events:
    *   Password change.
    *   Multi-Factor Authentication (MFA) enablement, modification, or disablement.
    *   A manual "log out of all devices" action initiated by the user or an administrator.
