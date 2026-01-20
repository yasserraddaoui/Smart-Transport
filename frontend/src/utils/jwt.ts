export type JwtInfo = {
  subject: string;
  expiresAt?: number;
  issuedAt?: number;
  roles: string[];
  rawClaims: Record<string, unknown>;
};

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  return atob(base64 + pad);
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function extractRoles(claims: Record<string, unknown>): string[] {
  const candidates: unknown[] = [];
  for (const key of ["roles", "role", "authorities"]) candidates.push(claims[key]);

  const scopes = claims.scope ?? claims.scopes;
  if (typeof scopes === "string") candidates.push(scopes.split(" "));

  const roleSet = new Set<string>();
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) roleSet.add(c.trim());
    if (Array.isArray(c)) {
      for (const item of c) {
        if (typeof item === "string" && item.trim()) roleSet.add(item.trim());
      }
    }
  }

  if (roleSet.size === 0) roleSet.add("user");
  return [...roleSet];
}

export function extractJwtInfo(token: string): JwtInfo {
  const parts = token.split(".");
  if (parts.length < 2) {
    return { subject: "unknown", roles: ["user"], rawClaims: {} };
  }
  const payload = decodeBase64Url(parts[1]);
  const claims = safeJsonParse<Record<string, unknown>>(payload) ?? {};

  const sub = typeof claims.sub === "string" ? claims.sub : "unknown";
  const iat = typeof claims.iat === "number" ? claims.iat : undefined;
  const exp = typeof claims.exp === "number" ? claims.exp : undefined;

  return {
    subject: sub,
    issuedAt: iat,
    expiresAt: exp,
    roles: extractRoles(claims),
    rawClaims: claims,
  };
}

export function isExpired(info: JwtInfo | null): boolean {
  if (!info?.expiresAt) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= info.expiresAt;
}

