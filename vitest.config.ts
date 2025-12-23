import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [
      "src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ],
    exclude: [],
    globals: true,
    coverage: {
      provider: "v8"
    }
  }
})
