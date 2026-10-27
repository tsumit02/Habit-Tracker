import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

import {
  apiRequest,
  getToken,
  ApiError,
  removeToken,
  saveToken,
  setUnauthorizedHandler,
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
  validateSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const logoutInProgress = useRef(false);

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
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;

    // Update the UI immediately.
    setUser(null);
    setIsAuthenticated(false);

    try {
      await removeToken();
    } catch (error) {
      console.error("Unable to remove authentication token:", error);
    } finally {
      logoutInProgress.current = false;
    }
  }, []);
    useEffect(() => {
    setUnauthorizedHandler(() => logout());

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);
  
  const validateSession = useCallback(async (): Promise<boolean> => {
  try {
    const token = await getToken();

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return true;
    }

    const result = await apiRequest<{ user: AuthUser }>("/api/auth/me");

    setUser(result.user);
    setIsAuthenticated(true);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await logout();
      return true;
    }

    console.error("Session validation failed:", error);
    return false;
  }
}, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        validateSession,
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
