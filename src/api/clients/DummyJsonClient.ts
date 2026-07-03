import type { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '@utils/logger';
import type {
  CreateUserRequest,
  CreateUserResponse,
  ListUsersResponse,
  LoginRequest,
  ProductsResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DummyUser,
} from '../types';

/**
 * Typed client for the public dummyjson.com demo API.
 * No signup or API key required, making the suite runnable out of the box —
 * a deliberate choice for a portfolio project others will clone and run.
 * Wraps Playwright's APIRequestContext to keep test files free of
 * raw endpoint strings and repetitive response parsing.
 */
export class DummyJsonClient {
  constructor(private readonly request: APIRequestContext) {}

  async listUsers(limit = 10, skip = 0): Promise<APIResponse> {
    logger.info({ limit, skip }, 'GET /users');
    return this.request.get('/users', { params: { limit: String(limit), skip: String(skip) } });
  }

  async getUser(id: number): Promise<APIResponse> {
    logger.info({ id }, 'GET /users/:id');
    return this.request.get(`/users/${id}`);
  }

  async createUser(payload: CreateUserRequest): Promise<APIResponse> {
    logger.info({ payload }, 'POST /users/add');
    return this.request.post('/users/add', { data: payload });
  }

  async updateUser(id: number, payload: UpdateUserRequest): Promise<APIResponse> {
    logger.info({ id, payload }, 'PUT /users/:id');
    return this.request.put(`/users/${id}`, { data: payload });
  }

  async deleteUser(id: number): Promise<APIResponse> {
    logger.info({ id }, 'DELETE /users/:id');
    return this.request.delete(`/users/${id}`);
  }

  async login(payload: LoginRequest): Promise<APIResponse> {
    logger.info({ username: payload.username }, 'POST /auth/login');
    return this.request.post('/auth/login', { data: payload });
  }

  async listProducts(limit = 10): Promise<APIResponse> {
    logger.info({ limit }, 'GET /products');
    return this.request.get('/products', { params: { limit: String(limit) } });
  }

  // Convenience typed helpers — parse + return body directly
  async listUsersJson(limit = 10, skip = 0): Promise<ListUsersResponse> {
    const res = await this.listUsers(limit, skip);
    return res.json() as Promise<ListUsersResponse>;
  }

  async getUserJson(id: number): Promise<DummyUser> {
    const res = await this.getUser(id);
    return res.json() as Promise<DummyUser>;
  }

  async createUserJson(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const res = await this.createUser(payload);
    return res.json() as Promise<CreateUserResponse>;
  }

  async updateUserJson(id: number, payload: UpdateUserRequest): Promise<UpdateUserResponse> {
    const res = await this.updateUser(id, payload);
    return res.json() as Promise<UpdateUserResponse>;
  }

  async listProductsJson(limit = 10): Promise<ProductsResponse> {
    const res = await this.listProducts(limit);
    return res.json() as Promise<ProductsResponse>;
  }
}
