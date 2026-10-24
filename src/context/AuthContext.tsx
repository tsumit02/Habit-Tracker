import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  apiRequest,
  getToken,
  removeToken,
  saveToken,
} from "../services/api";

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
  message: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const token = await getToken();

        if (mounted && token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Unable to restore session:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiRequest<AuthResponse>(
        "/api/auth/login",
        {
          method: "POST",
          authenticated: false,
          body: JSON.stringify({ email, password }),
        }
      );

      await saveToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await apiRequest<AuthResponse>(
        "/api/auth/register",
        {
          method: "POST",
          authenticated: false,
          body: JSON.stringify({ name, email, password }),
        }
      );

      await saveToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
    },
    []
  );

  const logout = useCallback(async () => {
    await removeToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
