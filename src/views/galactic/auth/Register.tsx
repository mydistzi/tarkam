import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageHeader, PageShell } from "@/galactic/common";
import { useAuth } from "./AuthProvider";

const RegisterPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/checkout";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Silakan masukkan nama lengkap.");
      return;
    }

    if (!email.trim()) {
      setError("Silakan masukkan email untuk mendaftar.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      await signUp(name.trim(), email.trim(), password, confirmPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registrasi gagal. Silakan periksa kembali data Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Daftar Akun">
      <PageHeader
        eyebrow="Registrasi"
        title="Buat akun untuk checkout"
        description="Daftar sekarang supaya proses pembelian lebih mudah dan data pesanan tersimpan dengan benar."
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 sm-padding">
              <form className="checkout-form-wrap" onSubmit={handleSubmit}>
                <h2>Daftar Akun</h2>
                <div className="checkout-form mb-30">
                  <div className="form-field">
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="form-control"
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="email"
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="form-control"
                      placeholder="Konfirmasi password"
                      required
                    />
                  </div>
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button type="submit" className="default-btn w-100" disabled={loading}>
                  {loading ? "Memproses..." : "Daftar dan lanjutkan"}
                  <span />
                </button>
                <p className="mt-3 text-center">
                  Sudah punya akun? <Link to="/signin">Masuk di sini</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default RegisterPage;
