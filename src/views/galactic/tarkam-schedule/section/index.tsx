import { useState } from "react";
import { Link } from "react-router-dom";
import "@/assets/css/tarkam-theme.css";
import { PageHeader } from "@/galactic/common";
import { buildTarkamDetailPath, galacticRoutes } from "@/galactic/data";
// import { placeholderVideoThumb } from "@/galactic/placeholders";

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
  penyawers_count?: number;
  streamings_count?: number;
  sessions_count?: number;
  timelines_count?: number;
};

type GenderKey = "male" | "female";

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

const buildGenderPath = (tarkamId: number, gender: GenderKey, view?: string) => {
  const params = new URLSearchParams({ gender });

  if (view) {
    params.set("view", view);
  }

  return `${buildTarkamDetailPath(tarkamId)}?${params.toString()}`;
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
  const used = players !== undefined && players !== null ? players : (gender === "male" ? tarkam.male_completed : tarkam.female_completed);
  return Math.max(0, Number(slot ?? 0) - Number(used ?? 0));
};

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
          <h4 className="tarkam-gender-card__title" style={{ margin: "4px 0 0", fontSize: "1.15rem" }}>{tarkam.title || `Tarkam Week ${tarkam.week || "?"}`}</h4>
        </div>
        {/* <span className="tarkam-badge tarkam-badge--soft" style={{ fontSize: "0.85rem" }}>
          {genderLabel} View
        </span> */}
      </div>
      <div className="tarkam-meta-grid" style={{ marginBottom: "14px" }}>
        <StatCard label="Date" value={formatDateLabel(values.date)} />
        <StatCard label="Time" value={values.time || "TBA"} />
        <StatCard label="Slot" value={`${formatNumber(remaining)} / ${formatNumber(values.slot)}`} />
        <StatCard label="Status" value={formatNumber(values.completed) === "1" ? "Completed" : "Open"} />
        {/* <StatCard label="Slot" value={formatNumber(values.slot)} hint="Kapasitas peserta" />
        <StatCard label="Completed" value={formatNumber(values.completed)} hint="Progress sesi" /> */}
      </div>
      <div className="tarkam-meta-grid" style={{ marginBottom: "16px" }}>
        <StatCard label="Pool Price" value={formatCurrency(values.poolPrice)} />
        <StatCard label="MVP" value={values.mvp || "TBA"} />
      </div>
      {/* <div className="tarkam-link-row">
        <Link className="default-btn" to={buildGenderPath(tarkam.id, gender, "overview")}>
          Lihat Detail {genderLabel}
        </Link>
        <Link
          className="default-btn"
          to={buildGenderPath(tarkam.id, gender, "players")}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.22)" }}
        >
          Lihat Player {genderLabel}
        </Link>
      </div> */}
    </div>
  );
};

