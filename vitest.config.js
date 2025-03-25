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
    }
  }
});