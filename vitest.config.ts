import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Lets tests render the real view components: the repo's tsconfig leaves
  // `jsx: "preserve"` for Next, so without this plugin any .tsx import fails
  // to parse under vitest.
  plugins: [react()],
  test: {
    environment: "node",
    // Playwright owns `e2e/`; without this vitest collects those specs too and
    // Playwright's `test()` throws when called outside its own runner.
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/__tests__/setup.ts"],
    // These suites import whole route trees through vite's transform pipeline,
    // which routinely passes 5s on a cold cache — the failures that produced
    // were timeouts, not assertions.
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
