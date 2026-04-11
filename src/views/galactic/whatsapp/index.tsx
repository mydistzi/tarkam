import { useEffect, useState, type FormEvent } from "react";
import { PageHeader, PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";

type WhatsAppSession = {
  provider: string;
  connection: string;
  qr?: string | null;
  qrAvailable: boolean;
  qrPngAvailable: boolean;
  user?: {
    id?: string;
    name?: string;
    jid?: string;
  } | null;
};

const BAILEYS_BASE_URL = import.meta.env.VITE_BAILEYS_BASE_URL || "/baileys";
const BAILEYS_API_TOKEN = import.meta.env.VITE_BAILEYS_API_TOKEN || "";

const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    "Accept": "application/json",
  };
  if (BAILEYS_API_TOKEN) {
    headers.Authorization = `Bearer ${BAILEYS_API_TOKEN}`;
  }
  return headers;
};

const WhatsAppPage = () => {
  const { meta } = useGalacticContent();
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [toPhone, setToPhone] = useState("628");
  const [message, setMessage] = useState("Halo, saya ingin menghubungi melalui WhatsApp!");
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);
    setSendStatus(null);

    try {
      const response = await fetch(`${BAILEYS_BASE_URL}/api/whatsapp/session`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${response.status}`);
      }

      const payload = await response.json();
      const sessionData = payload?.data || {};
      setSession(sessionData);

      if (!sessionData?.qrPngAvailable) {
        setQrUrl(null);
      } else {
        setQrUrl(`${BAILEYS_BASE_URL}/api/whatsapp/qr.png?ts=${Date.now()}`);
      }
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSession();
  }, []);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendStatus(null);

    try {
      if (!toPhone.trim() || !message.trim()) {
        setSendStatus("Nomor dan pesan harus diisi.");
        return;
      }

      const response = await fetch(`${BAILEYS_BASE_URL}/api/whatsapp/send-message`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: toPhone.trim(),
          text: message.trim(),
        }),
      });

      const body = await response.json();
      if (!response.ok || body?.success === false) {
        throw new Error(body?.error || `HTTP ${response.status}`);
      }

      setSendStatus("Pesan berhasil dikirim.");
      setMessage("Halo, saya ingin menghubungi melalui WhatsApp!");
    } catch (err) {
      setSendStatus(`Gagal mengirim pesan: ${String(err instanceof Error ? err.message : err)}`);
    }
  };

  return (
    <PageShell title="Jembatan WhatsApp">
      <>
        <PageHeader
          eyebrow="Jembatan WhatsApp"
          title="Hubungkan Baileys dengan WhatsApp"
          description={meta.tagline || meta.description}
        />

        <section className="contact-section padding-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 sm-padding">
                <div className="contact-details-wrap">
                  <h3>Status Koneksi</h3>
                  <p>Baileys service sedang diakses dari: <code>{BAILEYS_BASE_URL}</code></p>
                  {loading ? (
                    <p>Memuat status koneksi...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <>
                      <p>Provider: <strong>{session?.provider || "tidak tersedia"}</strong></p>
                      <p>Koneksi: <strong>{session?.connection || "tidak diketahui"}</strong></p>
                      <p>Nomor terdaftar: <strong>{session?.user?.jid || "belum terhubung"}</strong></p>
                      {qrUrl ? (
                        <div className="qr-preview">
                          <h4>QR Code Login</h4>
                          <img src={qrUrl} alt="WhatsApp QR Code" style={{ maxWidth: "320px", width: "100%" }} />
                          <p>Scan QR di atas dengan WhatsApp untuk menyambungkan akun.</p>
                        </div>
                      ) : (
                        <p>QR code tidak tersedia. Jika koneksi belum berhasil, mulai ulang Baileys service atau periksa log.</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4 sm-padding">
                <div className="contact-details-wrap">
                  <h3>Kirim Pesan WhatsApp</h3>
                  <form className="contact-form form-horizontal" onSubmit={handleSendMessage}>
                    <div className="form-group mb-3">
                      <label>Nomor WhatsApp</label>
                      <input
                        className="form-control"
                        type="text"
                        value={toPhone}
                        onChange={(event) => setToPhone(event.target.value)}
                        placeholder="6281234567890"
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Pesan</label>
                      <textarea
                        className="form-control comment"
                        rows={5}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        required
                      />
                    </div>
                    <button className="default-btn" type="submit">
                      Kirim Pesan
                      <span />
                    </button>
                  </form>
                  {sendStatus ? <p className="mt-20">{sendStatus}</p> : null}
                  <div className="mt-20">
                    <p>
                      Token API Baileys: <code>{BAILEYS_API_TOKEN ? "Disetel" : "Belum disetel"}</code>
                    </p>
                    <p>
                      Jika Baileys di-develop, jalankan <code>npm run whatsapp:baileys</code> di folder proyek.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </PageShell>
  );
};

export default WhatsAppPage;
