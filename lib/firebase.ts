/**
 * Lightweight Firestore REST API client — zero Node.js dependencies.
 * Works natively in Cloudflare Workers using Web Crypto + fetch.
 */

// ---------------------------------------------------------------------------
// JWT / OAuth helpers
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? '';
  const rawKey = (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/datastore',
      iat: now,
      exp: now + 3600,
    }),
  );

  const signingInput = `${header}.${payload}`;

  // Strip PEM headers and decode base64
  const pemBody = rawKey.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const jwt = `${signingInput}.${b64urlBytes(new Uint8Array(sig))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) throw new Error(`OAuth token fetch failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

function b64url(str: string) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function b64urlBytes(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ---------------------------------------------------------------------------
// Firestore value helpers
// ---------------------------------------------------------------------------

type FsValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string };

function toFsValue(v: unknown): FsValue {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number')
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  return { stringValue: String(v) };
}

function toFsFields(obj: Record<string, unknown>): Record<string, FsValue> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toFsValue(v)]));
}

// ---------------------------------------------------------------------------
// Firestore REST API
// ---------------------------------------------------------------------------

function fsBase() {
  const project = process.env.FIREBASE_PROJECT_ID ?? '';
  return `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`;
}

/**
 * Insert a document only if it doesn't already exist (idempotent).
 * Returns 'created' or 'duplicate'.
 */
export async function firestoreInsert(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<'created' | 'duplicate'> {
  const project = process.env.FIREBASE_PROJECT_ID ?? '';
  const token = await getAccessToken();
  const docName = `projects/${project}/databases/(default)/documents/${collection}/${docId}`;

  const res = await fetch(`${fsBase()}:commit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: { name: docName, fields: toFsFields(data) },
          currentDocument: { exists: false }, // only write if doc doesn't exist
        },
      ],
    }),
  });

  if (res.status === 400) {
    const err = (await res.json()) as { error?: { status?: string } };
    if (err.error?.status === 'FAILED_PRECONDITION') return 'duplicate';
    throw new Error(`Firestore insert error: ${JSON.stringify(err)}`);
  }
  if (!res.ok) throw new Error(`Firestore insert failed: ${res.status}`);
  return 'created';
}

/**
 * Count documents in a collection matching two field filters (AND).
 */
export async function firestoreCountWhere(
  collection: string,
  field: string,
  value: string,
  sinceField: string,
  sinceValue: number,
): Promise<number> {
  const token = await getAccessToken();

  const res = await fetch(`${fsBase()}:runQuery`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: field },
                  op: 'EQUAL',
                  value: { stringValue: value },
                },
              },
              {
                fieldFilter: {
                  field: { fieldPath: sinceField },
                  op: 'GREATER_THAN',
                  value: { integerValue: String(sinceValue) },
                },
              },
            ],
          },
        },
        select: { fields: [{ fieldPath: '__name__' }] },
      },
    }),
  });

  if (!res.ok) throw new Error(`Firestore query failed: ${res.status}`);
  const rows = (await res.json()) as Array<{ document?: unknown }>;
  return rows.filter((r) => r.document).length;
}

/**
 * Update specific fields on an existing document.
 */
export async function firestoreUpdate(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const token = await getAccessToken();
  const fieldPaths = Object.keys(data)
    .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
    .join('&');

  const res = await fetch(`${fsBase()}/${collection}/${docId}?${fieldPaths}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFsFields(data) }),
  });

  if (!res.ok) throw new Error(`Firestore update failed: ${res.status}`);
}
