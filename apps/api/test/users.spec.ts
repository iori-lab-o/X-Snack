import { SELF, createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

describe('API: users endpoints', () => {
  it('unit: GET /api/users returns list', async () => {
    const request = new Request('http://example.com/api/users');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
    const json: unknown = await response.json();
    expect(json).toMatchObject({
      success: true,
      data: expect.any(Array),
      count: expect.any(Number),
    });
  });

  it('unit: GET /api/users/1 returns a user', async () => {
    const request = new Request('http://example.com/api/users/1');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
    const json: unknown = await response.json();
    expect(json).toMatchObject({
      success: true,
      data: {
        id: 1,
        name: expect.any(String),
        email: expect.any(String),
      },
    });
  });

  it('unit: GET /api/users/999 returns 404', async () => {
    const request = new Request('http://example.com/api/users/999');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    const json: unknown = await response.json();
    expect(json).toMatchObject({
      success: false,
      error: expect.any(String),
    });
  });

  it('integration: GET /api/users works', async () => {
    const response = await SELF.fetch('https://example.com/api/users');
    expect(response.status).toBe(200);
    const json: unknown = await response.json();
    expect(json).toMatchObject({
      success: true,
      data: expect.any(Array),
    });
  });
});
