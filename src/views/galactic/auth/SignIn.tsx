import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageHeader, PageShell } from "@/galactic/common";
import { useAuth } from "./AuthProvider";

const SignInPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/checkout";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Silakan masukkan email untuk login.");
      return;
    }

    if (!password.trim()) {
      setError("Silakan masukkan password Anda.");
      return;
    }

    setLoading(true);

    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Pastikan email dan password sudah benar.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Masuk untuk Checkout">
      <PageHeader
        eyebrow="Halaman Login"
        title="Masuk untuk melanjutkan pembelian"
        description="Akun diperlukan untuk memproses checkout dan menyimpan data pesanan Anda dengan aman."
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 sm-padding">
              <form className="checkout-form-wrap" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="checkout-form mb-30">
                  <div className="form-field">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="form-control"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button type="submit" className="default-btn w-100" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk dan lanjutkan"}
                  <span />
                </button>
                <p className="mt-3 text-center">
                  Belum punya akun? <Link to="/register">Daftar di sini</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default SignInPage;
