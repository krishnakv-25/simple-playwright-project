import { test, expect } from '@fixtures/test-fixtures';
import { DataGenerator } from '@utils/data-generator';

test.describe('Users API', () => {
  test('@smoke @api GET /users returns a paginated list with expected schema', async ({ apiClient }) => {
    const body = await apiClient.listUsersJson(10, 0);

    expect(body.limit).toBe(10);
    expect(body.users.length).toBeGreaterThan(0);
    for (const user of body.users) {
      expect(user).toMatchObject({
        id: expect.any(Number),
        email: expect.stringContaining('@'),
        firstName: expect.any(String),
        lastName: expect.any(String),
        username: expect.any(String),
      });
    }
  });

  test('@regression @api GET /users/:id returns a single user', async ({ apiClient }) => {
    const response = await apiClient.getUser(2);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(2);
  });

  test('@regression @api GET /users/:id returns 404 for a non-existent user', async ({ apiClient }) => {
    const response = await apiClient.getUser(999999);
    expect(response.status()).toBe(404);
  });

  test('@smoke @api POST /users/add creates a user and returns 201', async ({ apiClient }) => {
    const payload = { firstName: DataGenerator.user().firstName, lastName: DataGenerator.user().lastName, age: 30 };
    const response = await apiClient.createUser(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ firstName: payload.firstName, lastName: payload.lastName });
    expect(body.id).toBeTruthy();
  });

  test('@regression @api PUT /users/:id updates a user', async ({ apiClient }) => {
    const payload = { firstName: DataGenerator.user().firstName };
    const response = await apiClient.updateUser(2, payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe(payload.firstName);
    expect(body.id).toBe(2);
  });

  test('@regression @api DELETE /users/:id soft-deletes and marks the record', async ({ apiClient }) => {
    const response = await apiClient.deleteUser(2);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isDeleted).toBe(true);
    expect(body.id).toBe(2);
  });

  test('@regression @api response time for GET /users is within SLA', async ({ apiClient }) => {
    const start = Date.now();
    await apiClient.listUsers(10, 0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(2000);
  });

  test('@regression @api response headers include expected content-type', async ({ apiClient }) => {
    const response = await apiClient.listUsers();
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
