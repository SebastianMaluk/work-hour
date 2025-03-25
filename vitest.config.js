import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/unit/**/*.test.js'],
    coverage: {
      reportsDirectory: './coverage-reports/',
      reporter: ['text', 'json-summary', 'json', 'html'],
      include: ['src/**/*.js'],
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60
      }
    }
  }
});