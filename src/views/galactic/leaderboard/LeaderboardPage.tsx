import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
// import { PageHeader, PageShell } from "@/galactic/common";
import { PageShell } from "@/galactic/common";
import { buildClubDetailPath, buildPlayerDetailPath } from "@/galactic/data";
import {
  placeholderPlayer,
  placeholderSponsor,
  placeholderSquad,
} from "@/galactic/placeholders";
import "@/assets/css/leaderboard.css";

type ApiEnvelope<T> = {
  data?: T;
};

type LeaderboardVariant =
  | "sponsor"
  | "global"
  | "club"
  | "male"
  | "female";

type MetricFormat = "number" | "currency";

type LeaderboardEntry = {
  rank?: number;
  leaderboard_type?: string;
  nickname?: string;
  name?: string;
  point?: number | string;
  points?: number | string;
  session_point?: number | string;
  session_points?: number | string;
  session_reward?: number | string;
  lifetime_points?: number | string;
  total_amount?: number | string;
  total_reward?: number | string;
  wins?: number | string;
  team_size?: number | string;
  club_code?: string;
  club_name?: string;
  club_slug?: string;
  club_logo?: string;
  member_slug?: string;
  member_nickname?: string;
  picture_url?: string;
  gender?: string;
  donation_count?: number | string;
  member_count?: number | string;
  male_member_count?: number | string;
  female_member_count?: number | string;
  tarkam_week?: number | string;
  tarkam_title?: string;
};

type LeaderboardConfig = {
  title: string;
  eyebrow: string;
  description: string;
  endpoint: string;
  params?: Record<string, string | number>;
  metricKey: "point" | "points" | "total_amount";
  metricLabel: string;
  metricFormat: MetricFormat;
  focusLabel: string;
  summaryLabel: string;
  noteTitle: string;
  noteDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  rewardLabel?: string;
  showReward: boolean;
};

const LEADERBOARD_LIMIT = 10;

