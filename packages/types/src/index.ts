// 共有型定義

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// X風要約AI用の型定義
export interface SummarizeRequest {
  text: string;
}

export interface SummarizeResponse {
  summary: string;
  hashtags: string[];
  characterCount: number;
}
