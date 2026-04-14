import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader, PageShell } from "@/galactic/common";
import { useAuth } from "./AuthProvider";

const RegisterPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/checkout";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Silakan masukkan email untuk mendaftar.");
      return;
    }

    signIn({ email: email.trim(), name: name.trim() || undefined });
    navigate(from, { replace: true });
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
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button type="submit" className="default-btn w-100">
                  Daftar dan lanjutkan
                  <span />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default RegisterPage;
