import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest, extractItem, getSessionStorageKey } from "../lib/api";
import type { AuthSession, AuthUser } from "../types/admin";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(session: AuthSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getSessionStorageKey();

  if (!session) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getSessionStorageKey();
  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readStoredSession();

    if (!session?.token) {
      setLoading(false);
      return;
    }

    setUser(session.user);
    setToken(session.token);

    void (async () => {
      try {
        const response = await apiRequest<AuthUser>("/auth/me", {
          method: "GET",
          token: session.token,
        });
        const nextUser = extractItem(response);

        if (nextUser) {
          setUser(nextUser);
          persistSession({ token: session.token, user: nextUser });
        }
      } catch {
        setUser(null);
        setToken(null);
        persistSession(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshUser = async () => {
    if (!token) {
      return;
    }

    const response = await apiRequest<AuthUser>("/auth/me", {
      method: "GET",
      token,
    });
    const nextUser = extractItem(response);

    if (nextUser) {
      setUser(nextUser);
      persistSession({ token, user: nextUser });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest<AuthSession>("/auth/login", {
      method: "POST",
      payload: { email, password },
      token: null,
    });
    const session = extractItem(response);

    if (!session) {
      throw new Error("Session login tidak ditemukan.");
    }

    setUser(session.user);
    setToken(session.token);
    persistSession(session);
  };

  const logout = async () => {
    try {
      if (token) {
        await apiRequest("/auth/logout", {
          method: "POST",
          token,
        });
      }
    } finally {
      setUser(null);
      setToken(null);
      persistSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider.");
  }

  return context;
}
