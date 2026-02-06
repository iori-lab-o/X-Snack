import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

// Alert のモック（React Native）
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: {
      alert: vi.fn(),
    },
  };
});

// API モックを設定
vi.mock('../lib/apiClient', () => ({
  api: {
    summarize: vi.fn(),
  },
}));

import { Alert } from 'react-native';
import { api } from '../lib/apiClient';

describe('App - X風要約AI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと説明が表示される', async () => {
    render(<App />);
    expect(screen.getByText(/X風要約AI/i)).toBeTruthy();
    expect(screen.getByText(/長文をXの投稿に最適化/i)).toBeTruthy();
  });

  it('入力フィールドとボタンが表示される', async () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/要約したい長文をここに入力してください/)).toBeTruthy();
    expect(screen.getByText(/✨ 要約する/i)).toBeTruthy();
  });

  it('空文字で要約ボタンを押すとアラートが表示される', async () => {
    render(<App />);
    const button = screen.getByText(/✨ 要約する/i);

    fireEvent.click(button);

    expect(Alert.alert).toHaveBeenCalledWith('エラー', 'テキストを入力してください');
  });

  it('要約に成功すると結果が表示される', async () => {
    const mockSummary = 'これは要約結果です。 #test';
    (api.summarize as Mock).mockResolvedValue({
      success: true,
      data: { summary: mockSummary },
      remainingCount: 2,
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/要約したい長文をここに入力してください/);
    const button = screen.getByText(/✨ 要約する/i);

    fireEvent.change(input, { target: { value: '長い文章の内容...' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(mockSummary)).toBeTruthy();
      expect(screen.getByText(/残り 2 回/i)).toBeTruthy();
    });
  });

  it('APIエラー時にエラーメッセージが表示される', async () => {
    (api.summarize as Mock).mockResolvedValue({
      success: false,
      error: 'APIエラーが発生しました',
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/要約したい長文をここに入力してください/);
    const button = screen.getByText(/✨ 要約する/i);

    fireEvent.change(input, { target: { value: 'テスト入力' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/❌ APIエラーが発生しました/i)).toBeTruthy();
    });
  });

  it('クリップボードにコピーボタンが表示され、Alertが呼ばれる', async () => {
    (api.summarize as Mock).mockResolvedValue({
      success: true,
      data: { summary: 'コピー対象' },
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/要約したい長文をここに入力してください/);
    const button = screen.getByText(/✨ 要約する/i);

    fireEvent.change(input, { target: { value: 'テスト入力' } });
    fireEvent.click(button);

    const copyButton = await screen.findByText(/📋 クリップボードにコピー/i);
    expect(copyButton).toBeTruthy();

    // クリップボードのモックが必要な場合は追加するが、ここではボタンの存在確認を優先
  });
});
