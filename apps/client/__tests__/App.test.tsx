import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

// API モックを設定
vi.mock('../lib/apiClient', () => ({
  api: {
    getGreeting: vi.fn(),
  },
}));

import { api } from '../lib/apiClient';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ローディング状態を表示する', async () => {
    // 永久に保留
    vi.mocked(api.getGreeting).mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/API から読み込み中/i)).toBeTruthy();
  });

  it('API から greeting を取得して表示する', async () => {
    vi.mocked(api.getGreeting).mockResolvedValue({
      message: 'Hello from Test!',
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Hello from Test!/i)).toBeTruthy();
    });
  });

  it('エラー時にエラーメッセージと再試行ボタンを表示する', async () => {
    vi.mocked(api.getGreeting).mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeTruthy();
      expect(screen.getByText(/再試行/i)).toBeTruthy();
    });
  });

  it('タイトルが表示される', async () => {
    vi.mocked(api.getGreeting).mockResolvedValue({
      message: 'Hello!',
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/Expo \+ Cloudflare Workers/i)).toBeTruthy();
  });
});
