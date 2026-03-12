# Threat Model: Authentication

## Overview
This document outlines the threat model for the authentication system, specifically addressing common authentication-related vulnerabilities and the measures implemented to mitigate them.

## 1. Token Theft

### Description
An attacker intercepts an access token or a refresh token. This could happen via network sniffing (if unencrypted), Cross-Site Scripting (XSS), or by accessing insecure local storage.

### Mitigations
*   **Transport Layer Security:** Enforce HTTPS for all communication to prevent man-in-the-middle network sniffing.
*   **Cookie Security:** Store tokens in `HttpOnly` and `Secure` cookies. This prevents JavaScript from accessing the tokens, mitigating the risk of XSS attacks stealing them.
*   **Short Expiration:** Implement short-lived access tokens (e.g., 15 minutes to 1 hour). Even if stolen, the token is only useful for a brief period.
*   **Refresh Token Rotation:** Every time a refresh token is used, a new one is issued, and the old one is invalidated. If an attacker steals and uses a refresh token, the legitimate user will eventually attempt to use their copy, invalidating all subsequent tokens and requiring re-authentication.

## 2. Cross-Site Request Forgery (CSRF)

### Description
An attacker tricks an authenticated user into executing an unwanted action on the web application where they are currently authenticated.

### Mitigations
*   **Anti-CSRF Tokens:** Utilize a framework (like Auth.js) that inherently generates and validates Anti-CSRF tokens for any state-changing requests.
*   **SameSite Cookie Attribute:** Set cookies to use the `SameSite=Lax` or `Strict` attribute. This restricts the browser from sending cookies in cross-site requests.

## 3. Session Fixation

### Description
An attacker sets a user's session identifier to an explicit known value and then tricks the user into authenticating. The attacker then uses the known session identifier to access the user's account.

### Mitigations
*   **Regenerate Session ID:** Upon successful authentication (login), always generate a new session ID and discard the old one. This ensures that any pre-set session ID by an attacker becomes invalid.
*   **Invalidate on Logout:** Ensure session IDs are strictly invalidated on the server side upon user logout or session timeout.

## 4. Brute Force Attacks

### Description
An attacker uses automated tools to repeatedly guess a user's password until the correct one is found.

### Mitigations
*   **Rate Limiting:** Implement strict rate limiting on the login endpoint (e.g., maximum of 5 attempts per minute per IP address).
*   **Account Lockout Policy:** Automatically lock the account for a specified duration (e.g., 30 minutes) after a defined number of consecutive failed login attempts (e.g., 5 attempts).
*   **CAPTCHA/Challenges:** Consider implementing a CAPTCHA or similar challenge after a few failed attempts to prevent automated tools from continuing.
*   **Strong Password Policy:** Enforce a policy that requires complex passwords, making brute-forcing computationally expensive.
