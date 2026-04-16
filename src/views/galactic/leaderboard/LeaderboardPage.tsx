import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Api from "@/api";
import { PageHeader, PageShell } from "@/galactic/common";
import {
  buildClubDetailPath,
  buildPlayerDetailPath,
} from "@/galactic/data";
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
  total_amount?: number | string;
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
  params?: Record<string, string>;
  metricKey: "point" | "points" | "total_amount";
  metricLabel: string;
  metricFormat: MetricFormat;
  focusLabel: string;
  summaryLabel: string;
  noteTitle: string;
  noteDescription: string;
  emptyTitle: string;
  emptyDescription: string;
};

const configs: Record<LeaderboardVariant, LeaderboardConfig> = {
  sponsor: {
    title: "Sponsor Leaderboard",
    eyebrow: "Sponsor Board",
    description:
      "Akumulasi dukungan penyawer yang tercatat pada session aktif, lengkap dengan nickname, total amount, dan afiliasi klub.",
    endpoint: "/penyawer-leaderboards",
    metricKey: "total_amount",
    metricLabel: "Total Amount",
    metricFormat: "currency",
    focusLabel: "Top Penyawer",
    summaryLabel: "Total Akumulasi Saweran",
    noteTitle: "Sponsor leaderboard dibuat dari akumulasi saweran.",
    noteDescription:
      "Setiap total dihitung dari seluruh entri penyawer yang masih terhubung dengan session aktif, sehingga angka yang tampil adalah total amount akumulasi.",
    emptyTitle: "Belum ada sponsor yang tercatat.",
    emptyDescription:
      "Data penyawer akan muncul setelah server menerima saweran valid dan mengakumulasikannya.",
  },
  global: {
    title: "Global Leaderboard",
    eyebrow: "Global Board",
    description:
      "Peringkat gabungan semua member male dan female lintas klub, menampilkan nickname, point, dan club code secara langsung.",
    endpoint: "/leaderboards",
    params: { scope: "global" },
    metricKey: "point",
    metricLabel: "Point",
    metricFormat: "number",
    focusLabel: "Top Player",
    summaryLabel: "Total Point Tercatat",
    noteTitle: "Leaderboard global menampilkan member aktif terbaik.",
    noteDescription:
      "Daftar ini mengambil poin gabungan semua member male dan female dari schema leaderboard yang sudah disinkronkan ke player, lalu dibersihkan per member agar tidak dobel.",
    emptyTitle: "Belum ada player global yang masuk leaderboard.",
    emptyDescription:
      "Data akan terisi setelah poin member aktif tersinkron dari pertandingan dan session berjalan.",
  },
  club: {
    title: "Club Leaderboard",
    eyebrow: "Club Board",
    description:
      "Peringkat klub dari total point hasil akumulasi semua member yang ada di club tersebut, tetap menampilkan nickname, point, dan club code tiap klub.",
    endpoint: "/leaderboards",
    params: { scope: "club" },
    metricKey: "point",
    metricLabel: "Point",
    metricFormat: "number",
    focusLabel: "Top Club",
    summaryLabel: "Total Point Klub",
    noteTitle: "Poin klub berasal dari sinkronisasi poin seluruh member klub.",
    noteDescription:
      "Nilai setiap klub dihitung dari penjumlahan langsung point semua member non-deleted yang terhubung ke klub tersebut.",
    emptyTitle: "Belum ada klub yang masuk leaderboard.",
    emptyDescription:
      "Leaderboard klub akan muncul setelah klub dan member aktif tercatat pada session yang berjalan.",
  },
  male: {
    title: "Male Leaderboard",
    eyebrow: "Male Board",
    description:
      "Peringkat member kategori male dengan nickname, point, dan club code yang langsung terhubung ke profil klub serta player.",
    endpoint: "/leaderboards",
    params: { scope: "male" },
    metricKey: "point",
    metricLabel: "Point",
    metricFormat: "number",
    focusLabel: "Top Male Player",
    summaryLabel: "Total Point Male",
    noteTitle: "Kategori male diambil dari member aktif dengan gender male.",
    noteDescription:
      "Peringkat ini membantu melihat siapa yang paling konsisten mendulang poin pada bracket atau roster kategori male.",
    emptyTitle: "Belum ada player male di leaderboard.",
    emptyDescription:
      "Begitu data member male aktif dan poinnya tersedia, daftar ini akan terisi otomatis.",
  },
  female: {
    title: "Female Leaderboard",
    eyebrow: "Female Board",
    description:
      "Peringkat member kategori female dengan nickname, point, dan club code dari session aktif yang sama dengan leaderboard lain.",
    endpoint: "/leaderboards",
    params: { scope: "female" },
    metricKey: "point",
    metricLabel: "Point",
    metricFormat: "number",
    focusLabel: "Top Female Player",
    summaryLabel: "Total Point Female",
    noteTitle: "Kategori female mengikuti data member aktif pada session berjalan.",
    noteDescription:
      "Dengan pemisahan ini, performa roster female bisa dilihat jelas tanpa bercampur dengan kategori global.",
    emptyTitle: "Belum ada player female di leaderboard.",
    emptyDescription:
      "Daftar ini akan tampil otomatis setelah member female aktif memperoleh poin pada sistem.",
  },
};

