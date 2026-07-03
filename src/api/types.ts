export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age: number;
}

export interface ListUsersResponse {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  age: number;
}

export interface CreateUserResponse extends DummyUser {
  isAdded: true;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  age?: number;
}

export interface UpdateUserResponse extends DummyUser {
  isUpdated: true;
}

export interface DeleteUserResponse extends DummyUser {
  isDeleted: true;
  deletedOn: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginSuccessResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginErrorResponse {
  message: string;
}

export interface ProductsResponse {
  products: Array<{
    id: number;
    title: string;
    price: number;
    category: string;
    stock: number;
  }>;
  total: number;
  skip: number;
  limit: number;
}