const ScheduleCard = ({ tarkam }: { tarkam: ScheduleTarkam }) => {
  // const image = tarkam.image?.trim() || tarkam.thumbnail?.trim() || placeholderVideoThumb;
  const totalTeams = Number(tarkam.teams_count ?? 0);
  const totalGroups = Number(tarkam.groups_count ?? 0);
  const totalContests = Number(tarkam.contests_count ?? 0);
  const totalPlayers = Number(tarkam.players_count ?? 0);
  const totalSessions = Number(tarkam.sessions_count ?? 0);
  const totalTimelines = Number(tarkam.timelines_count ?? 0);
  const totalStreamings = Number(tarkam.streamings_count ?? 0);

  return (
    <article
      id={`tarkam-${tarkam.id}`}
      className="galactic-hover-card tarkam-schedule-card"
    >
      {/* <div className="tarkam-schedule-card__media" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,10,22,0.2), rgba(5,10,22,0.78)), url(${image})` }} /> */}
      <div className="tarkam-schedule-card__content">
        <div className="tarkam-schedule-card__headline">
            <div>
              <div className="tarkam-eyebrow">
                Tarkam Week {tarkam.week || "-"}
              </div>
              <h3 className="tarkam-title">{tarkam.title || "Tarkam"}</h3>
            </div>
            <div className="tarkam-badge-row">
              <span className="tarkam-badge">
                {tarkam.status || "Upcoming"}
              </span>
              {tarkam.location ? (
                <span className="tarkam-badge tarkam-badge--soft">
                  {tarkam.location}
                </span>
              ) : null}
            </div>

          <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.74)", lineHeight: 1.8 }}>
            {tarkam.description || "Rangkuman jadwal Tarkam akan tampil di sini, termasuk sesi, timeline, dan pembagian gender."}
          </p>

          <div className="tarkam-kpi-grid">
            <StatCard label="Teams" value={formatNumber(totalTeams)} />
            <StatCard label="Groups" value={formatNumber(totalGroups)} />
            <StatCard label="Contests" value={formatNumber(totalContests)} />
            <StatCard label="Players" value={formatNumber(totalPlayers)} />
          </div>

          <div className="tarkam-meta-grid">
            <StatCard label="Sessions" value={formatNumber(totalSessions)} />
            <StatCard label="Timelines" value={formatNumber(totalTimelines)} />
            <StatCard label="Streamings" value={formatNumber(totalStreamings)} />
          </div>

          <div className="tarkam-card-grid" style={{ marginTop: "22px" }}>
            <ScheduleGenderPanel tarkam={tarkam} gender="male" />
            <ScheduleGenderPanel tarkam={tarkam} gender="female" />
          </div>

          <div className="tarkam-action-row" style={{ marginTop: "22px", alignItems: "center" }}>
            <Link className="default-btn" to={buildTarkamDetailPath(tarkam.id)}>
              Lihat Detail
            </Link>
            <Link className="default-btn" to={buildGenderPath(tarkam.id, "male", "teams")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>
              Male Teams
            </Link>
            <Link className="default-btn" to={buildGenderPath(tarkam.id, "female", "teams")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>
              Female Teams
            </Link>
            {tarkam.proof ? (
              <a
                className="default-btn"
                href={`https://wa.me/${tarkam.proof}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                Proof
              </a>
            ) : null}
          </div>

            {tarkam.transfer_info ? (
            <div className="tarkam-mini-stat" style={{ marginTop: "18px", color: "rgba(255,255,255,0.74)" }}>
              <strong style={{ display: "block", marginBottom: "6px", color: "#fff" }}>Transfer Info</strong>
              <span>{tarkam.transfer_info}</span>
            </div>
          ) : null}

          {tarkam.points_awarded !== undefined ? (
            <div style={{ marginTop: "14px", color: "rgba(255,255,255,0.62)", fontSize: "0.95rem" }}>
              Poin dibagikan: <strong style={{ color: "#fff" }}>{formatNumber(tarkam.points_awarded)}</strong>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const TarkamScheduleContent = ({ tarkams }: { tarkams: ScheduleTarkam[] }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const orderedTarkams = [...tarkams].sort((left, right) => Number(right.id) - Number(left.id));
  const visibleItems = orderedTarkams.slice(0, visibleCount);
  const hasMore = visibleCount < orderedTarkams.length;

  return (
    <>
      <PageHeader
        eyebrow="Tarkam Schedule"
        title="Semua Info Turnamen Tarkam"
        description="Akses informasi komprehensif melalui jadwal yang interaktif. Setiap panel menyajikan
data kategori <code>(Male/Female)</code>, sisa slot tim, serta pembagian sesi secara real-time."
      />
      <section className="latest-matches padding-top tarkam-section">
        <div className="container">
          {visibleItems.length ? (
            <>
              {visibleItems.map((tarkam) => (
                <ScheduleCard key={tarkam.id} tarkam={tarkam} />
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
              <p>
                Data dari API `/tarkams` belum mengembalikan item apa pun untuk ditampilkan.
              </p>
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
