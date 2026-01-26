import client from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<void> {
  await client.post("/users", data);
}

export async function autoLogin(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<void> {
  await client.post("/auth/logout");
}
