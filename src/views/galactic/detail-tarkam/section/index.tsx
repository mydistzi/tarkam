import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "@/api";
import Swal from "sweetalert2";
import { DisqusThread, PageHeader, VideoStreemButton } from "@/galactic/common";
import {
  buildPlayerDetailPath,
  buildTeamDetailPath,
  galacticRoutes,
} from "@/galactic/data";
import { printQrisInvoice, prepareQrisPrintWindow, type QrisInvoicePayload } from "@/lib/qris";
import {
  placeholderPlayer,
  placeholderTeam,
  placeholderVideoThumb,
} from "@/galactic/placeholders";
import { useAuth } from "../../auth/AuthProvider";
import { useLiveUpdate } from "../../socket/SocketProvider";

type GenderFilter = "all" | "male" | "female";
type GenderKey = Exclude<GenderFilter, "all">;
type DetailTab =
  | "overview"
  | "gender"
  | "sessions"
  | "timelines"
  | "competition";

type ApiEnvelope<T> = {
  data?: T;
};
const supportedPaymentMerchants = [
  { name: "OVO", src: "/assets/images/ovo.svg" },
  { name: "GoPay", src: "/assets/images/gopay.svg" },
  { name: "LinkAja", src: "/assets/images/link-aja.svg" },
  { name: "DANA", src: "/assets/images/dana.svg" },
  { name: "ShopeePay", src: "/assets/images/spp.svg" },
] as const;
const DEFAULT_TARKAM_REGISTRATION_FEE_MALE = 20000;
const DEFAULT_TARKAM_REGISTRATION_FEE_FEMALE = 20000;

type ApiClub = {
  id?: number | string;
  name?: string;
  logo?: string;
};

type ApiMember = {
  id?: number | string;
  username?: string;
  nickname?: string;
  slug?: string;
  gender?: string;
  city?: string;
  tier?: string;
  picture_url?: string;
  points?: number | string;
  club?: ApiClub | null;
};

type ApiGroup = {
  id?: number | string;
  name?: string;
  gender?: string;
  teams_count?: number;
};

type ApiTeam = {
  id?: number | string;
  name?: string;
  logo?: string;
  gender?: string;
  date?: string;
  time?: string;
  member1?: ApiMember | null;
  member2?: ApiMember | null;
  member3?: ApiMember | null;
  group?: ApiGroup | null;
};

type ApiPlayer = {
  id?: number | string;
  score?: number | string;
  paid?: boolean | number | string;
  member?: ApiMember | null;
};

type ApiSession = {
  id?: number | string;
  sesi?: number | string;
  point?: number | string;
  participant?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ApiTarkamSession = {
  id?: number | string;
  session_fk?: number | string | null;
  created_at?: string;
  updated_at?: string;
  session?: ApiSession | null;
};

type ApiTimeline = {
  id?: number | string;
  description?: string | null;
  member?: ApiMember | null;
  club?: ApiClub | null;
  session?: ApiSession | null;
  created_at?: string;
  updated_at?: string;
};

type ApiTarkamTimeline = {
  id?: number | string;
  timeline_fk?: number | string | null;
  session_fk?: number | string | null;
  created_at?: string;
  updated_at?: string;
  timeline?: ApiTimeline | null;
  session?: ApiSession | null;
};

type ApiContest = {
  id?: number | string;
  team1?: ApiTeam | null;
  team2?: ApiTeam | null;
  winnerTeam?: ApiTeam | null;
  score?: number | string | null;
  gender?: string;
  created_at?: string;
};

type ApiWinner = {
  id?: number | string;
  nickname?: string;
  prize?: string;
  gender?: string;
  rank?: number | string | null;
  team?: ApiTeam | null;
  created_at?: string;
};

type ApiStreaming = {
  id?: number | string;
  title?: string;
  streem?: string;
  url?: string;
  embed?: string;
  thumbnail?: string;
  description?: string;
};

type ApiTarkamDetail = {
  id?: number | string;
  title?: string;
  week?: string;
  status?: string;
  description?: string;
  transfer_info?: string;
  proof?: string;
  thumbnail?: string;
  image?: string;
  pool_price_m?: number | string;
  pool_price_f?: number | string;
  male_date?: string;
  male_time?: string;
  female_date?: string;
  female_time?: string;
  male_slot?: number | string;
  female_slot?: number | string;
  male_completed?: number | string;
  female_completed?: number | string;
  points_awarded?: number | string;
  mvp_m?: string;
  mvp_f?: string;
  location?: string;
  teams_count?: number;
  players_count?: number;
  sessions_count?: number;
  timelines_count?: number;
  groups_count?: number;
  contests_count?: number;
  winners_count?: number;
  streamings_count?: number;
  male_players_count?: number;
  female_players_count?: number;
  created_at?: string;
  updated_at?: string;
};

type TarkamBundle = {
  detail: ApiTarkamDetail | null;
  teams: ApiTeam[];
  players: ApiPlayer[];
  groups: ApiGroup[];
  contests: ApiContest[];
  winners: ApiWinner[];
  streamings: ApiStreaming[];
  sessions: ApiTarkamSession[];
  timelines: ApiTarkamTimeline[];
};

const emptyBundle: TarkamBundle = {
  detail: null,
  teams: [],
  players: [],
  groups: [],
  contests: [],
  winners: [],
  streamings: [],
  sessions: [],
  timelines: [],
};

const unwrapItem = <T,>(payload?: ApiEnvelope<T> | T): T | null =>
  ((payload as ApiEnvelope<T> | undefined)?.data ??
    payload ??
    null) as T | null;

const unwrapList = <T,>(payload?: ApiEnvelope<T[]>): T[] =>
  Array.isArray(payload?.data) ? payload.data : [];

const hasValue = (value?: string | number | null) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const toNumber = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatDate = (value?: string | null) => {
  if (!value) return "TBA";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeZone: "Asia/Jakarta",
      }).format(date);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(date);
};

