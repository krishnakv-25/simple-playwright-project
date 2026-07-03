import { test, expect } from '@fixtures/test-fixtures';

test.describe('Auth API — negative & contract tests', () => {
  test('@smoke @api login with valid credentials returns an access token', async ({ apiClient }) => {
    const response = await apiClient.login({ username: 'emilys', password: 'emilyspass' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.username).toBe('emilys');
  });

  test('@regression @api login with invalid credentials returns 400 with descriptive error', async ({ apiClient }) => {
    const response = await apiClient.login({ username: 'emilys', password: 'wrong_password' });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('@regression @api login with non-existent user returns 400', async ({ apiClient }) => {
    const response = await apiClient.login({ username: 'definitely_not_a_real_user', password: 'whatever' });
    expect(response.status()).toBe(400);
  });
});

test.describe('Products API — read-only contract tests', () => {
  test('@regression @api GET /products returns catalog items with expected schema', async ({ apiClient }) => {
    const body = await apiClient.listProductsJson(5);

    expect(body.products).toHaveLength(5);
    for (const product of body.products) {
      expect(product).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        price: expect.any(Number),
      });
      expect(product.price).toBeGreaterThan(0);
    }
  });
});