const configs: Record<LeaderboardVariant, LeaderboardConfig> = {
  sponsor: {
    title: "Sponsor Leaderboard",
    eyebrow: "Sponsor Board",
    description:
      "10 besar penyawer dengan total amount akumulasi tertinggi, menampilkan nickname, total amount, dan club code jika tersedia.",
    endpoint: "/penyawer-leaderboards",
    params: { limit: LEADERBOARD_LIMIT },
    metricKey: "total_amount",
    metricLabel: "Total Amount",
    metricFormat: "currency",
    focusLabel: "Top Penyawer",
    summaryLabel: "Akumulasi Saweran",
    noteTitle: "Sponsor leaderboard memakai total amount akumulasi.",
    noteDescription:
      "Reward tidak ditampilkan pada leaderboard sponsor karena ranking ini hanya berdasarkan total amount saweran aktif.",
    emptyTitle: "Belum ada sponsor yang tercatat.",
    emptyDescription:
      "Data penyawer akan muncul setelah server menerima saweran valid dan mengakumulasikannya.",
    rewardLabel: undefined,
    showReward: false,
  },
  global: {
    title: "Global Leaderboard",
    eyebrow: "Global Board",
    description:
      "10 besar gabungan semua member male dan female lintas klub dengan tolok ukur point session aktif dan reward session aktif.",
    endpoint: "/leaderboards",
    params: { scope: "global", limit: LEADERBOARD_LIMIT },
    metricKey: "point",
    metricLabel: "Session Point",
    metricFormat: "number",
    focusLabel: "Overall Top Player",
    summaryLabel: "Total Session Point Top 10",
    noteTitle: "Leaderboard global memakai point session aktif.",
    noteDescription:
      "Session point dijumlahkan dari point pendaftaran, bonus menang contest +2, bonus juara 1/2/3 sebesar +5/+3/+2, bonus prize share per team, dan bonus MVP +1. Session reward hanya menjumlahkan prize share juara dan pool MVP.",
    emptyTitle: "Belum ada player global yang masuk leaderboard.",
    emptyDescription:
      "Data akan terisi setelah poin member aktif tersinkron dari pertandingan dan session berjalan.",
    rewardLabel: "Session Reward",
    showReward: true,
  },
  club: {
    title: "Club Leaderboard",
    eyebrow: "Club Board",
    description:
      "10 besar klub dengan total point session aktif hasil akumulasi semua member di club tersebut, lengkap dengan club code dan reward session.",
    endpoint: "/leaderboards",
    params: { scope: "club", limit: LEADERBOARD_LIMIT },
    metricKey: "point",
    metricLabel: "Session Point",
    metricFormat: "number",
    focusLabel: "Top Club",
    summaryLabel: "Total Session Point Top 10",
    noteTitle: "Leaderboard klub mengikuti agregasi session aktif seluruh member.",
    noteDescription:
      "Point klub berasal dari akumulasi session point semua member aktif di club. Reward klub berasal dari akumulasi session reward semua member aktif di club.",
    emptyTitle: "Belum ada klub yang masuk leaderboard.",
    emptyDescription:
      "Leaderboard klub akan muncul setelah klub dan member aktif tercatat pada session yang berjalan.",
    rewardLabel: "Session Reward",
    showReward: true,
  },
  male: {
    title: "Male Leaderboard",
    eyebrow: "Male Board",
    description:
      "10 besar member kategori male dengan point session aktif, club code, dan reward session aktif.",
    endpoint: "/leaderboards",
    params: { scope: "male", limit: LEADERBOARD_LIMIT },
    metricKey: "point",
    metricLabel: "Session Point",
    metricFormat: "number",
    focusLabel: "Top Male Player",
    summaryLabel: "Total Session Point Top 10",
    noteTitle: "Male leaderboard memakai rumus session aktif.",
    noteDescription:
      "Session point male memakai point pendaftaran, menang contest, bonus juara, prize share per team, dan MVP +1. Session reward male hanya menjumlahkan prize share juara dan pool MVP.",
    emptyTitle: "Belum ada player male di leaderboard.",
    emptyDescription:
      "Begitu data member male aktif dan poinnya tersedia, daftar ini akan terisi otomatis.",
    rewardLabel: "Session Reward",
    showReward: true,
  },
  female: {
    title: "Female Leaderboard",
    eyebrow: "Female Board",
    description:
      "10 besar member kategori female dengan point session aktif, club code, dan reward session aktif.",
    endpoint: "/leaderboards",
    params: { scope: "female", limit: LEADERBOARD_LIMIT },
    metricKey: "point",
    metricLabel: "Session Point",
    metricFormat: "number",
    focusLabel: "Top Female Player",
    summaryLabel: "Total Session Point Top 10",
    noteTitle: "Female leaderboard memakai rumus session aktif.",
    noteDescription:
      "Session point female memakai point pendaftaran, menang contest, bonus juara, prize share per team, dan MVP +1. Session reward female hanya menjumlahkan prize share juara dan pool MVP.",
    emptyTitle: "Belum ada player female di leaderboard.",
    emptyDescription:
      "Daftar ini akan tampil otomatis setelah member female aktif memperoleh poin pada sistem.",
    rewardLabel: "Session Reward",
    showReward: true,
  },
};

const formatNumber = (value?: number | string | null) => {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric)
    ? "0"

    : new Intl.NumberFormat("id-ID", { 
        maximumFractionDigits: 0 
      }).format(numeric);
};

const formatCurrency = (value?: number | string | null) => {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric)
    ? "Rp0"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(numeric);
};

const formatRounded = (value?: number | string | null) => {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric)
    ? "0"
    : new Intl.NumberFormat("id-ID").format(Math.round(numeric));
};

const formatReward = (value?: number | string | null) => {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric)
    ? "Rp0"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numeric);
};

const asMetric = (
  entry: LeaderboardEntry,
  metricKey: LeaderboardConfig["metricKey"],
) => Number(entry[metricKey] ?? 0);

const asReward = (entry: LeaderboardEntry) =>
  Number(entry.session_reward ?? entry.total_reward ?? 0);

const formatMetric = (value: number, format: MetricFormat) =>
  format === "currency" ? formatCurrency(value) : formatRounded(value);

