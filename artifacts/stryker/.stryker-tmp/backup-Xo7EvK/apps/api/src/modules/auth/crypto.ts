import {
  argon2 as argon2Callback,
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const argon2 = promisify(argon2Callback);
const AES_GCM_AUTH_TAG_LENGTH = 16;
const ARGON2_SALT_BYTES = 16;
const ARGON2_TAG_BYTES = 32;
const SCRYPT_KEY_BYTES = 64;
const ACCESS_TOKEN_ISSUER = "birthub360-api";

export interface PasswordHashConfig {
  memoryKiB: number;
  parallelism: number;
  passes: number;
}

export interface AccessTokenClaims {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  organizationId: string;
  role: string | null;
  sessionId: string;
  tenantId: string;
  typ: "access";
  userId: string;
}

type OptionalBcryptModule = {
  compare: (password: string, hashed: string) => Promise<boolean>;
  genSalt: (rounds: number) => Promise<string>;
  hash: (password: string, salt: string) => Promise<string>;
};

let bcryptModulePromise: Promise<OptionalBcryptModule | null> | null = null;

async function loadOptionalBcryptModule(): Promise<OptionalBcryptModule | null> {
  if (!bcryptModulePromise) {
    bcryptModulePromise = import("bcryptjs")
      .then((module) => ({
        compare: module.compare,
        genSalt: module.genSalt,
        hash: module.hash
      }))
      .catch(() => null);
  }

  return bcryptModulePromise;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function isBcryptHash(value: string): boolean {
  return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
}

function bcryptCost(value: string): number | null {
  if (!isBcryptHash(value)) {
    return null;
  }

  const [, , cost] = value.split("$");
  const parsed = Number(cost);
  return Number.isFinite(parsed) ? parsed : null;
}

function isScryptHash(value: string): boolean {
  return value.startsWith("scrypt$");
}

function isArgon2idHash(value: string): boolean {
  return value.startsWith("argon2id$");
}

type ParsedArgon2Hash = {
  hash: Buffer;
  memoryKiB: number;
  parallelism: number;
  passes: number;
  salt: Buffer;
};

function parseArgon2idHash(value: string): ParsedArgon2Hash | null {
  const [algorithm, version, params, saltPart, hashPart] = value.split("$");

  if (
    algorithm !== "argon2id" ||
    version !== "v=1" ||
    !params ||
    !saltPart ||
    !hashPart
  ) {
    return null;
  }

  const attributes = Object.fromEntries(
    params.split(",").map((segment) => {
      const [key, rawValue] = segment.split("=");
      return [key, Number(rawValue)];
    })
  );

  const memoryKiB = attributes.m;
  const passes = attributes.t;
  const parallelism = attributes.p;

  if (
    !Number.isFinite(memoryKiB) ||
    !Number.isFinite(passes) ||
    !Number.isFinite(parallelism)
  ) {
    return null;
  }

  return {
    hash: Buffer.from(hashPart, "base64url"),
    memoryKiB,
    parallelism,
    passes,
    salt: Buffer.from(saltPart, "base64url")
  };
}

async function hashWithArgon2id(
  password: string,
  options: PasswordHashConfig
): Promise<string> {
  const salt = randomBytes(ARGON2_SALT_BYTES);
  const derivedKey = await argon2("argon2id", {
    memory: options.memoryKiB,
    message: password,
    nonce: salt,
    parallelism: options.parallelism,
    passes: options.passes,
    tagLength: ARGON2_TAG_BYTES
  });

  return `argon2id$v=1$m=${options.memoryKiB},t=${options.passes},p=${options.parallelism}$${salt.toString("base64url")}$${Buffer.from(derivedKey).toString("base64url")}`;
}

async function verifyArgon2idHash(
  password: string,
  storedHash: string
): Promise<{
  config: PasswordHashConfig | null;
  isValid: boolean;
}> {
  const parsed = parseArgon2idHash(storedHash);

  if (!parsed) {
    return {
      config: null,
      isValid: false
    };
  }

  const derivedKey = await argon2("argon2id", {
    memory: parsed.memoryKiB,
    message: password,
    nonce: parsed.salt,
    parallelism: parsed.parallelism,
    passes: parsed.passes,
    tagLength: parsed.hash.length
  });

  const actualHash = Buffer.from(derivedKey);
  const isValid =
    actualHash.length === parsed.hash.length &&
    timingSafeEqual(actualHash, parsed.hash);

  return {
    config: {
      memoryKiB: parsed.memoryKiB,
      parallelism: parsed.parallelism,
      passes: parsed.passes
    },
    isValid
  };
}

async function verifyScryptHash(password: string, storedHash: string): Promise<boolean> {
  const [, , salt, expectedHash] = storedHash.split("$");

  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, SCRYPT_KEY_BYTES)) as Buffer;
  const actualHash = Buffer.from(derivedKey);
  const expectedBuffer = Buffer.from(expectedHash, "base64url");

  if (actualHash.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedBuffer);
}

export async function hashPassword(
  password: string,
  config: PasswordHashConfig
): Promise<string> {
  return hashWithArgon2id(password, config);
}

