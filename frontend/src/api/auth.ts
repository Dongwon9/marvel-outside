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

export async function deleteAccount(): Promise<void> {
  await client.delete("/users");
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await client.get<{ message: string }>("/auth/verify-email", {
    params: { token },
  });
  return response.data;
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
  const response = await client.post<{ message: string }>("/auth/resend-verification");
  return response.data;
}
