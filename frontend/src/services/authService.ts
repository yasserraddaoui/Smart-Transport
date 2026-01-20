import { api } from "./api";

export type AuthResponse = {
  token: string;
  username: string;
  role: string;
  fullName: string;
  city: string;
};

export type UserProfile = {
  id: number;
  username: string;
  role: string;
  fullName: string;
  city: string;
  createdAt: string;
};

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", { username, password });
  return res.data;
}

export async function register(payload: {
  username: string;
  password: string;
  role: string;
  fullName: string;
  city: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data;
}

export async function me(): Promise<UserProfile> {
  const res = await api.get<UserProfile>("/auth/me");
  return res.data;
}

export async function updateUser(id: number, payload: { fullName: string; city: string; password?: string }): Promise<UserProfile> {
  const res = await api.put<UserProfile>(`/auth/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/auth/users/${id}`);
}

export async function hello(): Promise<string> {
  const res = await api.get<string>("/auth/hello", { responseType: "text" });
  return typeof res.data === "string" ? res.data : String(res.data);
}
