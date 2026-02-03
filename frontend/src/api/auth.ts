import client from "./client";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  message: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}
export interface MeResponse {
  id: string;
  email: string;
  name: string;
}
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function signup(data: SignupRequest): Promise<void> {
  await client.post("/users", data);
}

export async function logout(): Promise<void> {
  await client.post("/auth/logout");
}

export async function getMe(): Promise<MeResponse | null> {
  const response = await client.get<MeResponse>("/auth/me");
  return response.data;
}
