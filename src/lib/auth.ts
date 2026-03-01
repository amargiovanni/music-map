type D1Database = import('@cloudflare/workers-types').D1Database;
type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

// ── Hash an OAuth subject with the pepper (Web Crypto) ───────
export async function hashAuthSubject(
  provider: 'google' | 'apple',
  sub: string,
  pepper: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${provider}:${sub}:${pepper}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Session management via KV ────────────────────────────────
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const SESSION_PREFIX = 'session:';

export async function createSession(kv: KVNamespace, userId: string): Promise<string> {
  const token = crypto.randomUUID();
  await kv.put(`${SESSION_PREFIX}${token}`, userId, { expirationTtl: SESSION_TTL });
  return token;
}

export async function getSessionUserId(kv: KVNamespace, token: string): Promise<string | null> {
  return kv.get(`${SESSION_PREFIX}${token}`);
}

export async function deleteSession(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(`${SESSION_PREFIX}${token}`);
}

// ── Cookie helpers ───────────────────────────────────────────
export const SESSION_COOKIE = 'mm_session';

export function makeSessionCookie(token: string, maxAge = SESSION_TTL): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function makeClearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function parseSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

// ── User find-or-create (upsert-safe) ────────────────────────
export async function findOrCreateUser(db: D1Database, authHash: string): Promise<string> {
  const userId = crypto.randomUUID();
  await db
    .prepare('INSERT INTO users (id, auth_hash) VALUES (?1, ?2) ON CONFLICT (auth_hash) DO NOTHING')
    .bind(userId, authHash)
    .run();

  const row = await db
    .prepare('SELECT id FROM users WHERE auth_hash = ?1')
    .bind(authHash)
    .first<{ id: string }>();

  return row!.id;
}

// ── OAuth state helpers ──────────────────────────────────────
const OAUTH_STATE_TTL = 300; // 5 minutes

export async function createOAuthState(kv: KVNamespace): Promise<string> {
  const state = crypto.randomUUID();
  await kv.put(`oauth_state:${state}`, '1', { expirationTtl: OAUTH_STATE_TTL });
  return state;
}

export async function verifyOAuthState(kv: KVNamespace, state: string | null): Promise<boolean> {
  if (!state) return false;
  const value = await kv.get(`oauth_state:${state}`);
  if (!value) return false;
  await kv.delete(`oauth_state:${state}`);
  return true;
}

// ── Google ID token decode ───────────────────────────────────
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(payload));
}

// ── Apple client_secret JWT generation (ES256 via Web Crypto) ─
export async function generateAppleClientSecret(
  teamId: string,
  clientId: string,
  keyId: string,
  privateKeyPem: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = toBase64Url(JSON.stringify({ alg: 'ES256', kid: keyId }));
  const payload = toBase64Url(JSON.stringify({
    iss: teamId,
    iat: now,
    exp: now + 15777000, // ~6 months
    aud: 'https://appleid.apple.com',
    sub: clientId,
  }));

  const signingInput = `${header}.${payload}`;

  // Import PEM private key
  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );

  const signatureBuffer = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(signingInput),
  );

  // Web Crypto returns DER-encoded ECDSA signature, convert to raw r||s for JWT
  const signature = derToRaw(new Uint8Array(signatureBuffer));
  const sig = toBase64Url(String.fromCharCode(...signature));

  return `${signingInput}.${sig}`;
}

// ── Helpers ──────────────────────────────────────────────────
function toBase64Url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function derToRaw(der: Uint8Array): Uint8Array {
  // DER: 0x30 <len> 0x02 <rlen> <r> 0x02 <slen> <s>
  // Raw: <r_32bytes> <s_32bytes>
  const raw = new Uint8Array(64);

  let offset = 2; // skip 0x30 <len>
  offset += 1; // skip 0x02
  const rLen = der[offset++];
  const rStart = rLen > 32 ? offset + (rLen - 32) : offset;
  const rDest = rLen < 32 ? 32 - rLen : 0;
  raw.set(der.slice(rStart, offset + rLen).slice(0, 32), rDest);

  offset += rLen;
  offset += 1; // skip 0x02
  const sLen = der[offset++];
  const sStart = sLen > 32 ? offset + (sLen - 32) : offset;
  const sDest = sLen < 32 ? 64 - sLen : 32;
  raw.set(der.slice(sStart, offset + sLen).slice(0, 32), sDest);

  return raw;
}
