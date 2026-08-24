import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "html",
  /* Le webServer est `next dev` : un seul processus qui compile encore les routes pendant que
     les workers naviguent déjà. Au-delà de 2 workers il sature et des `goto` dépassent les 30 s
     par défaut — mesuré : 4 workers → 5 échecs en 2,1 min, 2 workers → 14/14 en 46 s. Ce n'est
     pas un défaut applicatif (la prod est prérendue), d'où un plafond de workers et des délais
     larges plutôt qu'une suite instable. */
  workers: 2,
  globalSetup: "./e2e/global-setup.ts",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 60_000,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