export async function verifyPasswordHash(
  password: string,
  storedHash: string,
  config: PasswordHashConfig
): Promise<{ isValid: boolean; needsRehash: boolean }> {
  if (isArgon2idHash(storedHash)) {
    const verified = await verifyArgon2idHash(password, storedHash);

    return {
      isValid: verified.isValid,
      needsRehash:
        verified.isValid &&
        Boolean(
          !verified.config ||
            verified.config.memoryKiB < config.memoryKiB ||
            verified.config.parallelism < config.parallelism ||
            verified.config.passes < config.passes
        )
    };
  }

  if (isBcryptHash(storedHash)) {
    const bcrypt = await loadOptionalBcryptModule();

    if (!bcrypt) {
      return {
        isValid: false,
        needsRehash: false
      };
    }

    const isValid = await bcrypt.compare(password, storedHash);
    const currentCost = bcryptCost(storedHash);

    return {
      isValid,
      needsRehash: isValid
    };
  }

  if (isScryptHash(storedHash)) {
    const isValid = await verifyScryptHash(password, storedHash);

    return {
      isValid,
      needsRehash: isValid
    };
  }

  return {
    isValid: sha256(password) === storedHash,
    needsRehash: sha256(password) === storedHash
  };
}

export function randomToken(byteLength = 32): string {
  return randomBytes(byteLength).toString("base64url");
}

function encodeBase64UrlJson(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeBase64UrlJson(value: string): unknown {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function isValidAccessTokenPayload(
  payload: Partial<AccessTokenClaims>,
  now: number
): payload is AccessTokenClaims {
  if (
    payload.typ !== "access" ||
    payload.iss !== ACCESS_TOKEN_ISSUER ||
    typeof payload.exp !== "number" ||
    payload.exp <= now ||
    typeof payload.iat !== "number" ||
    typeof payload.jti !== "string" ||
    typeof payload.organizationId !== "string" ||
    typeof payload.sessionId !== "string" ||
    typeof payload.tenantId !== "string" ||
    typeof payload.userId !== "string"
  ) {
    return false;
  }

  return payload.role === null || payload.role === undefined || typeof payload.role === "string";
}

export function createAccessToken(input: {
  organizationId: string;
  role?: string | null;
  secret: string;
  sessionId: string;
  tenantId: string;
  ttlMinutes: number;
  userId: string;
}): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AccessTokenClaims = {
    exp: issuedAt + input.ttlMinutes * 60,
    iat: issuedAt,
    iss: ACCESS_TOKEN_ISSUER,
    jti: randomToken(16),
    organizationId: input.organizationId,
    role: input.role ?? null,
    sessionId: input.sessionId,
    tenantId: input.tenantId,
    typ: "access",
    userId: input.userId
  };
  const header = encodeBase64UrlJson({
    alg: "HS256",
    typ: "JWT"
  });
  const body = encodeBase64UrlJson(payload);
  const signature = createHmac("sha256", input.secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

function isValidJwtHeader(value: unknown): value is { alg: "HS256"; typ: "JWT" } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { alg?: unknown; typ?: unknown };
  return candidate.alg === "HS256" && candidate.typ === "JWT";
}

export function verifyAccessToken(
  token: string,
  secret: string
): AccessTokenClaims | null {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  if (!headerPart || !payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const actualSignature = Buffer.from(signaturePart, "base64url");

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const header = decodeBase64UrlJson(headerPart);
    const payload = decodeBase64UrlJson(payloadPart) as Partial<AccessTokenClaims>;
    const now = Math.floor(Date.now() / 1000);

    if (!isValidJwtHeader(header)) {
      return null;
    }

    if (!isValidAccessTokenPayload(payload, now)) {
      return null;
    }

    return {
      exp: payload.exp,
      iat: payload.iat,
      iss: payload.iss,
      jti: payload.jti,
      organizationId: payload.organizationId,
      role: payload.role ?? null,
      sessionId: payload.sessionId,
      tenantId: payload.tenantId,
      typ: payload.typ,
      userId: payload.userId
    };
  } catch {
    return null;
  }
}

export function createRefreshToken(): string {
  return `rtk_${randomToken(48)}`;
}

export function createSecureSessionId(): string {
  return randomBytes(16).toString("hex");
}

export function createApiKey(prefix: string): {
  hash: string;
  key: string;
  last4: string;
  prefix: string;
} {
  const material = randomToken(36);
  const key = `${prefix}_${material}`;
  return {
    hash: sha256(key),
    key,
    last4: key.slice(-4),
    prefix
  };
}

function encryptionKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export function encryptSensitiveValue(value: string, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv, {
    authTagLength: AES_GCM_AUTH_TAG_LENGTH
  });
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptSensitiveValue(payload: string, secret: string): string {
  const [ivPart, authTagPart, encryptedPart] = payload.split(".");

  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("Invalid encrypted payload.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(secret),
    Buffer.from(ivPart, "base64url"),
    {
      authTagLength: AES_GCM_AUTH_TAG_LENGTH
    }
  );
  decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

export function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPayloadSignature(payload: string, secret: string, signature: string): boolean {
  return signPayload(payload, secret) === signature;
}
