import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  define: {
    __DEV__: true,
  },
  server: {
    deps: {
      inline: ['expo-clipboard', 'expo-modules-core', 'expo-status-bar'],
    },
  },
});
