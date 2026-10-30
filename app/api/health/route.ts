export const runtime = 'edge';

export async function GET() {
  const checks = {
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    CONTACT_FROM: !!process.env.CONTACT_FROM,
    CONTACT_NOTIFY_TO: !!process.env.CONTACT_NOTIFY_TO,
  };

  const allOk = Object.values(checks).every(Boolean);

  return Response.json(
    { ok: allOk, env: checks },
    { status: allOk ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
