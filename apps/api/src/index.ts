import { Hono } from 'hono';
import { cors } from 'hono/cors';

// 環境変数の型定義
type Env = {
  ALLOWED_ORIGINS?: string;
  GEMINI_API_KEY?: string;
  HUGGINGFACE_API_TOKEN?: string; // オプション: HF無料枠でも動作
  RATE_LIMIT_KV?: KVNamespace;
  AI?: Ai; // Cloudflare Workers AI (バックアップ用)
};

/**
 * デモ用サンプルデータ
 *
 * ⚠️ 警告: このデータはメモリ内に保存されており、本番環境では使用しないでください。
 * Cloudflare Workers はエッジ環境で実行されるため、メモリ状態は保証されません。
 *
 * 本番環境では以下のストレージサービスを使用してください:
 * - Cloudflare D1: SQL データベース
 * - Cloudflare KV: Key-Value ストア
 * - Cloudflare Durable Objects: 状態を持つアプリケーション
 * - 外部データベース（PostgreSQL, MongoDB など）
 */
const users = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  { id: 2, name: '佐藤花子', email: 'sato@example.com' },
  { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' },
];

const app = new Hono<{ Bindings: Env }>();

// CORS 設定（環境変数で制御）
// 本番環境では wrangler.jsonc に ALLOWED_ORIGINS を設定してください
// 例: "vars": { "ALLOWED_ORIGINS": "https://example.com,https://www.example.com" }
// または wrangler secret put ALLOWED_ORIGINS でシークレットとして設定
app.use(
  '/*',
  cors({
    origin: (origin, c) => {
      // 環境変数から許可するオリジンを取得
      const allowedOriginsStr = c.env.ALLOWED_ORIGINS;
      const allowedOrigins = allowedOriginsStr?.split(',').map((o: string) => o.trim()) || [];

      // 開発環境（ALLOWED_ORIGINS が未設定）の場合は全て許可
      if (allowedOrigins.length === 0) {
        return origin;
      }

      // 本番環境では指定されたオリジンのみ許可
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
  })
);

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    message: 'expo-workers-monorepo API',
    version: '1.0.0',
    endpoints: {
      greeting: '/api/greeting',
      users: '/api/users',
      user: '/api/users/:id',
    },
  });
});

// 挨拶エンドポイント
app.get('/api/greeting', (c) => {
  return c.json({ message: 'Hello from modern Hono & Cloudflare!' });
});

// ユーザー一覧取得
app.get('/api/users', (c) => {
  return c.json({
    success: true,
    data: users,
    count: users.length,
  });
});

// ユーザー詳細取得
app.get('/api/users/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json(
      {
        success: false,
        error: 'ユーザーが見つかりません',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: user,
  });
});

// ユーザー作成（サンプル）
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  const newUser = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
  };

  users.push(newUser);

  return c.json(
    {
      success: true,
      data: newUser,
      message: 'ユーザーを作成しました',
    },
    201
  );
});

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// X風要約エンドポイント (Gemini API 無料枠利用)
import type { SummarizeRequest, SummarizeResponse } from '../../../packages/types/src/index.js';

