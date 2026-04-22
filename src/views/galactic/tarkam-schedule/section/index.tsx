import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "@/api";
import Swal from "sweetalert2";
import { PageHeader, VideoStreemButton } from "@/galactic/common";
import { buildTarkamDetailPath, galacticRoutes } from "@/galactic/data";
import { printQrisInvoice, prepareQrisPrintWindow, type QrisInvoicePayload } from "@/lib/qris";
import { useLiveUpdate } from "../../socket/SocketProvider";
import { useAuth } from "../../auth/AuthProvider";

type ApiEnvelope<T> = {
  data?: T;
};

type ScheduleTarkam = {
  id: number;
  title?: string;
  week?: string;
  status?: string;
  description?: string;
  transfer_info?: string;
  proof?: string;
  thumbnail?: string;
  image?: string;
  pool_price_m?: number;
  pool_price_f?: number;
  male_date?: string;
  male_time?: string;
  female_date?: string;
  female_time?: string;
  male_slot?: number;
  female_slot?: number;
  male_completed?: number;
  female_completed?: number;
  male_players_count?: number;
  female_players_count?: number;
  points_awarded?: number;
  mvp_m?: string;
  mvp_f?: string;
  location?: string;
  teams_count?: number;
  groups_count?: number;
  contests_count?: number;
  winners_count?: number;
  players_count?: number;
  streamings_count?: number;
};

type ScheduleStreaming = {
  id: number;
  streem?: string;
  url?: string;
  embed?: string;
  tarkam_fk?: number | string | null;
};

type GenderKey = "male" | "female";
const supportedPaymentMerchants = [
  { name: "OVO", src: "/assets/images/ovo.svg" },
  { name: "GoPay", src: "/assets/images/gopay.svg" },
  { name: "LinkAja", src: "/assets/images/link-aja.svg" },
  { name: "DANA", src: "/assets/images/dana.svg" },
  { name: "ShopeePay", src: "/assets/images/spp.svg" },
] as const;

const asList = <T,>(payload?: ApiEnvelope<T[]>): T[] =>
  Array.isArray(payload?.data) ? payload.data : [];

const formatDateLabel = (value?: string) => {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("id-ID").format(Number(value ?? 0));

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const normalizeId = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return NaN;
  }

  return Number(value);
};

const getGenderLabel = (gender: GenderKey) => (gender === "male" ? "Male" : "Female");

const getGenderTone = (gender: GenderKey) =>
  gender === "male"
    ? {
        border: "rgba(79, 172, 254, 0.35)",
        background: "linear-gradient(180deg, rgba(79, 172, 254, 0.18), rgba(7, 20, 47, 0.86))",
        accent: "#7fd3ff",
      }
    : {
        border: "rgba(255, 105, 180, 0.35)",
        background: "linear-gradient(180deg, rgba(255, 105, 180, 0.16), rgba(35, 7, 29, 0.88))",
        accent: "#ffb0d5",
      };

const getGenderValue = (tarkam: ScheduleTarkam, gender: GenderKey) => ({
  date: gender === "male" ? tarkam.male_date : tarkam.female_date,
  time: gender === "male" ? tarkam.male_time : tarkam.female_time,
  slot: gender === "male" ? tarkam.male_slot : tarkam.female_slot,
  completed: gender === "male" ? tarkam.male_completed : tarkam.female_completed,
  poolPrice: gender === "male" ? tarkam.pool_price_m : tarkam.pool_price_f,
  mvp: gender === "male" ? tarkam.mvp_m : tarkam.mvp_f,
});

const getGenderRemaining = (tarkam: ScheduleTarkam, gender: GenderKey) => {
  const slot = gender === "male" ? tarkam.male_slot : tarkam.female_slot;
  const players = gender === "male" ? tarkam.male_players_count : tarkam.female_players_count;
  const used = players !== undefined && players !== null
    ? players
    : gender === "male"
      ? tarkam.male_completed
      : tarkam.female_completed;

  return Math.max(0, Number(slot ?? 0) - Number(used ?? 0));
};