const formatNumber = (value?: number | string | null) => {
  const numeric = Number(value ?? 0);
  return Number.isNaN(numeric)
    ? "0"
    : new Intl.NumberFormat("id-ID").format(numeric);
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

const asMetric = (
  entry: LeaderboardEntry,
  metricKey: LeaderboardConfig["metricKey"],
) => Number(entry[metricKey] ?? 0);

const formatMetric = (
  value: number,
  format: MetricFormat,
) => (format === "currency" ? formatCurrency(value) : formatNumber(value));

const genderLabel = (value?: string) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value || "-";
};

const resolveAvatar = (variant: LeaderboardVariant, entry: LeaderboardEntry) => {
  if (variant === "club") {
    return entry.club_logo || placeholderSquad;
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
      entry.donation_count != null ? `Saweran ${formatNumber(entry.donation_count)}x` : null,
      entry.tarkam_week != null ? `Week ${entry.tarkam_week}` : entry.tarkam_title || null,
    ].filter(Boolean) as string[];
  }

  if (variant === "club") {
    return [
      entry.member_count != null ? `Member ${formatNumber(entry.member_count)}` : null,
      entry.male_member_count != null ? `Male ${formatNumber(entry.male_member_count)}` : null,
      entry.female_member_count != null ? `Female ${formatNumber(entry.female_member_count)}` : null,
    ].filter(Boolean) as string[];
  }

  return [
    entry.gender ? genderLabel(entry.gender) : null,
    entry.club_name || null,
  ].filter(Boolean) as string[];
};

