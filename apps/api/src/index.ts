import { Hono } from 'hono';
import { cors } from 'hono/cors';

// 環境変数の型定義
type Env = {
  ALLOWED_ORIGINS?: string;
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

// フロントエンドと型を共有するためにエクスポート
export type AppType = typeof app;

export default app;