const genderLabel = (value?: string) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value || "-";
};

const resolveClubLogoUrl = (logo?: string) => {
  if (!logo) return undefined;
  if (/^https?:\/\//i.test(logo)) return logo;
  if (logo.startsWith('/')) return logo;
  return `/storage/clubs/${logo}`;
};

const resolveAvatar = (variant: LeaderboardVariant, entry: LeaderboardEntry) => {
  if (variant === "club") {
    return resolveClubLogoUrl(entry.club_logo) || placeholderSquad;
  }

  if (variant === "sponsor") {
    return entry.picture_url || placeholderSponsor;
  }

  return entry.picture_url || placeholderPlayer;
};

const resolvePrimaryLink = (
  variant: LeaderboardVariant,
  entry: LeaderboardEntry,
) => {
  if (variant === "club" && entry.club_slug) {
    return buildClubDetailPath(entry.club_slug);
  }

  if (entry.member_slug) {
    return buildPlayerDetailPath(entry.member_slug);
  }

  if (entry.club_slug) {
    return buildClubDetailPath(entry.club_slug);
  }

  return undefined;
};

const buildMetaChips = (
  variant: LeaderboardVariant,
  entry: LeaderboardEntry,
) => {
  if (variant === "sponsor") {
    return [
      entry.member_nickname ? `Member ${entry.member_nickname}` : null,
      entry.donation_count != null
        ? `Saweran ${formatNumber(entry.donation_count)}x`
        : null,
      entry.tarkam_week != null
        ? `Week ${entry.tarkam_week}`
        : entry.tarkam_title || null,
    ].filter(Boolean) as string[];
  }

  if (variant === "club") {
    return [
      entry.member_count != null
        ? `Member ${formatNumber(entry.member_count)}`
        : null,
      entry.male_member_count != null
        ? `Male ${formatNumber(entry.male_member_count)}`
        : null,
      entry.female_member_count != null
        ? `Female ${formatNumber(entry.female_member_count)}`
        : null,
    ].filter(Boolean) as string[];
  }

  return [
    entry.gender ? genderLabel(entry.gender) : null,
    entry.wins != null ? `Wins ${formatNumber(entry.wins)}` : null,
    entry.team_size != null ? `Team ${formatNumber(entry.team_size)}` : null,
  ].filter(Boolean) as string[];
};

const podiumOrder = (entries: LeaderboardEntry[]) => {
  const first = entries.find((entry) => entry.rank === 1);
  const second = entries.find((entry) => entry.rank === 2);
  const third = entries.find((entry) => entry.rank === 3);

  return [second, first, third].filter(Boolean) as LeaderboardEntry[];
};

const rankBadgeLabel = (rank?: number) => {
  if (rank === 1) return "TOP 1";
  if (rank === 2) return "TOP 2";
  if (rank === 3) return "TOP 3";
  return `TOP ${rank ?? "-"}`;
};

const metricLeadLabel = (config: LeaderboardConfig) => {
  if (config.metricFormat === "currency") {
    return "Current Total";
  }

  return "Active Session Point";
};

function LeaderboardPage({ variant }: { variant: LeaderboardVariant }) {
  const config = configs[variant];
  const liveKey = useLiveUpdate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const leaderboardResponse = await Api.get(config.endpoint, {
          params: config.params,
        });
        const leaderboardPayload = leaderboardResponse.data as
          | ApiEnvelope<LeaderboardEntry[]>
          | LeaderboardEntry[]
          | undefined;
        const records = Array.isArray(leaderboardPayload)
          ? leaderboardPayload
          : leaderboardPayload?.data ?? [];

        if (!cancelled) {
          setEntries(records);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setEntries([]);
          setError("Data leaderboard belum bisa dimuat dari server.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [config.endpoint, config.params, liveKey]);

  const sortedEntries = useMemo(() => {
    return [...entries]
      .sort((left, right) => {
        const metricGap =
          asMetric(right, config.metricKey) - asMetric(left, config.metricKey);
        if (metricGap !== 0) {
          return metricGap;
        }

        return String(left.nickname || left.name || "").localeCompare(
          String(right.nickname || right.name || ""),
        );
      })
      .slice(0, LEADERBOARD_LIMIT)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  }, [config.metricKey, entries]);

  const topEntry = sortedEntries[0];
  const podiumEntries = podiumOrder(sortedEntries);
  const tableEntries = sortedEntries.slice(3);
  const totalMetric = sortedEntries.reduce(
    (sum, entry) => sum + asMetric(entry, config.metricKey),
    0,
  );
  const totalReward = sortedEntries.reduce(
    (sum, entry) => sum + asReward(entry),
    0,
  );

  return (
    <PageShell
      title={config.title}
      description={config.description}
      image={resolveAvatar(variant, topEntry || {})}
    >
      {/* <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
      /> */}

      <section className="leaderboard-showcase padding-top">
        <div className="container">
          {loading ? (
            <div className="leaderboard-empty-state">
              <h2>Memuat leaderboard...</h2>
              <p>Server sedang menyiapkan ranking terbaru untuk halaman ini.</p>
            </div>
          ) : error ? (
            <div className="leaderboard-empty-state leaderboard-empty-state--error">
              <h2>Leaderboard belum bisa ditampilkan.</h2>
              <p>{error}</p>
            </div>
          ) : !sortedEntries.length ? (
            <div className="leaderboard-empty-state">
              <h2>{config.emptyTitle}</h2>
              <p>{config.emptyDescription}</p>
            </div>
          ) : (
            <>
              <section className="leaderboard-stage">
                <div className="leaderboard-stage__halo" />
                <div className="leaderboard-stage__summary">
                  <span>Live Top 10</span>
                  <strong>{config.focusLabel}</strong>
                  <p>
                    {topEntry?.nickname || topEntry?.name || "-"} memimpin dengan{" "}
                    {config.metricLabel.toLowerCase()}{" "}
                    {formatMetric(
                      asMetric(topEntry || {}, config.metricKey),
                      config.metricFormat,
                    )}
                    {config.showReward
                      ? ` dan total reward ${formatReward(
                          asReward(topEntry || {}),
                        )}`
                      : ""}
                    .
                  </p>
                </div>

                <div className="leaderboard-stage__podium">
                  {podiumEntries.map((entry) => {
                    const primaryLink = resolvePrimaryLink(variant, entry);
                    const chips = buildMetaChips(variant, entry);
                    const isChampion = entry.rank === 1;

                    return (
                      <article
                        className={`leaderboard-podium-card leaderboard-podium-card--rank-${entry.rank} ${
                          isChampion ? "is-champion" : ""
                        }`}
                        key={`${entry.rank}-${entry.nickname || entry.name}`}
                      >
                        <div className="leaderboard-podium-card__profile">
                          <div className="leaderboard-podium-card__avatar">
                            <img
                              src={resolveAvatar(variant, entry)}
                              alt={entry.nickname || entry.name || "Leaderboard"}
                            />
                          </div>
                          <div className="leaderboard-podium-card__identity">
                            <div className="leaderboard-podium-card__rank">
                              {rankBadgeLabel(entry.rank)}
                            </div>
                            <h3>
                              {primaryLink ? (
                                <Link to={primaryLink}>
                                  {entry.nickname || entry.name || "-"}
                                </Link>
                              ) : (
                                entry.nickname || entry.name || "-"
                              )}
                            </h3>
                          </div>
                        </div>

                        <div className="leaderboard-podium-card__platform-shell">
                          <div className="leaderboard-podium-card__badge">
                            #{entry.rank}
                          </div>
                          <div className="leaderboard-podium-card__platform">
                            <span>{metricLeadLabel(config)}</span>
                            <strong>
                              {formatMetric(
                                asMetric(entry, config.metricKey),
                                config.metricFormat,
                              )}
                            </strong>
                            <small>{config.metricLabel}</small>
                            {config.showReward ? (
                              <>
                                <div className="leaderboard-podium-card__reward">
                                  {formatReward(asReward(entry))}
                                </div>
                                <small>{config.rewardLabel}</small>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div className="leaderboard-chip-row">
                          <span>{entry.club_code || "-"}</span>
                          {chips.map((chip) => (
                            <span key={`${entry.rank}-${chip}`}>{chip}</span>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="leaderboard-stage__footnote">
                  <span>
                    Menampilkan <strong>{sortedEntries.length}</strong> posisi terbaik
                    saat ini
                  </span>
                  <span>
                    {config.summaryLabel}:{" "}
                    <strong>
                      {formatMetric(totalMetric, config.metricFormat)}
                    </strong>
                  </span>
                  {config.showReward ? (
                    <span>
                      Total reward: <strong>{formatReward(totalReward)}</strong>
                    </span>
                  ) : null}
                </div>
              </section>

              <section className="leaderboard-table-section">
                <div className="leaderboard-table-shell">
                  <div
                    className={`leaderboard-table-head ${
                      config.showReward ? "has-reward" : ""
                    }`}
                  >
                    <span>Rank</span>
                    <span>User name</span>
                    <span>Club Code</span>
                    <span>{config.metricLabel}</span>
                    {config.showReward ? <span>{config.rewardLabel}</span> : null}
                    <span>Detail</span>
                  </div>

                  <div className="leaderboard-table-body">
                    {tableEntries.map((entry) => {
                      const primaryLink = resolvePrimaryLink(variant, entry);
                      const clubPath = entry.club_slug
                        ? buildClubDetailPath(entry.club_slug)
                        : undefined;
                      const chips = buildMetaChips(variant, entry);

                      return (
                        <article
                          className={`leaderboard-table-row ${
                            config.showReward ? "has-reward" : ""
                          }`}
                          key={`${entry.rank}-${entry.nickname || entry.name}`}
                        >
                          <div className="leaderboard-table-row__rank" data-label="Rank">
                            #{entry.rank}
                          </div>
                          <div
                            className="leaderboard-table-row__name"
                            data-label="User name"
                          >
                            <img
                              src={resolveAvatar(variant, entry)}
                              alt={entry.nickname || entry.name || "Leaderboard"}
                            />
                            <div>
                              <strong>
                                {primaryLink ? (
                                  <Link to={primaryLink}>
                                    {entry.nickname || entry.name || "-"}
                                  </Link>
                                ) : (
                                  entry.nickname || entry.name || "-"
                                )}
                              </strong>
                              {chips.length > 0 ? (
                                <div className="leaderboard-chip-row leaderboard-chip-row--compact">
                                  {chips.map((chip) => (
                                    <span
                                      key={`${entry.rank}-${entry.nickname}-${chip}`}
                                    >
                                      {chip}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className="leaderboard-table-row__club"
                            data-label="Club Code"
                          >
                            {clubPath && entry.club_code && entry.club_code !== "-" ? (
                              <Link to={clubPath}>{entry.club_code}</Link>
                            ) : (
                              entry.club_code || "-"
                            )}
                          </div>
                          <div
                            className="leaderboard-table-row__metric"
                            data-label={config.metricLabel}
                          >
                            {formatMetric(
                              asMetric(entry, config.metricKey),
                              config.metricFormat,
                            )}
                          </div>
                          {config.showReward ? (
                            <div
                              className="leaderboard-table-row__reward"
                              data-label={config.rewardLabel}
                            >
                              {formatReward(asReward(entry))}
                            </div>
                          ) : null}
                          <div
                            className="leaderboard-table-row__detail"
                            data-label="Detail"
                          >
                            {primaryLink ? (
                              <Link to={primaryLink}>Lihat</Link>
                            ) : clubPath ? (
                              <Link to={clubPath}>Klub</Link>
                            ) : (
                              <span>Tidak ada</span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="leaderboard-note-section">
                <div className="leaderboard-note-card">
                  <div>
                    <span>Catatan Sistem</span>
                    <h2>{config.noteTitle}</h2>
                  </div>
                  <p>{config.noteDescription}</p>
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default LeaderboardPage;
export type { LeaderboardVariant };