const formatNumber = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return new Intl.NumberFormat("id-ID").format(numeric);
};

const formatCurrency = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return "Rp0";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const getRegistrationFee = (gender: GenderKey) =>
  gender === "female"
    ? DEFAULT_TARKAM_REGISTRATION_FEE_FEMALE
    : DEFAULT_TARKAM_REGISTRATION_FEE_MALE;

const statusLabel = (value?: string | null) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "active") return "Aktif";
  if (normalized === "completed" || normalized === "complete") return "Selesai";
  if (normalized === "pending") return "Menunggu";
  return value || "Belum ada status";
};

const statusClass = (value?: string | null) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "active") return "is-active";
  if (normalized === "completed" || normalized === "complete")
    return "is-complete";
  if (normalized === "pending") return "is-pending";
  return "is-idle";
};

const genderLabel = (gender: GenderFilter) => {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  return "Semua";
};

const matchGender = (value: string | undefined | null, filter: GenderFilter) =>
  filter === "all" || String(value || "").toLowerCase() === filter;

const getTeamMembers = (team?: ApiTeam | null) =>
  [team?.member1, team?.member2, team?.member3].filter(
    (member): member is ApiMember => Boolean(member),
  );

const formatParticipantSnapshot = (value?: string | null) => {
  if (!value?.trim()) {
    return "Belum ada snapshot peserta yang tersimpan untuk sesi ini.";
  }

  const compact = value
    .split("|")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" / ");

  return compact || value;
};

// const normalizeProofHref = (value?: string | null) => {
//   const normalized = value?.trim();
//   if (!normalized) {
//     return undefined;
//   }

//   if (/^https?:\/\//i.test(normalized)) {
//     return normalized;
//   }

//   const phoneNumber = normalized.replace(/[^\d]/g, "");
//   if (phoneNumber) {
//     return `https://wa.me/${phoneNumber}`;
//   }

//   return `https://${normalized.replace(/^\/+/, "")}`;
// };

const resolveImage = (...values: Array<string | null | undefined>) =>
  values.map((value) => value?.trim()).find(Boolean);

const getGenderSnapshot = (detail: ApiTarkamDetail, gender: GenderKey) => {
  const slot =
    gender === "male"
      ? toNumber(detail.male_slot)
      : toNumber(detail.female_slot);
  const players =
    gender === "male"
      ? toNumber(detail.male_players_count)
      : toNumber(detail.female_players_count);
  const completed =
    gender === "male"
      ? toNumber(detail.male_completed)
      : toNumber(detail.female_completed);
  const used = Math.max(players, completed);

  return {
    title: gender === "male" ? "Bracket Male" : "Bracket Female",
    date: gender === "male" ? detail.male_date : detail.female_date,
    time: gender === "male" ? detail.male_time : detail.female_time,
    slot,
    players,
    completed,
    remaining: Math.max(0, slot - used),
    poolPrice: gender === "male" ? detail.pool_price_m : detail.pool_price_f,
    registrationFee: getRegistrationFee(gender),
    mvp: gender === "male" ? detail.mvp_m : detail.mvp_f,
  };
};

const getStreamUrl = (stream?: ApiStreaming | null) =>
  stream?.streem?.trim() || stream?.embed?.trim() || stream?.url?.trim() || "";
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
      {note || "Cetak QRIS lalu scan dari OVO, GoPay, LinkAja, DANA, atau ShopeePay. Status pembayaran akan diperbarui otomatis setelah sukses."}
    </p>
  </div>
);

