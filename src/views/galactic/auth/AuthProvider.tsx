import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type AuthUser = {
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

const AUTH_STORAGE_KEY = "tarkam_auth_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const serialized = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serialized) {
      try {
        setUser(JSON.parse(serialized) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn: (nextUser: AuthUser) => {
        setUser(nextUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      },
    }),
    [user],
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
  const [didAlert, setDidAlert] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !didAlert) {
      setDidAlert(true);
      Swal.fire({
        icon: "warning",
        title: "Harus Login Terlebih Dahulu",
        text: "Agar bisa menyelesaikan transaksi pembelian, silakan login atau daftar terlebih dahulu.",
        confirmButtonText: "Masuk sekarang",
      }).then(() => {
        navigate("/signin", { state: { from: location }, replace: true });
      });
    }
  }, [didAlert, isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
