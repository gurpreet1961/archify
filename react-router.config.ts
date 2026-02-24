import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode for static deployment (Vercel, etc.)
  // All data fetching is client-side via Puter SDK
  ssr: false,
} satisfies Config;
