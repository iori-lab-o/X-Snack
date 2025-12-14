import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

// API モックを設定
vi.mock('../lib/apiClient', () => ({
  api: {
    summarize: vi.fn(),
  },
}));

import { api } from '../lib/apiClient';

describe('App - X風要約AI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと説明が表示される', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/X風要約AI/i)).toBeTruthy();
    expect(screen.getByText(/長文をXの投稿に最適化/i)).toBeTruthy();
  });

  it('無料版の制限メッセージが表示される', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/無料版のため、1日に要約できるのは3回までです/i)).toBeTruthy();
  });

  it('入力フィールドとボタンが表示される', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByPlaceholderText(/要約したい長文をここに入力してください/i)).toBeTruthy();
    expect(screen.getByText(/✨ 要約する/i)).toBeTruthy();
  });

  it('Powered by メッセージが表示される', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/Powered by Cloudflare Workers AI/i)).toBeTruthy();
  });
});
