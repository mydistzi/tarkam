import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useAuth } from "./AuthProvider";

const SignInPage = () => {
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
      setError("Silakan masukkan email untuk login.");
      return;
    }

    signIn({ email: email.trim(), name: name.trim() || undefined });
    navigate(from, { replace: true });
  };

  return (
    <PageShell title="Masuk untuk Checkout">
      <div className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="sign-in-box rounded-3 bg-white p-6 shadow-theme">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Login</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Silakan masuk untuk melanjutkan proses pembelian.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="form-control"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Nama (opsional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="form-control"
                      placeholder="Nama Anda"
                    />
                  </div>

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

                  <button type="submit" className="default-btn w-full">
                    Masuk dan lanjutkan
                    <span />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default SignInPage;
