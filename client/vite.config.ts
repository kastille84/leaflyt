import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react(), basicSsl()],
    server: {
      https: true, // same as "--https" flag
      host: true, // same as "--host" flag
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./setupTests.ts",
      include: ["tests/**/*.test.{ts,tsx}"],
      exclude: [
        ...configDefaults.exclude,
        "e2e/*",
        ".storybook",
        "**/*.stories.{ts,tsx}",
      ], // Optional
      browser: {
        enabled: true,
        provider: "playwright",
        headless: false, // Set to false to see the browser UI
        instances: [{ browser: "chromium" }],
      },
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov", "clover"],
        thresholds: {
          global: {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90,
          },
        },
        exclude: [
          "e2e/*",
          "eslint.config.js",
          "**/vite-env.d.ts",
          "**/main.tsx",
          "**/*.config.{ts,tsx}",
          "**/interfaces/*",
          "**/constants/*",
          "**/styles/*",
          "**/fixtures/*",
          "**/context/*",
        ],
      },
    },
  };
});

// export default defineConfig({
//   plugins: [react(), basicSsl()],
//   server: {
//     https: true, // same as "--https" flag
//     host: true, // same as "--host" flag
//   },
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./setupTests.ts",
//     include: ["tests/**/*.test.{ts,tsx}"],
//     exclude: [
//       ...configDefaults.exclude,
//       "e2e/*",
//       ".storybook",
//       "**/*.stories.{ts,tsx}",
//     ], // Optional
//     browser: {
//       enabled: true,
//       provider: "playwright",
//       headless: false, // Set to false to see the browser UI
//       instances: [{ browser: "chromium" }],
//     },
//     coverage: {
//       provider: "v8",
//       reporter: ["text", "lcov", "clover"],
//       thresholds: {
//         global: {
//           statements: 90,
//           branches: 90,
//           functions: 90,
//           lines: 90,
//         },
//       },
//       exclude: [
//         "e2e/*",
//         "eslint.config.js",
//         "**/vite-env.d.ts",
//         "**/main.tsx",
//         "**/*.config.{ts,tsx}",
//         "**/interfaces/*",
//         "**/constants/*",
//         "**/styles/*",
//         "**/fixtures/*",
//         "**/context/*",
//       ],
//     },
//   },
// });