app.post('/api/summarize', async (c) => {
  try {
    const body = await c.req.json<SummarizeRequest>();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return c.json(
        {
          success: false,
          error: 'テキストを入力してください',
        },
        400
      );
    }

    // ===== レート制限チェック (1日3回まで) =====
    const clientIP = c.req.header('cf-connecting-ip') || 'unknown';
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const rateLimitKey = `rate:${clientIP}:${today}`;
    const kv = c.env.RATE_LIMIT_KV;

    if (kv) {
      const currentCount = await kv.get(rateLimitKey);
      const count = currentCount ? Number.parseInt(currentCount, 10) : 0;

      if (count >= 3) {
        return c.json(
          {
            success: false,
            error: '本日の利用上限（3回）に達しました。明日再度お試しください。',
            remainingCount: 0,
          },
          429
        );
      }

      // カウント増加 (24時間TTL: 86400秒)
      await kv.put(rateLimitKey, String(count + 1), { expirationTtl: 86400 });

      // ===== システム全体の総リクエスト制限 (1日 1,000回) =====
      const globalLimitKey = `rate:global:${today}`;
      const currentGlobalCount = await kv.get(globalLimitKey);
      const globalCount = currentGlobalCount ? Number.parseInt(currentGlobalCount, 10) : 0;

      if (globalCount >= 1000) {
        return c.json(
          {
            success: false,
            error: 'システム全体の本日上限に達しました。明日再度お試しください。',
            remainingCount: 0,
          },
          429
        );
      }
      await kv.put(globalLimitKey, String(globalCount + 1), { expirationTtl: 86400 });
    }

    // ===== マルチプロバイダーフォールバック (完全無料・課金なし) =====
    // 優先順位: Gemini (最高品質) → Workers AI (10k/日無料) → Hugging Face (完全無料)
    const trimmed = text.length > 1500 ? `${text.slice(0, 1500)}…(省略)` : text;

    // 出力後処理: 280 文字制限、ハッシュタグ末尾統一、重複除去
    function postProcess(raw: string, tags: string[]) {
      const found = raw.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g) || [];
      const all = Array.from(new Set([...found, ...tags]));
      let body = raw.replace(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g, '').trim();
      const tagBlock = all.join(' ');
      const maxBodyLen = Math.max(0, 280 - tagBlock.length - 1);
      if (body.length > maxBodyLen) body = `${body.slice(0, maxBodyLen - 1).trimEnd()}…`;
      return `${body}\n${tagBlock}`.trim();
    }

    const buildMock = (reason: string) => {
      const mockCore = trimmed.slice(0, 120);
      const base = `🚀 ${mockCore}… という内容を要約しました (${reason})`;
      const hashtags = ['#要約', '#X投稿', '#AI'];
      const summary = postProcess(base, hashtags);
      return {
        summary,
        hashtags,
        characterCount: summary.length,
      } satisfies SummarizeResponse;
    };

    const prompt = `次の長文をTwitter/X投稿に最適な形で要約してください。

要件:
- 280文字以内 (本文 + ハッシュタグ含む)
- ハッシュタグ2〜3個を末尾にまとめる
- 絵文字は最大2個
- 日本語で簡潔かつ魅力的に

長文:
${trimmed}

回答形式: 本文 (改行) #ハッシュタグ1 #ハッシュタグ2`;

    let aiText = '';
    let provider = 'mock';

    // 1️⃣ Gemini API (Primary: 最高品質、60req/min無料)
    if (c.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${c.env.GEMINI_API_KEY}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }).catch(() => null);

      if (geminiRes?.ok) {
        const data = (await geminiRes.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 10) {
          aiText = text;
          provider = 'gemini';
          console.log('✅ Gemini API成功');
        }
      } else {
        console.warn(`⚠️ Gemini API失敗 (status: ${geminiRes?.status || 'network error'})`);
      }
    }

    // 2️⃣ Cloudflare Workers AI (Secondary: 10k Neurons/日無料、課金なし設定)
    if (!aiText && c.env.AI) {
      try {
        const aiRes = await c.env.AI.run('@cf/meta/llama-3.2-1b-instruct', {
          prompt,
          max_tokens: 300,
        });
        const text = (aiRes as { response?: string })?.response;
        if (text && text.length > 10) {
          aiText = text;
          provider = 'workers-ai';
          console.log('✅ Workers AI成功 (Geminiフォールバック)');
        }
      } catch (err) {
        console.warn('⚠️ Workers AI失敗:', err);
      }
    }

    // 3️⃣ Hugging Face Inference API (Tertiary: 完全無料、最終手段)
    if (!aiText) {
      const hfToken = c.env.HUGGINGFACE_API_TOKEN;
      const hfUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-base';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (hfToken) headers.Authorization = `Bearer ${hfToken}`;

      const hfRes = await fetch(hfUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 250, temperature: 0.7 },
        }),
      }).catch(() => null);

      if (hfRes?.ok) {
        const data = (await hfRes.json()) as
          | Array<{ generated_text?: string }>
          | { generated_text?: string };
        const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
        if (text && text.length > 10) {
          aiText = text;
          provider = 'huggingface';
          console.log('✅ Hugging Face成功 (最終フォールバック)');
        }
      } else {
        console.warn('⚠️ Hugging Face失敗、モックへフォールバック');
      }
    }

    // 4️⃣ 全プロバイダー失敗時: モック応答
    if (!aiText) {
      const mock = buildMock('全AI一時利用不可');
      return c.json<{ success: boolean; data: SummarizeResponse }>({ success: true, data: mock });
    }

    const hashMatches = aiText.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g) || [];
    const finalized = postProcess(aiText, hashMatches.slice(0, 3));
    const hashtagsFinal = finalized.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g) || [];

    // 残り回数を計算して返却
    let remainingCount = 2; // デフォルト（初回は残り2）
    if (kv) {
      const updatedCount = await kv.get(rateLimitKey);
      remainingCount = 3 - (updatedCount ? Number.parseInt(updatedCount, 10) : 1);
    }

    return c.json<{
      success: boolean;
      data: SummarizeResponse;
      remainingCount: number;
      provider: string;
    }>({
      success: true,
      data: {
        summary: finalized,
        hashtags: hashtagsFinal,
        characterCount: finalized.length,
      },
      remainingCount,
      provider, // 使用したAIプロバイダー (gemini/workers-ai/huggingface/mock)
    });
  } catch (error) {
    console.error('要約エラー:', error);
    return c.json(
      {
        success: false,
        error: '要約処理中にエラーが発生しました',
      },
      500
    );
  }
});

// フロントエンドと型を共有するためにエクスポート
export type AppType = typeof app;

export default app;
