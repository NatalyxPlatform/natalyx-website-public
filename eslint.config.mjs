import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15.5 still ships eslintrc-style config, so it is bridged
// into ESLint 9's flat config here. `next lint` is deprecated; `npm run lint`
// invokes eslint directly.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      // Tests read fixtures and assert on shapes the app types do not describe.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default config;