function LeaderboardPage({ variant }: { variant: LeaderboardVariant }) {
  const config = configs[variant];
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await Api.get(config.endpoint, {
          params: config.params,
        });
        const payload = response.data as
          | ApiEnvelope<LeaderboardEntry[]>
          | LeaderboardEntry[]
          | undefined;
        const records = Array.isArray(payload)
          ? payload
          : payload?.data ?? [];

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
  }, [config.endpoint, config.metricKey, config.params, variant]);

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
      .map((entry, index) => ({
        ...entry,
        rank: entry.rank ?? index + 1,
      }));
  }, [config.metricKey, entries]);

  const topEntry = sortedEntries[0];
  const podiumEntries = sortedEntries.slice(0, 3);
  const totalMetric = sortedEntries.reduce(
    (sum, entry) => sum + asMetric(entry, config.metricKey),
    0,
  );
  const averageMetric = sortedEntries.length
    ? Math.round(totalMetric / sortedEntries.length)
    : 0;
  const clubLinkedCount = sortedEntries.filter(
    (entry) => entry.club_code && entry.club_code !== "-",
  ).length;

  return (
    <PageShell
      title={config.title}
      description={config.description}
      image={resolveAvatar(variant, topEntry || {})}
    >
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
      />

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
              <div className="leaderboard-hero-grid">
                <div className="leaderboard-hero-copy">
                  <p className="leaderboard-kicker">{config.focusLabel}</p>
                  <h1>{topEntry?.nickname || topEntry?.name || "Belum tersedia"}</h1>
                  <p>
                    Posisi teratas saat ini dipegang oleh{" "}
                    <strong>{topEntry?.nickname || topEntry?.name || "-"}</strong>{" "}
                    dengan {config.metricLabel.toLowerCase()}{" "}
                    <strong>
                      {formatMetric(
                        asMetric(topEntry || {}, config.metricKey),
                        config.metricFormat,
                      )}
                    </strong>
                    .
                  </p>

                  <div className="leaderboard-summary-grid">
                    <article>
                      <span>Total Rank</span>
                      <strong>{formatNumber(sortedEntries.length)}</strong>
                    </article>
                    <article>
                      <span>{config.summaryLabel}</span>
                      <strong>
                        {formatMetric(totalMetric, config.metricFormat)}
                      </strong>
                    </article>
                    <article>
                      <span>Rata-rata</span>
                      <strong>
                        {formatMetric(averageMetric, config.metricFormat)}
                      </strong>
                    </article>
                    <article>
                      <span>Terkait Klub</span>
                      <strong>{formatNumber(clubLinkedCount)}</strong>
                    </article>
                  </div>
                </div>

                <aside className="leaderboard-focus-card">
                  <div className="leaderboard-focus-card__media">
                    <img
                      src={resolveAvatar(variant, topEntry || {})}
                      alt={topEntry?.nickname || topEntry?.name || config.title}
                    />
                  </div>
                  <div className="leaderboard-focus-card__body">
                    <span>Rank #1</span>
                    <h2>{topEntry?.nickname || topEntry?.name || "-"}</h2>
                    <div className="leaderboard-focus-card__metric">
                      {formatMetric(
                        asMetric(topEntry || {}, config.metricKey),
                        config.metricFormat,
                      )}
                    </div>
                    <ul>
                      <li>
                        <span>Club Code</span>
                        <strong>{topEntry?.club_code || "-"}</strong>
                      </li>
                      <li>
                        <span>{config.metricLabel}</span>
                        <strong>
                          {formatMetric(
                            asMetric(topEntry || {}, config.metricKey),
                            config.metricFormat,
                          )}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>

              <section className="leaderboard-podium-section">
                <div className="leaderboard-podium-grid">
                  {podiumEntries.map((entry) => {
                    const primaryLink = resolvePrimaryLink(variant, entry);
                    const chips = buildMetaChips(variant, entry);

                    return (
                      <article
                        className={`leaderboard-podium-card leaderboard-podium-card--rank-${entry.rank}`}
                        key={`${entry.rank}-${entry.nickname || entry.name}`}
                      >
                        <div className="leaderboard-podium-card__rank">
                          #{entry.rank}
                        </div>
                        <div className="leaderboard-podium-card__avatar">
                          <img
                            src={resolveAvatar(variant, entry)}
                            alt={entry.nickname || entry.name || "Leaderboard"}
                          />
                        </div>
                        <div className="leaderboard-podium-card__content">
                          <span>{entry.club_code || "Tanpa klub"}</span>
                          <h3>
                            {primaryLink ? (
                              <Link to={primaryLink}>
                                {entry.nickname || entry.name || "-"}
                              </Link>
                            ) : (
                              entry.nickname || entry.name || "-"
                            )}
                          </h3>
                          <strong>
                            {formatMetric(
                              asMetric(entry, config.metricKey),
                              config.metricFormat,
                            )}
                          </strong>
                          {chips.length > 0 ? (
                            <div className="leaderboard-chip-row">
                              {chips.map((chip) => (
                                <span key={`${entry.rank}-${chip}`}>{chip}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="leaderboard-table-section">
                <div className="leaderboard-table-shell">
                  <div className="leaderboard-table-head">
                    <span>Rank</span>
                    <span>Nickname</span>
                    <span>Club Code</span>
                    <span>{config.metricLabel}</span>
                    <span>Detail</span>
                  </div>

                  <div className="leaderboard-table-body">
                    {sortedEntries.map((entry) => {
                      const primaryLink = resolvePrimaryLink(variant, entry);
                      const clubPath = entry.club_slug
                        ? buildClubDetailPath(entry.club_slug)
                        : undefined;
                      const chips = buildMetaChips(variant, entry);

                      return (
                        <article
                          className="leaderboard-table-row"
                          key={`${entry.rank}-${entry.nickname || entry.name}`}
                        >
                          <div
                            className="leaderboard-table-row__rank"
                            data-label="Rank"
                          >
                            #{entry.rank}
                          </div>
                          <div
                            className="leaderboard-table-row__name"
                            data-label="Nickname"
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
