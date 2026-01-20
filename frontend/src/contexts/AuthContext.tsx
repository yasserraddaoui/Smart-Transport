import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { api, setOnUnauthorizedHandler } from "../services/api";
import { extractJwtInfo, isExpired, JwtInfo } from "../utils/jwt";
import { login as loginApi } from "../services/authService";

type AuthContextValue = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: JwtInfo | null;
  login: (username: string, password: string) => Promise<import("../services/authService").AuthResponse>;
  logout: () => void;
  hasAnyRole: (roles: string[]) => boolean;
};

const TOKEN_STORAGE_KEY = "sts.jwt";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtInfo | null>(null);

  const applyToken = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      setUser(extractJwtInfo(nextToken));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      delete api.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    applyToken(null);
  }, [applyToken]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await loginApi(username, password);
    applyToken(response.token);
    return response;
  }, [applyToken]);

  const hasAnyRole = useCallback((roles: string[]) => {
    if (!user) return false;
    const owned = new Set(user.roles.map((r) => r.toLowerCase()));
    return roles.some((r) => owned.has(r.toLowerCase()));
  }, [user]);

  useEffect(() => {
    setOnUnauthorizedHandler(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) applyToken(stored);
    setIsInitialized(true);
  }, [applyToken]);

  useEffect(() => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    if (isExpired(user)) logout();
  }, [logout, token, user]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isInitialized,
      isAuthenticated: Boolean(token),
      token,
      user,
      login,
      logout,
      hasAnyRole,
    };
  }, [hasAnyRole, isInitialized, login, logout, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