const MiniStat = ({
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

const SectionHeading = ({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary: string;
}) => (
  <div className="tarkam-section-heading">
    <div>
      <span className="tarkam-section-heading__eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
    </div>
    <p>{summary}</p>
  </div>
);

const InlineEmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="tarkam-empty-block">
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const fetchList = async <T,>(path: string) => {
  const response = await Api.get<ApiEnvelope<T[]>>(path);
  return unwrapList(response.data);
};

const fetchItem = async <T,>(path: string) => {
  const response = await Api.get<ApiEnvelope<T>>(path);
  return unwrapItem(response.data);
};

const TarkamDetailsContent = ({ tarkamId }: { tarkamId?: number }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bundle, setBundle] = useState<TarkamBundle>(emptyBundle);
  const [loading, setLoading] = useState(Boolean(tarkamId));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [activeGender, setActiveGender] = useState<GenderFilter>("all");
  const [printingQris, setPrintingQris] = useState(false);
  const [registering, setRegistering] = useState<GenderKey | null>(null);
  const previousTarkamIdRef = useRef<number | null>(null);
  const liveKey = useLiveUpdate(
    ["tarkams", "teams", "players", "groups", "contests", "winners", "streamings", "sessions", "timelines", "penyawers"],
    { fallbackIntervalMs: 30000 },
  );

  useEffect(() => {
    if (!tarkamId) {
      setError("ID Tarkam tidak valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const shouldShowLoading = previousTarkamIdRef.current !== tarkamId;
      if (shouldShowLoading) {
        setLoading(true);
      }
      setError(null);

      const [
        detailResult,
        teamsResult,
        playersResult,
        groupsResult,
        contestsResult,
        winnersResult,
        streamingsResult,
        sessionsResult,
        timelinesResult,
      ] = await Promise.allSettled([
        fetchItem<ApiTarkamDetail>(`/tarkams/${tarkamId}`),
        fetchList<ApiTeam>(`/tarkams/${tarkamId}/teams`),
        fetchList<ApiPlayer>(`/tarkams/${tarkamId}/players`),
        fetchList<ApiGroup>(`/tarkams/${tarkamId}/groups`),
        fetchList<ApiContest>(`/tarkams/${tarkamId}/contests`),
        fetchList<ApiWinner>(`/tarkams/${tarkamId}/winners`),
        fetchList<ApiStreaming>(`/tarkams/${tarkamId}/streamings`),
        fetchList<ApiTarkamSession>(`/tarkams/${tarkamId}/sessions`),
        fetchList<ApiTarkamTimeline>(`/tarkams/${tarkamId}/timelines`),
      ]);

      if (cancelled) {
        return;
      }

      if (detailResult.status !== "fulfilled" || !detailResult.value) {
        setBundle(emptyBundle);
        setError("Gagal memuat detail Tarkam.");
        setLoading(false);
        return;
      }

      previousTarkamIdRef.current = tarkamId;
      setBundle({
        detail: detailResult.value,
        teams: teamsResult.status === "fulfilled" ? teamsResult.value : [],
        players:
          playersResult.status === "fulfilled" ? playersResult.value : [],
        groups: groupsResult.status === "fulfilled" ? groupsResult.value : [],
        contests:
          contestsResult.status === "fulfilled" ? contestsResult.value : [],
        winners:
          winnersResult.status === "fulfilled" ? winnersResult.value : [],
        streamings:
          streamingsResult.status === "fulfilled" ? streamingsResult.value : [],
        sessions:
          sessionsResult.status === "fulfilled" ? sessionsResult.value : [],
        timelines:
          timelinesResult.status === "fulfilled" ? timelinesResult.value : [],
      });
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [tarkamId, liveKey]);

  const detail = bundle.detail;

  const filteredTeams = useMemo(
    () => bundle.teams.filter((team) => matchGender(team.gender, activeGender)),
    [bundle.teams, activeGender],
  );

  const filteredPlayers = useMemo(
    () =>
      bundle.players.filter((player) =>
        matchGender(player.member?.gender, activeGender),
      ),
    [bundle.players, activeGender],
  );

  const filteredGroups = useMemo(
    () =>
      bundle.groups.filter((group) => matchGender(group.gender, activeGender)),
    [bundle.groups, activeGender],
  );

  const filteredContests = useMemo(
    () =>
      bundle.contests.filter((contest) =>
        matchGender(contest.gender, activeGender),
      ),
    [bundle.contests, activeGender],
  );

  const filteredWinners = useMemo(
    () =>
      bundle.winners.filter((winner) =>
        matchGender(winner.gender, activeGender),
      ),
    [bundle.winners, activeGender],
  );

//   const title = detail?.title
//     ? `${detail.title} (Week ${detail.week || "?"})`
//     : `Tarkam Week ${detail?.week || tarkamId || "?"}`;

  if (!tarkamId) {
    return (
      <section className="matches-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-empty-state">
            <h2>Tarkam tidak ditemukan</h2>
            <p>ID Tarkam yang dipilih tidak valid atau tidak tersedia.</p>
            <Link className="default-btn" to={galacticRoutes.tarkamSchedule}>
              Kembali ke Jadwal Tarkam
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="matches-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-empty-state">
            <h2>Memuat detail Tarkam...</h2>
            <p>
              Menarik overview dan relasi spesifik dari route nested API
              {tarkamId}/*`.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="matches-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-empty-state">
            <h2>{error || "Tarkam tidak ditemukan"}</h2>
            <p>
              Data detail tidak dapat dimuat. Silakan kembali ke jadwal Tarkam.
            </p>
            <Link className="default-btn" to={galacticRoutes.tarkamSchedule}>
              Kembali ke Jadwal Tarkam
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const pageDescription =
    detail.description ||
    "Lihat detail jadwal, roster, sesi, timeline, pertandingan, dan streaming untuk Tarkam ini.";
  // const proofHref = normalizeProofHref(detail.proof);
  const heroImage =
    resolveImage(detail.image, detail.thumbnail, placeholderTeam) ||
    placeholderTeam;
  const updatedLabel = formatDateTime(detail.updated_at || detail.created_at);
  const totalTeams = formatNumber(detail.teams_count ?? bundle.teams.length);
  const totalPlayers = formatNumber(
    detail.players_count ?? bundle.players.length,
  );
  const totalGroups = formatNumber(detail.groups_count ?? bundle.groups.length);
  const totalContests = formatNumber(
    detail.contests_count ?? bundle.contests.length,
  );
  const totalWinners = formatNumber(
    detail.winners_count ?? bundle.winners.length,
  );
  const totalSessions = formatNumber(
    detail.sessions_count ?? bundle.sessions.length,
  );
  const totalTimelines = formatNumber(
    detail.timelines_count ?? bundle.timelines.length,
  );
  const totalStreams = formatNumber(
    detail.streamings_count ?? bundle.streamings.length,
  );
  const highlightStats = [
    {
      label: "Teams",
      value: totalTeams,
      hint: `${formatNumber(filteredTeams.length)} tampil di filter aktif`,
    },
    {
      label: "Players",
      value: totalPlayers,
      hint: `${formatNumber(filteredPlayers.length)} player sinkron`,
    },
    {
      label: "Sessions",
      value: totalSessions,
      hint: `${updatedLabel} update terakhir`,
    },
    {
      label: "Streams",
      value: totalStreams,
      hint: `${formatNumber(bundle.streamings.length)} kanal live`,
    },
  ];
  const secondaryStats = [
    { label: "Groups", value: totalGroups },
    { label: "Contests", value: totalContests },
    { label: "Winners", value: totalWinners },
    { label: "Timelines", value: totalTimelines },
  ];
  const maleSnapshot = getGenderSnapshot(detail, "male");
  const femaleSnapshot = getGenderSnapshot(detail, "female");
  const registrationClosed =
    Number(detail.male_completed ?? 0) !== 0 &&
    Number(detail.female_completed ?? 0) !== 0;
  const currentMvpText =
    activeGender === "male"
      ? detail.mvp_m || "Belum ada MVP "
      : activeGender === "female"
      ? detail.mvp_f || "Belum ada MVP"
      : `${detail.mvp_m ? `Male: ${detail.mvp_m} ` : "Male: TBA "}${
          detail.mvp_m && detail.mvp_f ? " | " : ""
        }${detail.mvp_f ? `Female: ${detail.mvp_f}` : "Female: TBA"}`;

  const tabItems: Array<{ key: DetailTab; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "gender", label: "Divisi" },
    { key: "sessions", label: "Sessions" },
    { key: "timelines", label: "Timelines" },
    { key: "competition", label: "Competition" },
  ];

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
      const response = await Api.post(`/payments/qris/tarkams/${detail.id || tarkamId}`, {});
      const payload = response.data?.data;
      const transaction = payload?.transaction;
      const invoice = payload?.invoice;

      if (!transaction || !invoice?.qris_content) {
        throw new Error("QRIS pendaftaran Tarkam belum berhasil dibuat.");
      }

      const printPayload: QrisInvoicePayload = {
        title: detail.title || `Pendaftaran Tarkam Week ${detail.week || "-"}`,
        description: "Gunakan QRIS ini untuk membayar biaya pendaftaran Tarkam. Sistem akan menyesuaikan kategori berdasarkan profil member yang sedang login dan memperbarui status pembayaran otomatis setelah sukses.",
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
        (error instanceof Error ? error.message : "Gagal membuat QRIS pendaftaran.");
      void Swal.fire({
        icon: "error",
        title: "Pembayaran gagal dibuat",
        text: message,
        confirmButtonText: "Tutup",
      });
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
      const response = await Api.post(`/tarkams/${detail.id || tarkamId}/register`, { gender });

      if (response.data?.success) {
        void Swal.fire({
          icon: "success",
          title: "Pendaftaran berhasil",
          text: `Kategori ${genderLabel(gender)} berhasil didaftarkan. Lanjutkan ke tombol Bayar Sekarang untuk menyelesaikan biaya registrasi.`,
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
    <>
      <PageHeader
        eyebrow="Detail Tarkam"
        title="Informasi lengkap terkait Tarkam ini."
        description="Lihat detail jadwal, roster,sesi, timeline,pertandingan, dan streaming untuk Tarkam ini."
      />

      <section className="team-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-hero-grid">
            <article
              className="tarkam-hero-media"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(7, 11, 25, 0.18), rgba(7, 11, 25, 0.92)), url(${heroImage})`,
              }}
            >
              <div className="tarkam-hero-media__content">
                <div className="tarkam-badge-row">
                  <span className="tarkam-badge">
                    Week {detail.week || "-"}
                  </span>
                  <span className={`tarkam-pill ${statusClass(detail.status)}`}>
                    {statusLabel(detail.status)}
                  </span>
                </div>

                <div>
                  <div className="tarkam-eyebrow">Snapshot Event</div>
                  <h3>{detail.title || "Tarkam"}</h3>
                  <p>{detail.location || "Lokasi akan diumumkan kemudian."}</p>
                </div>

                <div className="tarkam-hero-media__footer">
                  <div>
                    <span>Total Hadiah</span>
                    <strong>
                      {formatCurrency(
                        toNumber(detail.pool_price_m) +
                          toNumber(detail.pool_price_f),
                      )}
                    </strong>
                  </div>
                  <div>
                    <span>Poin Dibagikan</span>
                    <strong>{formatNumber(detail.points_awarded)}</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="galactic-hover-card tarkam-panel">
              <Link
                className="tarkam-back-link"
                to={galacticRoutes.tarkamSchedule}
              >
                Kembali ke jadwal Tarkam
              </Link>

              <div className="tarkam-title-line">
                <div>
                  <div className="tarkam-eyebrow">
                    Tarkam Week {detail.week || "-"}
                  </div>
                  <h3 className="tarkam-title">{detail.title || "Tarkam"}</h3>
                </div>

                <div className="tarkam-badge-row">
                  {detail.location ? (
                    <span className="tarkam-badge tarkam-badge--soft">
                      {detail.location}
                    </span>
                  ) : null}
                  <span className={`tarkam-pill ${statusClass(detail.status)}`}>
                    {statusLabel(detail.status)}
                  </span>
                </div>
              </div>

              <p className="tarkam-lead">{pageDescription}</p>

              <div className="tarkam-kpi-grid">
                {highlightStats.map((item) => (
                  <MiniStat
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    hint={item.hint}
                  />
                ))}
              </div>

              <div className="tarkam-meta-grid">
                {secondaryStats.map((item) => (
                  <MiniStat
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>

              <div className="tarkam-inline-meta">
                <div className="tarkam-inline-meta__item">
                  <span>Pembayaran</span>
                  <strong>Interactive QRIS</strong>
                </div>
                <div className="tarkam-inline-meta__item">
                  <span>Merchant Support</span>
                  <strong>OVO, GoPay, LinkAja, DANA, ShopeePay</strong>
                </div>
                {detail.mvp_m && (
                  <div className="tarkam-inline-meta__item">
                    <span>MVP Male</span>
                    <strong>{detail.mvp_m}</strong>
                  </div>
                )}
                {detail.mvp_f && (
                  <div className="tarkam-inline-meta__item">
                    <span>MVP Female</span>
                    <strong>{detail.mvp_f}</strong>
                  </div>
                )}
                <div className="tarkam-inline-meta__item">
                  <span>Updated</span>
                  <strong>{updatedLabel}</strong>
                </div>
              </div>

              <div className="tarkam-button-row">
                <button
                  className="default-btn"
                  type="button"
                  onClick={() => setActiveTab("competition")}
                >
                  Lihat competition
                </button>
                {Number(detail.male_completed ?? 0) === 0 ? (
                  <button
                    className="default-btn"
                    type="button"
                    onClick={() => handleRegister("male")}
                    disabled={registering !== null || authLoading}
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
                  </button>
                ) : (
                  ""
                  // <button
                  //   className="default-btn"
                  //   type="button"
                  //   disabled
                  //   style={{
                  //     background: "rgba(79, 172, 254, 0.08)",
                  //     border: "1px solid rgba(79, 172, 254, 0.18)",
                  //     color: "rgba(199, 236, 255, 0.58)",
                  //   }}
                  // >
                  //   Pendaftaran Male Ditutup
                  // </button>
                )}
                {Number(detail.female_completed ?? 0) === 0 ? (
                  <button
                    className="default-btn"
                    type="button"
                    onClick={() => handleRegister("female")}
                    disabled={registering !== null || authLoading}
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
                  </button>
                ) : (
                  ""
                  // <button
                  //   className="default-btn"
                  //   type="button"
                  //   disabled
                  //   style={{
                  //     background: "rgba(255, 105, 180, 0.08)",
                  //     border: "1px solid rgba(255, 105, 180, 0.18)",
                  //     color: "rgba(255, 210, 233, 0.58)",
                  //   }}
                  // >
                  //   Pendaftaran Female Ditutup
                  // </button>
                )}
                {/* {proofHref ? (
                  <a
                    className="default-btn tarkam-button--ghost"
                    href={proofHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#ddd" }}
                  >
                    Hubungi Pembayaran
                  </a>
                ) : null} */}
                <button
                  className="default-btn tarkam-button--ghost"
                  type="button"
                  onClick={handlePrintQris}
                  disabled={printingQris || authLoading || registrationClosed}
                  style={{ color: "#ddd" }}
                  // style={{
                  //   background: "linear-gradient(135deg, rgba(17, 203, 126, 0.96), rgba(10, 160, 112, 0.88))",
                  //   border: "1px solid rgba(17, 203, 126, 0.45)",
                  // }}
                >
                  {registrationClosed
                    ? "Pendaftaran Ditutup"
                    : printingQris
                      ? "Menyiapkan QRIS..."
                      : !isAuthenticated
                        ? "Bayar"
                        : "Bayar Sekarang"}
                </button>
                {/* <span className="tarkam-pill tarkam-pill--auto-check">
                  Auto check tiap 1 menit
                </span> */}
              </div>
            </article>
          </div>

          <div className="galactic-hover-card tarkam-panel tarkam-panel--content">
            <div
              className="tarkam-tab-nav"
              role="tablist"
              aria-label="Navigasi detail Tarkam"
            >
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  className={`tarkam-segment-btn${activeTab === tab.key ? " is-active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" ? (
              <div className="tarkam-tab-pane">
                <SectionHeading
                  eyebrow="Ringkasan"
                  title="Gambaran event dalam satu panel"
                  summary=""
                />

                <div className="tarkam-card-grid">
                  {(
                    [
                      ["male", maleSnapshot],
                      ["female", femaleSnapshot],
                    ] as const
                  ).map(([gender, snapshot]) => (
                    <article
                      className={`tarkam-gender-card ${gender === "male" ? "tarkam-gender-card--male" : "tarkam-gender-card--female"}`}
                      key={gender}
                    >
                      <div className="tarkam-gender-card__head">
                        <div>
                          <div
                            className={`tarkam-gender-card__eyebrow ${gender === "male" ? "tarkam-gender-card__eyebrow--male" : "tarkam-gender-card__eyebrow--female"}`}
                          >
                            {snapshot.title}
                          </div>
                          <h3 className="tarkam-gender-card__title">
                            {detail.title || "Tarkam"}
                          </h3>
                        </div>
                        <span className="tarkam-badge">
                          {formatNumber(snapshot.slot - snapshot.remaining)} /{" "}
                          {formatNumber(snapshot.slot)} slot
                        </span>
                      </div>

                      <div className="tarkam-meta-grid">
                        <MiniStat
                          label="Date"
                          value={formatDate(snapshot.date)}
                        />
                        <MiniStat label="Time" value={snapshot.time || "TBA"} />
                        <MiniStat
                          label="Sisa Slot"
                          value={formatNumber(snapshot.remaining)}
                        />
                        <MiniStat
                          label="Players"
                          value={formatNumber(snapshot.players)}
                        />
                        <MiniStat
                          label="Completed"
                          value={Number(formatNumber(snapshot.completed ?? 0)) > 0 ? "Yes" : "No"}
                        />
                        <MiniStat
                          label="Pool"
                          value={formatCurrency(snapshot.poolPrice)}
                        />
                        <MiniStat
                          label="Biaya Daftar"
                          value={formatCurrency(snapshot.registrationFee)}
                        />
                        <MiniStat label="MVP" value={snapshot.mvp || "-"} />
                        <MiniStat
                          label="Status"
                          value={statusLabel(detail.status)}
                        />
                      </div>
                    </article>
                  ))}
                </div>

                <div className="tarkam-info-grid">
                  <article className="galactic-hover-card tarkam-data-card">
                    <SectionHeading
                      eyebrow="Operasional"
                      title="Informasi pembayaran"
                      summary=""
                    />
                    {/* <PaymentSupportPanel note={detail.transfer_info || undefined} /> */}
                    <PaymentSupportPanel note="Biaya registrasi default saat ini Rp 20.000 untuk Male dan Female." />
                    <div className="tarkam-detail-stack" style={{ marginTop: "18px" }}>
                      {/* <div className="tarkam-detail-row">
                        <span>Kontak pembayaran</span>
                        <strong>{detail.proof || "Belum ada kontak."}</strong>
                      </div> */}
                      <div className="tarkam-detail-row">
                        <span>Update terakhir</span>
                        <strong>{updatedLabel}</strong>
                      </div>
                    </div>
                  </article>

                  <article className="galactic-hover-card tarkam-data-card">
                    <SectionHeading
                      eyebrow="Highlight"
                      title="Angka utama event"
                      summary=""
                    />
                    <div className="tarkam-meta-grid">
                      <MiniStat label="Players" value={totalPlayers} />
                      <MiniStat label="Groups" value={totalGroups} />
                      <MiniStat label="Contests" value={totalContests} />
                      <MiniStat label="Winners" value={totalWinners} />
                    </div>
                  </article>

                  <article className="galactic-hover-card tarkam-data-card">
                    <SectionHeading
                      eyebrow="Broadcast"
                      title="Kesiapan live event"
                      summary=""
                    />
                    <div className="tarkam-detail-stack">
                      <div className="tarkam-detail-row">
                        <span>Streaming aktif</span>
                        <strong>
                          {formatNumber(bundle.streamings.length)}
                        </strong>
                      </div>
                      <div className="tarkam-detail-row">
                        <span>Session terhubung</span>
                        <strong>{formatNumber(bundle.sessions.length)}</strong>
                      </div>
                      <div className="tarkam-detail-row">
                        <span>Timeline terhubung</span>
                        <strong>{formatNumber(bundle.timelines.length)}</strong>
                      </div>
                      <div className="tarkam-detail-row">
                        <span>Poin hadiah</span>
                        <strong>{formatNumber(detail.points_awarded)}</strong>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            ) : null}

            {activeTab === "gender" ? (
              <div className="tarkam-tab-pane">
                <SectionHeading
                  eyebrow="Divisi"
                  title={`Roster dan group untuk ${genderLabel(activeGender)}`}
                  summary=""
                />

                <div
                  className="tarkam-filter-nav"
                  role="tablist"
                  aria-label="Filter gender Tarkam"
                >
                  {(["all", "male", "female"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`tarkam-segment-btn${activeGender === gender ? " is-active" : ""}`}
                      onClick={() => setActiveGender(gender)}
                    >
                      {genderLabel(gender)}
                    </button>
                  ))}
                </div>

                <div className="row">
                  <div className="col-lg-4 sm-padding">
                    <article className="galactic-hover-card tarkam-list-card">
                      <SectionHeading
                        eyebrow="Groups"
                        title="Pembagian grup"
                        summary=""
                      />
                      {filteredGroups.length ? (
                        filteredGroups.map((group) => (
                          <div
                            className="tarkam-list-item"
                            key={String(group.id)}
                          >
                            <div className="tarkam-list-item__main">
                              <strong>{group.name || "Group"}</strong>
                              <span>
                                {group.gender || "Divisi belum diatur"}
                              </span>
                            </div>
                            <span className="tarkam-badge">
                              {formatNumber(group.teams_count)} tim
                            </span>
                          </div>
                        ))
                      ) : (
                        <InlineEmptyState
                          title="Belum ada group"
                          description="Filter ini belum memiliki pembagian group yang bisa ditampilkan."
                        />
                      )}
                    </article>
                  </div>

                  <div className="col-lg-8 sm-padding">
                    <article className="galactic-hover-card tarkam-list-card">
                      <SectionHeading
                        eyebrow="Teams"
                        title="Roster per tim"
                        summary=""
                      />
                      {filteredTeams.length ? (
                        filteredTeams.map((team) => {
                          const members = getTeamMembers(team)
                            .map(
                              (member) =>
                                member.nickname || member.username || "Member",
                            )
                            .join(", ");

                          return (
                            <div
                              className="tarkam-list-item tarkam-list-item--team"
                              key={String(team.id)}
                            >
                              <div className="tarkam-team-line">
                                <img
                                  className="tarkam-team-line__logo"
                                  src={
                                    resolveImage(team.logo, placeholderTeam) ||
                                    placeholderTeam
                                  }
                                  alt={team.name || "Team"}
                                />
                                <div className="tarkam-team-line__content">
                                  <div className="tarkam-list-item__main">
                                    <strong>
                                      {hasValue(team.id) ? (
                                        <Link
                                          to={buildTeamDetailPath(team.id || "")}
                                        >
                                          {team.name || "Team"}
                                        </Link>
                                      ) : (
                                        team.name || "Team"
                                      )}
                                    </strong>
                                    <span>
                                      {team.group?.name ||
                                        team.gender ||
                                        "Divisi belum ditetapkan"}
                                    </span>
                                  </div>
                                  <div className="tarkam-list-item__meta">
                                    <span>{formatDate(team.date)}</span>
                                    <span>{team.time || "TBA"}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="tarkam-inline-copy">
                                {members || "Belum ada member yang terhubung."}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <InlineEmptyState
                          title="Belum ada tim"
                          description="Filter ini belum memiliki tim yang tersinkron ke Tarkam."
                        />
                      )}
                    </article>
                  </div>

                  <div className="col-12 sm-padding mt-20">
                    <article className="galactic-hover-card tarkam-list-card">
                      <SectionHeading
                        eyebrow="Players"
                        title="Status player terdaftar"
                        summary=""
                      />

                      {filteredPlayers.length ? (
                        <div className="tarkam-player-grid">
                          {filteredPlayers.map((player) => {
                            const playerKey =
                              player.member?.slug ||
                              player.member?.id ||
                              player.id;
                            const playerName =
                              player.member?.nickname ||
                              player.member?.username ||
                              "Player";

                            return (
                              <article
                                className="tarkam-member-card tarkam-member-card--player"
                                key={String(player.id)}
                              >
                                <div className="tarkam-member-card__head">
                                  <img
                                    className="tarkam-member-card__avatar"
                                    src={
                                      resolveImage(
                                        player.member?.picture_url,
                                        placeholderPlayer,
                                      ) || placeholderPlayer
                                    }
                                    alt={playerName}
                                  />
                                  <div className="tarkam-member-card__identity">
                                    <h4>
                                      {hasValue(playerKey) ? (
                                        <Link
                                          to={buildPlayerDetailPath(
                                            playerKey || "",
                                          )}
                                        >
                                          {playerName}
                                        </Link>
                                      ) : (
                                        playerName
                                      )}
                                    </h4>
                                    <p>
                                      {player.member?.club?.name ||
                                        "Belum terhubung ke klub"}
                                    </p>
                                  </div>
                                  <span
                                    className={`tarkam-pill ${player.paid ? "is-active" : "is-idle"}`}
                                  >
                                    {player.paid ? "Paid" : "Unpaid"}
                                  </span>
                                </div>

                                <div className="tarkam-player-meta">
                                  <div className="tarkam-detail-row">
                                    <span>Gender</span>
                                    <strong>
                                      {player.member?.gender || "-"}
                                    </strong>
                                  </div>
                                  <div className="tarkam-detail-row">
                                    <span>Kota</span>
                                    <strong>
                                      {player.member?.city || "-"}
                                    </strong>
                                  </div>
                                  <div className="tarkam-detail-row">
                                    <span>Tier</span>
                                    <strong>
                                      {player.member?.tier || "-"}
                                    </strong>
                                  </div>
                                  <div className="tarkam-detail-row">
                                    <span>Score</span>
                                    <strong>
                                      {formatNumber(player.score)}
                                    </strong>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <InlineEmptyState
                          title="Belum ada player"
                          description="Belum ada player yang cocok dengan filter divisi saat ini."
                        />
                      )}
                    </article>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "sessions" ? (
              <div className="tarkam-tab-pane">
                <SectionHeading
                  eyebrow="Sessions"
                  title="Riwayat sesi pertandingan"
                  summary=""
                />

                <div className="row">
                  {bundle.sessions.length ? (
                    bundle.sessions.map((relation) => {
                      const session = relation.session;
                      const sessionLabel =
                        session?.sesi ?? relation.session_fk ?? "-";

                      return (
                        <div
                          className="col-lg-4 col-md-6 sm-padding"
                          key={String(relation.id || relation.session_fk)}
                        >
                          <article className="galactic-hover-card tarkam-session-card">
                            <div className="tarkam-session-card__head">
                              <div>
                                <div className="tarkam-eyebrow">
                                  Session {sessionLabel}
                                </div>
                                <h3>Distribusi poin sesi</h3>
                              </div>
                              <span
                                className={`tarkam-pill ${statusClass(session?.status)}`}
                              >
                                {statusLabel(session?.status)}
                              </span>
                            </div>

                            <div className="tarkam-session-points">
                              {formatNumber(session?.point)} poin
                            </div>

                            <div className="tarkam-detail-stack">
                              <div className="tarkam-detail-row">
                                <span>Participant</span>
                                <strong>{session?.participant || "-"}</strong>
                              </div>
                              <div className="tarkam-detail-row">
                                <span>Created</span>
                                <strong>
                                  {formatDateTime(
                                    session?.created_at || relation.created_at,
                                  )}
                                </strong>
                              </div>
                              <div className="tarkam-detail-row">
                                <span>Updated</span>
                                <strong>
                                  {formatDateTime(
                                    session?.updated_at || relation.updated_at,
                                  )}
                                </strong>
                              </div>
                            </div>

                            <div className="tarkam-session-snapshot">
                              {formatParticipantSnapshot(session?.participant)}
                            </div>
                          </article>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <InlineEmptyState title="Belum ada sesi" description="" />
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "timelines" ? (
              <div className="tarkam-tab-pane">
                <SectionHeading
                  eyebrow="Timelines"
                  title="Catatan aktivitas event"
                  summary=""
                />

                <div className="row tarkam-timelines-scroll">
                  {bundle.timelines.length ? (
                    bundle.timelines.map((relation) => {
                      const timeline = relation.timeline;
                      const actor =
                        timeline?.member?.nickname ||
                        timeline?.member?.username ||
                        timeline?.club?.name ||
                        "Tarkam";
                      const actorSubtext =
                        timeline?.club?.name ||
                        (timeline?.member?.club?.name
                          ? `Klub ${timeline.member.club.name}`
                          : "Aktivitas umum Tarkam");

                      return (
                        <div
                          className="col-lg-6 sm-padding mt-10"
                          key={String(
                            relation.id ||
                              relation.timeline_fk ||
                              relation.session_fk,
                          )}
                        >
                          <article className="galactic-hover-card tarkam-timeline-card">
                            <div className="tarkam-timeline-card__head">
                              <div>
                                <div className="tarkam-eyebrow">
                                  Timeline Event
                                </div>
                                <h3>{actor}</h3>
                                <p className="tarkam-inline-copy">
                                  {actorSubtext}
                                </p>
                              </div>
                              <span className="tarkam-badge">
                                {timeline?.session?.sesi !== undefined
                                  ? `Session ${timeline.session.sesi}`
                                  : "General"}
                              </span>
                            </div>

                            <p className="tarkam-timeline-card__description">
                              {timeline?.description ||
                                "Belum ada deskripsi timeline yang disimpan."}
                            </p>

                            <div className="tarkam-detail-stack">
                              <div className="tarkam-detail-row">
                                <span>Created</span>
                                <strong>
                                  {formatDateTime(
                                    timeline?.created_at || relation.created_at,
                                  )}
                                </strong>
                              </div>
                              <div className="tarkam-detail-row">
                                <span>Updated</span>
                                <strong>
                                  {formatDateTime(
                                    timeline?.updated_at || relation.updated_at,
                                  )}
                                </strong>
                              </div>
                            </div>
                          </article>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <InlineEmptyState
                        title="Belum ada timeline"
                        description="Timeline event belum tersedia untuk Tarkam ini."
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "competition" ? (
              <div className="tarkam-tab-pane">
                <SectionHeading
                  eyebrow="Competition"
                  title={`Pertandingan dan pemenang untuk ${genderLabel(activeGender)}`}
                  summary=""
                />

                <div
                  className="tarkam-filter-nav"
                  role="tablist"
                  aria-label="Filter gender competition"
                >
                  {(["all", "male", "female"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`tarkam-segment-btn${activeGender === gender ? " is-active" : ""}`}
                      onClick={() => setActiveGender(gender)}
                    >
                      {genderLabel(gender)}
                    </button>
                  ))}
                </div>

                {bundle.streamings.length ? (
                  <div className="tarkam-stream-grid">
                    {bundle.streamings.map((stream) => {
                      const streamUrl = getStreamUrl(stream);
                      const streamImage =
                        resolveImage(stream.thumbnail, placeholderVideoThumb) ||
                        placeholderVideoThumb;

                      return (
                        <article
                          className="galactic-hover-card tarkam-stream-card"
                          key={String(stream.id)}
                        >
                          <div className="tarkam-stream-card__thumb">
                            <img
                              src={streamImage}
                              alt={stream.title || "Streaming Tarkam"}
                            />
                          </div>
                          <div className="tarkam-stream-card__body">
                            <div className="tarkam-eyebrow">Live Coverage</div>
                            <h3>{stream.title || "Streaming"}</h3>
                            <p>
                              {stream.description ||
                                "Streaming untuk Tarkam ini belum memiliki deskripsi tambahan."}
                            </p>
                            {streamUrl ? (
                              <VideoStreemButton
                                href={streamUrl}
                                label="Watch Stream"
                                normalizeFacebook
                              />
                            ) : (
                              <span className="tarkam-inline-copy">
                                Tautan streaming belum tersedia.
                              </span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}

                <div className="tarkam-competition-grid">
                  <article className="galactic-hover-card tarkam-list-card">
                    <SectionHeading
                      eyebrow="Contests"
                      title="Daftar pertandingan"
                      summary=""
                    />
                    {filteredContests.length ? (
                      filteredContests.map((contest) => (
                        <div
                          className="tarkam-list-item"
                          key={String(contest.id)}
                        >
                          <div className="tarkam-list-item__main">
                            <strong>
                              {contest.team1?.name || "-"} vs{" "}
                              {contest.team2?.name || "-"}
                            </strong>
                            <span>{contest.gender || "Open bracket"}</span>
                          </div>
                          <div className="tarkam-list-item__meta">
                            <span>Score {contest.score ?? "TBA"}</span>
                            <span>{formatDateTime(contest.created_at)}</span>
                          </div>
                          <p className="tarkam-inline-copy">
                            Winner:{" "}
                            {contest.winnerTeam?.name || "Belum ditentukan"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <InlineEmptyState
                        title="Belum ada contest"
                        description="Belum ada pertandingan yang sesuai dengan filter competition saat ini."
                      />
                    )}
                  </article>

                  <article className="galactic-hover-card tarkam-list-card">
                    <SectionHeading
                      eyebrow="Winners"
                      title="Daftar pemenang"
                      summary=""
                    />
                    <div className="tarkam-list-item tarkam-list-item--highlight">
                      <div className="tarkam-list-item__main">
                        <strong>MVP</strong>
                        <span>{currentMvpText}</span>
                      </div>
                    </div>
                    {filteredWinners.length ? (
                      filteredWinners.map((winner) => (
                        <div
                          className="tarkam-list-item"
                          key={String(winner.id)}
                        >
                          <div className="tarkam-list-item__main">
                            <strong>
                              {winner.rank ? `#${winner.rank} ` : ""}
                              {winner.nickname || winner.team?.name || "Winner"}
                            </strong>
                            <span>{winner.gender || "Open bracket"}</span>
                          </div>
                          <div className="tarkam-list-item__meta">
                            <span>
                              {winner.team?.name || "Tim belum ditautkan"}
                            </span>
                            <span>{formatDateTime(winner.created_at)}</span>
                          </div>
                          <p className="tarkam-inline-copy">
                            {winner.prize ? formatCurrency(winner.prize) : "Hadiah belum dicatat."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <InlineEmptyState
                        title="Belum ada winner"
                        description="Belum ada daftar pemenang untuk filter competition yang dipilih."
                      />
                    )}
                  </article>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="product-description padding-top padding-bottom">
        <div className="container">
          <div className="description">
            <h3 className="comment-title">Komentar Tarkam</h3>
            <DisqusThread
              key={`tarkam-${detail.id || tarkamId}`}
              identifier={`tarkam-${detail.id || tarkamId}`}
              title={detail.title || `Tarkam ${detail.week || "?"}`}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export { TarkamDetailsContent };
