import '@testing-library/dom';
import { vi } from 'vitest';

// Expo環境のグローバル変数をモック
// @ts-expect-error - テスト環境用のグローバル変数モック
global.__DEV__ = true;

// process.env.EXPO_OS を定義（Expoが必要とする）
process.env.EXPO_OS = 'web';

// Expo modules のモック
// @ts-expect-error - テスト環境用のグローバル変数モック
global.expo = {
  modules: {},
};

// ExpoModules のグローバルをモック
// @ts-expect-error - テスト環境用のグローバル変数モック
if (typeof globalThis.ExpoModules === 'undefined') {
  // @ts-expect-error - テスト環境用のグローバル変数モック
  globalThis.ExpoModules = {
    EventEmitter: class EventEmitter {
      addListener() {}
      removeListener() {}
      removeAllListeners() {}
    },
  };
}

// expo-clipboard のモック
vi.mock('expo-clipboard', () => ({
  setStringAsync: vi.fn().mockResolvedValue(undefined),
  getStringAsync: vi.fn().mockResolvedValue(''),
  hasStringAsync: vi.fn().mockResolvedValue(false),
}));

// グローバル設定をここに追加できます
