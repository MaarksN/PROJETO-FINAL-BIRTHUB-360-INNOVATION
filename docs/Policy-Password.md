# Policy: Password Requirements

## Overview
This document specifies the mandatory password policy for all user accounts accessing the application. It outlines requirements for length, complexity, history, and lockout mechanisms to ensure a strong security posture against authentication attacks.

## Policy Details

### 1. Length
A minimum password length is the most effective defense against brute-force attacks.
*   **Minimum Length:** Passwords must be at least 12 characters long.
*   **Maximum Length:** Passwords may be up to 128 characters to prevent denial-of-service (DoS) attacks via excessively long inputs during hashing.

### 2. Complexity
Complexity requirements ensure that passwords are not easily guessable based on dictionary words or simple patterns.
*   **Character Types:** Passwords must contain characters from at least three of the following four categories:
    *   Uppercase letters (A-Z)
    *   Lowercase letters (a-z)
    *   Numbers (0-9)
    *   Special characters (e.g., `!@#$%^&*()_+~`\|[]{}:";'<>?,./`)

### 3. History
Preventing password reuse reduces the risk of an attacker using a previously compromised password to gain access.
*   **Enforcement:** Users cannot reuse any of their last 5 previous passwords. The system must maintain a securely hashed history of these passwords to enforce this rule.

### 4. Lockout by Attempts
Account lockout mechanisms mitigate the risk of continuous automated brute-force attacks against a single user account.
*   **Threshold:** An account will be automatically locked after 5 consecutive failed login attempts.
*   **Time Window:** The failed attempts must occur within a 15-minute window to trigger the lockout.
*   **Duration:** The account will remain locked for 30 minutes. After this duration, the lock will automatically expire.
*   **Administrative Override:** Administrators with sufficient privileges can manually unlock an account before the duration expires, typically after verifying the user's identity through an out-of-band channel.

### 5. Compromised Password Check
To further protect users, the application should integrate with a service (e.g., Have I Been Pwned API) to check if a newly proposed password has been part of a known data breach.
*   **Enforcement:** If a match is found during password creation or reset, the system must reject the password and require the user to choose a different one.
