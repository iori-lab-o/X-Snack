/**
 * API クライアント設定
 *
 * 優先順位:
 * - EXPO_PUBLIC_HONO_API_URL (Expo の公開環境変数)
 * - HONO_API_URL / API_URL (フォールバック)
 * - 既定: http://localhost:8787
 */

/**
 * URL の妥当性を検証する
 */
function validateApiUrl(url: string): string {
  // 空文字列チェック
  if (!url || url.trim() === '') {
    throw new Error('API URL が設定されていません');
  }

  // URL 形式チェック
  try {
    const parsedUrl = new URL(url);

    // http または https のみ許可
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error(
        `無効なプロトコル: ${parsedUrl.protocol}. http または https を使用してください`
      );
    }

    return url;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`無効な API URL 形式: ${url}`);
    }
    throw error;
  }
}

const rawApiUrl =
  process.env.EXPO_PUBLIC_HONO_API_URL ||
  process.env.HONO_API_URL ||
  process.env.API_URL ||
  'http://localhost:8787';

const API_BASE_URL = validateApiUrl(rawApiUrl);

/**
 * API への fetch ヘルパー
 */
export async function fetchApi<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * 共有型
 */
import type { ApiResponse, User } from '@expo-workers/types';

/**
 * API エンドポイント
 */
export const api = {
  /**
   * GET /api/greeting
   */
  getGreeting: () => fetchApi<{ message: string }>('/api/greeting'),

  /** ユーザー一覧 */
  getUsers: () => fetchApi<ApiResponse<User[]> & { count: number }>('/api/users'),

  /** ユーザー詳細 */
  getUser: (id: number) => fetchApi<ApiResponse<User>>(`/api/users/${id}`),

  /** ユーザー作成 */
  createUser: (user: Omit<User, 'id'>) =>
    fetchApi<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  /** ヘルスチェック */
  healthCheck: () => fetchApi<{ status: string; timestamp: string }>('/health'),
};

export { API_BASE_URL };