const getTarkamStreamingUrl = (tarkam: ScheduleTarkam, streamings: ScheduleStreaming[]) => {
  const stream = streamings.find((item) => normalizeId(item.tarkam_fk) === Number(tarkam.id));
  return stream?.streem?.trim() || stream?.embed?.trim() || stream?.url?.trim() || "";
};
const PaymentSupportPanel = ({
  title = "Support Pembayaran QRIS",
  note,
}: {
  title?: string;
  note?: string;
}) => (
  <div className="tarkam-payment-support">
    <div className="tarkam-payment-support__head">
      <strong>{title}</strong>
      <span>Bayar langsung dari e-wallet favorit Anda</span>
    </div>
    <div className="tarkam-payment-support__logos" aria-label="Merchant pembayaran yang didukung">
      {supportedPaymentMerchants.map((item) => (
        <div className="tarkam-payment-support__logo" key={item.name}>
          <img src={item.src} alt={item.name} loading="lazy" />
        </div>
      ))}
    </div>
    <p className="tarkam-payment-support__copy">
      {note || "Setelah QRIS dicetak, scan dengan OVO, GoPay, LinkAja, DANA, atau ShopeePay lalu tunggu konfirmasi otomatis dari sistem."}
    </p>
  </div>
);

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="tarkam-mini-stat">
    <div className="tarkam-mini-stat__label">{label}</div>
    <div className="tarkam-mini-stat__value">{value}</div>
    {hint ? <div className="tarkam-mini-stat__hint">{hint}</div> : null}
  </div>
);

const ScheduleGenderPanel = ({
  tarkam,
  gender,
}: {
  tarkam: ScheduleTarkam;
  gender: GenderKey;
}) => {
  const values = getGenderValue(tarkam, gender);
  const remaining = getGenderRemaining(tarkam, gender);
  const genderLabel = getGenderLabel(gender);
  const tone = getGenderTone(gender);

  return (
    <div
      className={`tarkam-gender-card ${gender === "male" ? "tarkam-gender-card--male" : "tarkam-gender-card--female"}`}
      style={{ borderColor: tone.border, background: tone.background }}
    >
      <div className="tarkam-gender-card__head">
        <div>
          <div
            className={`tarkam-gender-card__eyebrow ${gender === "male" ? "tarkam-gender-card__eyebrow--male" : "tarkam-gender-card__eyebrow--female"}`}
            style={{ color: tone.accent }}
          >
            {genderLabel}
          </div>
          <h4 className="tarkam-gender-card__title" style={{ margin: "4px 0 0", fontSize: "1.15rem" }}>
            {tarkam.title || `Tarkam Week ${tarkam.week || "?"}`}
          </h4>
        </div>
      </div>

      <div className="tarkam-meta-grid" style={{ marginBottom: "14px" }}>
        <StatCard label="Date" value={formatDateLabel(values.date)} />
        <StatCard label="Time" value={values.time || "TBA"} />
        <StatCard label="Slot" value={`${formatNumber(Number(values.slot ?? 0) - Number(remaining))} / ${formatNumber(values.slot)}`} />
        <StatCard label="Status" value={Number(values.completed ?? 0) > 0 ? "Completed" : "Open"} />
      </div>

      <div className="tarkam-meta-grid" style={{ marginBottom: "16px" }}>
        <StatCard label="Pool Price" value={formatCurrency(values.poolPrice)} />
        <StatCard label="MVP" value={values.mvp || "TBA"} />
      </div>
    </div>
  );
};

