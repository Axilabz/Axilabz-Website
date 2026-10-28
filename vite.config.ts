import vinext from "vinext";
import { defineConfig, loadEnv } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { readExecutionProfile } from "./scripts/execution-profile.mjs";
import { configureToolEnvironment } from "./scripts/tool-environment.mjs";
import { sites } from "./scripts/vite/sites-vite-plugin";
import { connectorPreview } from "./scripts/vite/connector-preview-plugin.mjs";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const managedLinux = readExecutionProfile() === "managed-linux";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async ({ command, mode }) => {
  configureToolEnvironment(process.cwd());

  // Load .env so Firebase secrets are available in the Worker bundle.
  const env = loadEnv(mode, process.cwd(), '');

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    // lucide-react is imported from client components; letting Vite pre-bundle it in
    // dev made it re-optimise on the first click and reload the page mid-navigation,
    // so links appeared not to open. Serving it unbundled avoids that.
    optimizeDeps: { exclude: ["lucide-react"] },
    // Inject Firebase secrets into the server Worker bundle.
    define: {
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID ?? ''),
      'process.env.FIREBASE_CLIENT_EMAIL': JSON.stringify(env.FIREBASE_CLIENT_EMAIL ?? ''),
      'process.env.FIREBASE_PRIVATE_KEY': JSON.stringify(env.FIREBASE_PRIVATE_KEY ?? ''),
      'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY ?? ''),
      'process.env.CONTACT_FROM': JSON.stringify(env.CONTACT_FROM ?? ''),
      'process.env.CONTACT_NOTIFY_TO': JSON.stringify(env.CONTACT_NOTIFY_TO ?? ''),
      'process.env.CONTACT_HASH_SALT': JSON.stringify(env.CONTACT_HASH_SALT ?? ''),
    },
    server: {
      ...(managedLinux
        ? { host: "0.0.0.0", allowedHosts: ["terminal.local"] }
        : {}),
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites({ mockAuth: !managedLinux }),
      connectorPreview(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          ...localBindingConfig,
          ...(command === "serve"
            ? {
                services: [
                  {
                    binding: "CONNECTORS",
                    service: "sites-connector-preview",
                    entrypoint: "ConnectorPreview",
                  },
                ],
              }
            : {}),
        },
        ...(command === "serve"
          ? {
              auxiliaryWorkers: [
                {
                  config: {
                    name: "sites-connector-preview",
                    main: "./scripts/connector-preview/worker.mjs",
                    compatibility_date: "2026-05-15",
                  },
                },
              ],
            }
          : {}),
      }),
    ],
  };
});
