/**
 * アプリケーションのテーマ定数
 * カラー、サイズ、スペーシングなどを一元管理
 */

export const Colors = {
  // プライマリカラー
  primary: '#0066cc',

  // 背景色
  background: '#f5f5f5',
  backgroundWhite: '#fff',

  // テキストカラー
  text: {
    primary: '#333',
    secondary: '#666',
    tertiary: '#999',
  },

  // ステータスカラー
  status: {
    error: '#d32f2f',
    success: '#4caf50',
    warning: '#ff9800',
  },
} as const;

export const FontSizes = {
  small: 12,
  medium: 16,
  large: 18,
  xlarge: 28,
} as const;

export const Spacing = {
  xs: 2,
  small: 8,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 40,
} as const;

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
} as const;
