import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
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
});
