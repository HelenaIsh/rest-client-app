import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.config.{js,ts,mjs}',
        '**/vitest.config.ts',
        '**/next.config.ts',
        '**/eslint.config.mjs',
        '**/postcss.config.mjs',
        '**/tsconfig.json',
        '**/.prettierrc',
        '**/next-env.d.ts',
        '**/messages/**',
        '**/coverage/**',
        '**/config**',
        '**/.husky/**',
        '**/.git/**',
        '**/.idea/**',
        '**/.next/**',
        '**/public/**',
        '**/i18n/**',
        '**/middleware.ts',
        '**/types.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(
        __dirname,
        './src/app/[locale]/client/components'
      ),
    },
  },
});
