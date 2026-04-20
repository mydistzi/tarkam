import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { useLiveUpdate } from "../socket/SocketProvider";

type AuthUser = {
  id: number;
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "tarkam_auth_user";

type StoredAuth = {
  token: string;
  user: AuthUser;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const liveKey = useLiveUpdate();

  useEffect(() => {
    const serialized = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serialized) {
      try {
        const stored = JSON.parse(serialized) as StoredAuth;
        setUser(stored.user);
        setToken(stored.token);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const validateSession = async () => {
      try {
        const response = await Api.get("/auth/me");
        const payload = response.data?.data;

        if (!payload?.id || !payload?.email) {
          throw new Error("Invalid auth payload");
        }

        const nextUser: AuthUser = {
          id: payload.id,
          email: payload.email,
          name: payload.name,
        };

        setUser(nextUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setToken(null);
      }
    };

    void validateSession();
  }, [token, liveKey]);

  const setAuthState = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await Api.post("/auth/login", {
      email,
      password,
    });

    const payload = response.data?.data;
    if (!payload?.token || !payload?.user) {
      throw new Error("Login gagal. Coba lagi.");
    }

    const nextUser: AuthUser = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
    };

    setAuthState(payload.token, nextUser);
    return nextUser;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await Api.post("/auth/register", {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    const payload = response.data?.data;
    if (!payload?.token || !payload?.user) {
      throw new Error("Registrasi gagal. Coba lagi.");
    }

    const nextUser: AuthUser = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
    };

    setAuthState(payload.token, nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (token) {
        await Api.post("/auth/logout");
      }
    } catch {
      // Ignore logout errors and clear local state anyway.
    }

    clearAuthState();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      signIn,
      signUp,
      signOut,
    }),
    [user, token, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const didAlertRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !didAlertRef.current) {
      didAlertRef.current = true;
      Swal.fire({
        icon: "warning",
        title: "Harus Login Terlebih Dahulu",
        text: "Agar bisa menyelesaikan transaksi pembelian, silakan login atau daftar terlebih dahulu.",
        confirmButtonText: "Masuk sekarang",
      }).then(() => {
        navigate("/signin", { state: { from: location }, replace: true });
      });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