const ScheduleCard = ({
  tarkam,
  streamings,
}: {
  tarkam: ScheduleTarkam;
  streamings: ScheduleStreaming[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [printingQris, setPrintingQris] = useState(false);
  const [registering, setRegistering] = useState<GenderKey | null>(null);
  const streamUrl = getTarkamStreamingUrl(tarkam, streamings);
  const registrationClosed =
    Number(tarkam.male_completed ?? 0) !== 0 &&
    Number(tarkam.female_completed ?? 0) !== 0;

  const handlePrintQris = async () => {
    const authData = localStorage.getItem("tarkam_auth_user");
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !authData) {
      navigate("/signin", { state: { from: location }, replace: false });
      return;
    }

    const printWindow = prepareQrisPrintWindow();

    try {
      setPrintingQris(true);
      const response = await Api.post(`/payments/qris/tarkams/${tarkam.id}`, {});
      const payload = response.data?.data;
      const transaction = payload?.transaction;
      const invoice = payload?.invoice;

      if (!transaction || !invoice?.qris_content) {
        throw new Error("QRIS pendaftaran Tarkam belum berhasil dibuat.");
      }

      const printPayload: QrisInvoicePayload = {
        title: tarkam.title || `Pendaftaran Tarkam Week ${tarkam.week || "-"}`,
        description: "Scan QRIS ini untuk menyelesaikan biaya pendaftaran Tarkam. Sistem akan menyesuaikan kategori berdasarkan profil member yang sedang login dan memperbarui status pembayaran secara otomatis.",
        amount: Number(transaction.amount ?? 0),
        transactionCode: String(transaction.transaction_code ?? ""),
        payerName: transaction.payer_name ?? null,
        payerNickname: transaction.payer_nickname ?? null,
        qrisContent: String(invoice.qris_content),
        qrisInvoiceId: invoice.qris_invoiceid ?? null,
        requestDate: invoice.qris_request_date ?? null,
        expiresAt: invoice.expires_at ?? null,
      };

      await printQrisInvoice(printPayload, printWindow);

      void Swal.fire({
        icon: "success",
        title: "Pembayaran siap",
        text: "QRIS pembayaran berhasil dibuat. Silakan scan atau cetak untuk menyelesaikan biaya registrasi.",
        confirmButtonText: "Tutup",
      });
    } catch (error: unknown) {
      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error instanceof Error ? error.message : "Gagal membuat QRIS pendaftaran. Silakan coba lagi.");
      Swal.fire("Error", message, "error");
    } finally {
      setPrintingQris(false);
    }
  };

  const handleRegister = async (gender: GenderKey) => {
    const authData = localStorage.getItem("tarkam_auth_user");
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !authData) {
      navigate("/signin", { state: { from: location }, replace: false });
      return;
    }

    try {
      setRegistering(gender);
      const response = await Api.post(`/tarkams/${tarkam.id}/register`, { gender });

      if (response.data?.success) {
        void Swal.fire({
          icon: "success",
          title: "Pendaftaran berhasil",
          text: `Kategori ${getGenderLabel(gender)} berhasil didaftarkan. Lanjutkan ke tombol Bayar Sekarang untuk menyelesaikan biaya registrasi.`,
          confirmButtonText: "Tutup",
        });
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error instanceof Error ? error.message : "Gagal melakukan pendaftaran Tarkam.");
      void Swal.fire({
        icon: "error",
        title: "Pendaftaran gagal",
        text: message,
        confirmButtonText: "Tutup",
      });
    } finally {
      setRegistering(null);
    }
  };

  return (
    <article id={`tarkam-${tarkam.id}`} className="galactic-hover-card tarkam-schedule-card">
      <div className="tarkam-schedule-card__content">
        <div className="tarkam-schedule-card__headline">
          <div>
            <div className="tarkam-eyebrow">Tarkam Week {tarkam.week || "-"}</div>
            <h3 className="tarkam-title">{tarkam.title || "Tarkam"}</h3>
          </div>

          <div className="tarkam-badge-row">
            <span className="tarkam-badge">{tarkam.status || "Upcoming"}</span>
            {tarkam.location ? (
              <span className="tarkam-badge tarkam-badge--soft">{tarkam.location}</span>
            ) : null}
          </div>

          {streamUrl ? (
            <VideoStreemButton
              href={streamUrl}
              label="Watch Stream"
              normalizeFacebook
            />
          ) : null}

          <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.74)", lineHeight: 1.8 }}>
            {tarkam.description || "Rangkuman jadwal Tarkam akan tampil di sini, termasuk sesi dan pembagian bracket berdasarkan gender."}
          </p>

          <div className="tarkam-kpi-grid">
            <StatCard label="Teams" value={formatNumber(tarkam.teams_count)} />
            <StatCard label="Groups" value={formatNumber(tarkam.groups_count)} />
            <StatCard label="Contests" value={formatNumber(tarkam.contests_count)} />
            <StatCard label="Players" value={formatNumber(tarkam.players_count)} />
          </div>

          <div className="tarkam-card-grid" style={{ marginTop: "22px" }}>
            <ScheduleGenderPanel tarkam={tarkam} gender="male" />
            <ScheduleGenderPanel tarkam={tarkam} gender="female" />
          </div>

          {tarkam.points_awarded !== undefined ? (
            <div style={{ marginTop: "14px", color: "rgba(255,255,255,0.62)", fontSize: "0.95rem" }}>
              Poin dibagikan: <strong style={{ color: "#fff" }}>{formatNumber(tarkam.points_awarded)}</strong>
            </div>
          ) : null}

          {(tarkam.mvp_m || tarkam.mvp_f) ? (
            <div style={{ marginTop: "14px", color: "rgba(255,255,255,0.62)", fontSize: "0.95rem" }}>
              MVP: {tarkam.mvp_m && <strong style={{ color: "#fff" }}>Male: {tarkam.mvp_m}</strong>}
              {tarkam.mvp_m && tarkam.mvp_f && " | "}
              {tarkam.mvp_f && <strong style={{ color: "#fff" }}>Female: {tarkam.mvp_f}</strong>}
            </div>
          ) : null}

          <div style={{ marginTop: "18px" }}>
            {/* <PaymentSupportPanel note={tarkam.transfer_info || undefined} /> */}
            <PaymentSupportPanel note="" />
          </div>

          <div className="tarkam-action-row" style={{ marginTop: "22px", alignItems: "center", gap: "12px" }}>
            <Link className="default-btn" to={buildTarkamDetailPath(tarkam.id)}>
              Lihat Detail
            </Link>
            {tarkam.proof ? (
              <a
                className="default-btn"
                href={`https://wa.me/${tarkam.proof}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "#ddd" }}
              >
                Proof
              </a>
            ) : null}

            <button
              onClick={handlePrintQris}
              disabled={printingQris || authLoading || registrationClosed}
              className="default-btn"
              style={{
                background: "linear-gradient(135deg, rgba(17, 203, 126, 0.96), rgba(10, 160, 112, 0.88))",
                border: "1px solid rgba(17, 203, 126, 0.45)",
              }}
            >
              {registrationClosed
                ? "Pendaftaran Ditutup"
                : printingQris
                  ? "Menyiapkan QRIS..."
                  : !isAuthenticated
                    ? "Bayar"
                    : "Bayar Sekarang"}
              <span />
            </button>
            <span className="tarkam-pill tarkam-pill--auto-check">
              Auto check tiap 1 menit
            </span>
            {Number(tarkam.male_completed ?? 0) === 0 ? (
              <button
                onClick={() => handleRegister("male")}
                disabled={registering !== null || authLoading}
                className="default-btn"
                style={{
                  background: "rgba(79, 172, 254, 0.15)",
                  border: "1px solid rgba(79, 172, 254, 0.4)",
                  color: "#c7ecff",
                }}
              >
                {registering === "male"
                  ? "Memproses Male..."
                  : !isAuthenticated
                    ? "Daftar Male"
                    : "Daftar Male"}
                <span />
              </button>
            ) : (
              <button
                disabled
                className="default-btn"
                style={{
                  background: "rgba(79, 172, 254, 0.08)",
                  border: "1px solid rgba(79, 172, 254, 0.18)",
                  color: "rgba(199, 236, 255, 0.58)",
                }}
              >
                Pendaftaran Male Ditutup
              </button>
            )}
            {Number(tarkam.female_completed ?? 0) === 0 ? (
              <button
                onClick={() => handleRegister("female")}
                disabled={registering !== null || authLoading}
                className="default-btn"
                style={{
                  background: "rgba(255, 105, 180, 0.15)",
                  border: "1px solid rgba(255, 105, 180, 0.4)",
                  color: "#ffd2e9",
                }}
              >
                {registering === "female"
                  ? "Memproses Female..."
                  : !isAuthenticated
                    ? "Daftar Female"
                    : "Daftar Female"}
                <span />
              </button>
            ) : (
              <button
                disabled
                className="default-btn"
                style={{
                  background: "rgba(255, 105, 180, 0.08)",
                  border: "1px solid rgba(255, 105, 180, 0.18)",
                  color: "rgba(255, 210, 233, 0.58)",
                }}
              >
                Pendaftaran Female Ditutup
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const TarkamScheduleContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [tarkams, setTarkams] = useState<ScheduleTarkam[]>([]);
  const [streamings, setStreamings] = useState<ScheduleStreaming[]>([]);
  const hasLoadedRef = useRef(false);
  const liveKey = useLiveUpdate(
    ["tarkams", "teams", "players", "groups", "contests", "winners", "streamings", "sessions", "penyawers"],
    { fallbackIntervalMs: 30000 },
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hasLoadedRef.current) {
        setLoading(true);
      }
      setError(null);

      const [tarkamsResult, streamingsResult] = await Promise.allSettled([
        Api.get<ApiEnvelope<ScheduleTarkam[]>>("/tarkams"),
        Api.get<ApiEnvelope<ScheduleStreaming[]>>("/streamings"),
      ]);

      if (cancelled) {
        return;
      }

      if (tarkamsResult.status === "fulfilled") {
        setTarkams(asList(tarkamsResult.value.data));
      } else {
        setTarkams([]);
        setError("Gagal memuat jadwal Tarkam.");
      }

      if (streamingsResult.status === "fulfilled") {
        setStreamings(asList(streamingsResult.value.data));
      } else {
        setStreamings([]);
      }

      hasLoadedRef.current = true;
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [liveKey]);

  const orderedTarkams = useMemo(
    () => [...tarkams].sort((left, right) => Number(right.id) - Number(left.id)),
    [tarkams],
  );
  const visibleItems = orderedTarkams.slice(0, visibleCount);
  const hasMore = visibleCount < orderedTarkams.length;

  return (
    <>
      <PageHeader
        eyebrow="Tarkam Schedule"
        title="Semua Info Turnamen Tarkam"
        description="Akses informasi komprehensif melalui kartu yang interaktif. Setiap panel menyajikan data kategori <code>(Male/Female)</code>, sisa slot tim, serta pembagian sesi secara real-time."
      />

      <section className="latest-matches padding-top tarkam-section">
        <div className="container">
          {loading ? (
            <div className="tarkam-empty-state">
              <h3 style={{ marginBottom: "12px" }}>Memuat jadwal Tarkam...</h3>
              <p>Menarik data dari endpoint publik yang lebih ringan.</p>
            </div>
          ) : error ? (
            <div className="tarkam-empty-state">
              <h3 style={{ marginBottom: "12px" }}>{error}</h3>
              <p>Silakan coba beberapa saat lagi atau kembali ke beranda.</p>
              <Link className="default-btn" to={galacticRoutes.home}>
                Kembali ke Beranda
              </Link>
            </div>
          ) : visibleItems.length ? (
            <>
              {visibleItems.map((tarkam) => (
                <ScheduleCard key={tarkam.id} tarkam={tarkam} streamings={streamings} />
              ))}
              {hasMore ? (
                <div className="text-center mt-50">
                  <button
                    className="default-btn"
                    type="button"
                    onClick={() => setVisibleCount((current) => Math.min(current + 3, orderedTarkams.length))}
                  >
                    Muat Lebih Banyak
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="tarkam-empty-state">
              <h3 style={{ marginBottom: "12px" }}>Belum ada jadwal Tarkam</h3>
              <p>Endpoint API belum mengembalikan data apa pun untuk ditampilkan.</p>
              <Link className="default-btn" to={galacticRoutes.home}>
                Kembali ke Beranda
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export { TarkamScheduleContent };
