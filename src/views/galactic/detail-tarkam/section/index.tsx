import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Api from "@/api";
import "@/assets/css/tarkam-theme.css";
import { DisqusThread, PageHeader, SectionHeading } from "@/galactic/common";
import { buildPlayerDetailPath, buildTeamDetailPath, buildTarkamDetailPath, galacticRoutes } from "@/galactic/data";
import { placeholderPlayer, placeholderTeam, placeholderVideoThumb } from "@/galactic/placeholders";
import { useGalacticContent } from "../../shared";

type GenderFilter = "all" | "male" | "female";
type ViewFilter = "overview" | "gender" | "teams" | "players" | "sessions" | "timelines" | "contests";

type ApiEnvelope<T> = { data?: T };
type ApiClub = { name?: string; logo?: string };
type ApiMember = { id?: number | string; username?: string; nickname?: string; slug?: string; gender?: string; city?: string; tier?: string; picture_url?: string; points?: number | string; club?: ApiClub | null };
type ApiGroup = { name?: string; gender?: string; tarkam?: { title?: string; week?: string; status?: string } | null };
type ApiTeam = { id?: number | string; name?: string; gender?: string; date?: string; time?: string; member1?: ApiMember | null; member2?: ApiMember | null; member3?: ApiMember | null; group?: ApiGroup | null };
type ApiPlayer = { id?: number | string; score?: number | string; paid?: boolean | number | string; member?: ApiMember | null };
type ApiSession = { id?: number | string; sesi?: number | string; point?: number | string; participant?: string | null; status?: string | null; created_at?: string; updated_at?: string };
type ApiTarkamSession = { id?: number | string; session_fk?: number | string | null; created_at?: string; updated_at?: string; session?: ApiSession | null };
type ApiTimeline = { id?: number | string; description?: string | null; member?: ApiMember | null; club?: ApiClub | null; session?: ApiSession | null; created_at?: string; updated_at?: string };
type ApiTarkamTimeline = { id?: number | string; timeline_fk?: number | string | null; session_fk?: number | string | null; created_at?: string; updated_at?: string; timeline?: ApiTimeline | null; session?: ApiSession | null };
type ApiContest = { id?: number | string; team1_fk?: number | string | null; team2_fk?: number | string | null; winner_team_fk?: number | string | null; score?: number | string | null; gender?: string; team1?: ApiTeam | null; team2?: ApiTeam | null; winnerTeam?: ApiTeam | null; created_at?: string };
type ApiWinner = { id?: number | string; nickname?: string; prize?: string; gender?: string; team?: ApiTeam | null; created_at?: string };
type ApiStreaming = { id?: number | string; title?: string; url?: string; embed?: string; thumbnail?: string; description?: string };
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
  teams?: ApiTeam[];
  players?: ApiPlayer[];
  sessions?: ApiTarkamSession[];
  timelines?: ApiTarkamTimeline[];
  contests?: ApiContest[];
  winners?: ApiWinner[];
  streamings?: ApiStreaming[];
  created_at?: string;
  updated_at?: string;
};

const asArray = <T,>(value?: T[] | null) => (Array.isArray(value) ? value : []);
const formatDate = (value?: string | null) => {
  if (!value) return "TBA";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(date);
};
const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date);
};
const formatNumber = (value?: number | string | null) => new Intl.NumberFormat("id-ID").format(Number(value ?? 0));
const formatCurrency = (value?: number | string | null) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));
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
  if (normalized === "completed" || normalized === "complete") return "is-complete";
  if (normalized === "pending") return "is-pending";
  return "is-idle";
};
const genderLabel = (gender: GenderFilter) => (gender === "male" ? "Male" : "Female");

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="tarkam-mini-stat">
    <div className="tarkam-mini-stat__label">{label}</div>
    <div className="tarkam-mini-stat__value">{value}</div>
  </div>
);

const TarkamDetailsContent = ({ tarkamId }: { tarkamId?: number }) => {
  const [searchParams] = useSearchParams();
  const genderParam = searchParams.get("gender")?.toLowerCase();
  const viewParam = searchParams.get("view")?.toLowerCase();
  const genderFilter: GenderFilter = genderParam === "male" || genderParam === "female" ? genderParam : "all";
  const activeView: ViewFilter = viewParam === "gender" || viewParam === "teams" || viewParam === "players" || viewParam === "sessions" || viewParam === "timelines" || viewParam === "contests" ? viewParam : "overview";
  const { tarkams, teams } = useGalacticContent();
  const fallbackTarkam = tarkamId ? tarkams.find((item) => item.id === tarkamId) : undefined;
  const [record, setRecord] = useState<ApiTarkamDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(tarkamId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tarkamId) {
      setError("ID Tarkam tidak valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Api.get(`/tarkams/${tarkamId}`)
      .then((response) => {
        if (cancelled) return;
        const payload = response.data as ApiEnvelope<ApiTarkamDetail> | ApiTarkamDetail | undefined;
        const detail = (payload as ApiEnvelope<ApiTarkamDetail> | undefined)?.data ?? (payload as ApiTarkamDetail | undefined);
        if (!detail) {
          setError("Data Tarkam tidak ditemukan.");
          setRecord(null);
          return;
        }
        setRecord(detail);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        console.error(fetchError);
        setError("Gagal memuat detail Tarkam.");
        setRecord(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tarkamId]);

  const detail = record ?? (fallbackTarkam as ApiTarkamDetail | undefined) ?? null;
  const makeQueryPath = (overrides: Partial<Record<"gender" | "view", string>>) => {
    const params = new URLSearchParams(searchParams);
    if (overrides.gender !== undefined) {
      if (overrides.gender === "all") params.delete("gender");
      else params.set("gender", overrides.gender);
    }
    if (overrides.view !== undefined) params.set("view", overrides.view);
    const query = params.toString();
    return query ? `${buildTarkamDetailPath(tarkamId || 0)}?${query}` : buildTarkamDetailPath(tarkamId || 0);
  };

  useEffect(() => {
    if (!detail) return;
    document.getElementById(activeView)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeView, detail]);

  const visibleTeams = useMemo(() => {
    const fallbackTeams = teams
      .filter((record) => {
        const teamTarkamId = record.team?.tarkam_fk ? Number(record.team.tarkam_fk) : NaN;
        return Number.isInteger(teamTarkamId) && teamTarkamId === tarkamId;
      })
      .map((record) => ({
        id: record.team?.id,
        name: record.name,
        gender: record.gender,
        date: record.team?.date,
        time: record.team?.time,
        group: record.group ? { name: record.group.name } : undefined,
      }));

    const source = detail?.teams?.length ? detail.teams : fallbackTeams;
    return source.filter((team) => genderFilter === "all" || String(team.gender || "").toLowerCase() === genderFilter);
  }, [detail?.teams, teams, tarkamId, genderFilter]);

  const visiblePlayers = useMemo(
    () => asArray(detail?.players).filter((player) => genderFilter === "all" || String(player.member?.gender || "").toLowerCase() === genderFilter),
    [detail?.players, genderFilter],
  );
  const visibleSessions = asArray(detail?.sessions);
  const visibleTimelines = asArray(detail?.timelines);
  const visibleContests = asArray(detail?.contests).filter((contest) => genderFilter === "all" || String(contest.gender || "").toLowerCase() === genderFilter);
  const visibleWinners = asArray(detail?.winners).filter((winner) => genderFilter === "all" || String(winner.gender || "").toLowerCase() === genderFilter);
  const visibleStreamings = asArray(detail?.streamings);

  if (!tarkamId) {
    return (
      <section className="matches-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-empty-state">
            <h2>Tarkam tidak ditemukan</h2>
            <p>ID Tarkam yang dipilih tidak valid atau tidak tersedia.</p>
            <Link className="default-btn" to={galacticRoutes.tarkamSchedule}>Kembali ke Jadwal Tarkam</Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading && !detail) {
    return (
      <section className="matches-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-empty-state">
            <h2>Memuat detail Tarkam...</h2>
            <p>Menarik data roster, sesi, dan timeline dari API `/tarkams/{tarkamId}`.</p>
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
            <p>Data detail tidak dapat dimuat. Silakan kembali ke jadwal Tarkam.</p>
            <Link className="default-btn" to={galacticRoutes.tarkamSchedule}>Kembali ke Jadwal Tarkam</Link>
          </div>
        </div>
      </section>
    );
  }

//   const heroImage = detail.image?.trim() || detail.thumbnail?.trim() || placeholderVideoThumb;
  const title = detail.title ? `${detail.title} (Week ${detail.week || "?"})` : `Tarkam Week ${detail.week || "?"}`;

  return (
    <>
      <PageHeader
        className="tarkam-page-header"
        infoClassName="tarkam-page-header__info"
        eyebrow="Detail Tarkam"
        title={title}
        description={detail.description || "Lihat detail jadwal, roster, sesi, dan timeline untuk Tarkam ini."}
      />

      <section id="overview" className="team-section padding-top tarkam-section">
        <div className="container">
          {/* <div className="tarkam-hero-grid"> */}
            {/* <div className="tarkam-hero-media" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,10,22,0.18), rgba(5,10,22,0.84)), url(${heroImage})` }} /> */}
            <div className="tarkam-panel">
              <div className="tarkam-title-line">
                <div>
                  <div className="tarkam-eyebrow">
                    Tarkam Week {detail.week || "-"}
                  </div>
                  <h3 className="tarkam-title">{detail.title || "Tarkam"}</h3>
                </div>
                <div className="tarkam-badge-row">
                  <span className={`tarkam-pill ${statusClass(detail.status)}`}>{statusLabel(detail.status)}</span>
                  {detail.location ? <span className="tarkam-badge tarkam-badge--soft">{detail.location}</span> : null}
                </div>
              </div>
              <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.76)", lineHeight: 1.8 }}>{detail.description || "Tidak ada deskripsi tambahan untuk Tarkam ini."}</p>
              <div className="tarkam-kpi-grid">
                <MiniStat label="Teams" value={formatNumber(detail.teams_count ?? visibleTeams.length)} />
                <MiniStat label="Players" value={formatNumber(detail.players_count ?? visiblePlayers.length)} />
                <MiniStat label="Sessions" value={formatNumber(detail.sessions_count ?? visibleSessions.length)} />
                <MiniStat label="Timelines" value={formatNumber(detail.timelines_count ?? visibleTimelines.length)} />
              </div>
              <div className="tarkam-meta-grid">
                <MiniStat label="Groups" value={formatNumber(detail.groups_count)} />
                <MiniStat label="Contests" value={formatNumber(detail.contests_count)} />
                <MiniStat label="Winners" value={formatNumber(detail.winners_count)} />
                <MiniStat label="Points" value={formatNumber(detail.points_awarded)} />
              </div>
              {/* <div className="tarkam-link-row" style={{ marginTop: "18px" }}>
                <Link to={makeQueryPath({ gender: "all" })} style={{ padding: "8px 16px", color: genderFilter === "all" ? "#000" : "#fff", background: genderFilter === "all" ? "#fff" : "rgba(255,255,255,0.08)", borderRadius: "999px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>All</Link>
                <Link to={makeQueryPath({ gender: "male" })} style={{ padding: "8px 16px", color: genderFilter === "male" ? "#000" : "#fff", background: genderFilter === "male" ? "#fff" : "rgba(255,255,255,0.08)", borderRadius: "999px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>Male</Link>
                <Link to={makeQueryPath({ gender: "female" })} style={{ padding: "8px 16px", color: genderFilter === "female" ? "#000" : "#fff", background: genderFilter === "female" ? "#fff" : "rgba(255,255,255,0.08)", borderRadius: "999px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>Female</Link>
              </div> */}
              <div className="tarkam-mini-stat" style={{ marginTop: "16px", color: "rgba(255,255,255,0.72)", display: "grid", gap: "6px" }}>
                {detail.transfer_info ? <div><strong style={{ color: "#fff" }}>Transfer:</strong> {detail.transfer_info}</div> : null}
                {/* {detail.proof ? <div><strong style={{ color: "#fff" }}>Proof:</strong> <a href={detail.proof} target="_blank" rel="noreferrer">Buka bukti</a></div> : null} */}
                <div><strong style={{ color: "#fff" }}>MVP:</strong> Male {detail.mvp_m || "-"} | Female {detail.mvp_f || "-"}</div>
                {detail.updated_at || detail.created_at ? <div><strong style={{ color: "#fff" }}>Updated:</strong> {formatDateTime(detail.updated_at || detail.created_at)}</div> : null}
              </div>
              <div className="tarkam-action-row" style={{ marginTop: "20px" }}>
                <ul className="nav tab-navigation" id="tarkam-tab-navigation" role="tablist">
                  <li role="presentation">
                    <Link to="#" className="default-btn active" id="gender-tab" data-bs-toggle="tab" data-bs-target="#gender" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Gender</Link>
                  </li>
                  <li role="presentation">
                    <Link to="#" className="default-btn" id="sessions-tab" data-bs-toggle="tab" data-bs-target="#sessions" type="button" role="tab" aria-controls="sessions" aria-selected="false" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Sessions</Link>
                  </li>
                  <li role="presentation">
                    <Link to="#" className="default-btn" id="timelines-tab" data-bs-toggle="tab" data-bs-target="#timelines" type="button" role="tab" aria-controls="timelines" aria-selected="false" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Timelines</Link>
                  </li>
                </ul>
                {/* <Link className="default-btn" to={makeQueryPath({ view: "overview" })}>Overview</Link>
                <Link className="default-btn" to={makeQueryPath({ view: "gender" })}>Gender</Link>
                <Link className="default-btn" to={makeQueryPath({ view: "teams" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Teams</Link>
                <Link className="default-btn" to={makeQueryPath({ view: "players" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Players</Link>
                <Link className="default-btn" to={makeQueryPath({ view: "sessions" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Sessions</Link>
                <Link className="default-btn" to={makeQueryPath({ view: "timelines" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Timelines</Link> */}
              </div>
              <div className="container">
              <div className="tarkam-card-grid tab-content" id="tarkam-tab-content">
              <div className="tab-pane fade show active" id="gender" role="tabpanel" aria-labelledby="gender-tab">
                {(["male", "female"] as GenderFilter[]).map((gender) => {
              const date = gender === "male" ? detail.male_date : detail.female_date;
              const time = gender === "male" ? detail.male_time : detail.female_time;
              const slot = gender === "male" ? detail.male_slot : detail.female_slot;
              const completed = gender === "male" ? detail.male_completed : detail.female_completed;
              const poolPrice = gender === "male" ? detail.pool_price_m : detail.pool_price_f;
              const mvp = gender === "male" ? detail.mvp_m : detail.mvp_f;
              return (
                <div key={gender} className={`tarkam-gender-card ${gender === "male" ? "tarkam-gender-card--male" : "tarkam-gender-card--female"}`}>
                  <div className="tarkam-gender-card__head">
                    <div>
                      <div className={`tarkam-gender-card__eyebrow ${gender === "male" ? "tarkam-gender-card__eyebrow--male" : "tarkam-gender-card__eyebrow--female"}`}>{genderLabel(gender)}</div>
                      <h3 style={{ marginBottom: 0 }}>{detail.title || "Tarkam"}</h3>
                    </div>
                    <span className="tarkam-badge tarkam-badge--soft">{genderLabel(gender)} View</span>
                  </div>
                  <div className="tarkam-meta-grid">
                    <MiniStat label="Date" value={formatDate(date)} />
                    <MiniStat label="Time" value={time || "TBA"} />
                    <MiniStat label="Slot" value={formatNumber(slot)} />
                    <MiniStat label="Completed" value={formatNumber(completed)} />
                    <MiniStat label="Pool" value={formatCurrency(poolPrice)} />
                    <MiniStat label="MVP" value={mvp || "TBA"} />
                  </div>
                  <div className="tarkam-link-row" style={{ marginTop: "16px" }}>
                    <Link className="default-btn" to={makeQueryPath({ gender, view: "players" })}>Lihat Player {genderLabel(gender)}</Link>
                    <Link className="default-btn" to={makeQueryPath({ gender, view: "teams" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Lihat Team {genderLabel(gender)}</Link>
                    <Link className="default-btn" to={makeQueryPath({ gender, view: "sessions" })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Sesi {genderLabel(gender)}</Link>
                  </div>
                </div>
              );
            })}
              </div>
          </div>
          </div>
            </div>
          {/* </div> */}
        </div>
      </section>

      {/* <section id="gender" className="team-section padding-top tarkam-section">
        <div className="container">
          <SectionHeading eyebrow="Jadwal Gender" title={<>Pisahkan <span>Male</span> dan <span>Female</span></>} description="Setiap gender punya tanggal, jam, slot, completed, dan pool price sendiri." />
          
        </div>
      </section> */}

      <section className="team-section padding-top tarkam-section">
        <div className="container">
          <SectionHeading
            eyebrow="Tim Peserta"
            title={<>Daftar <span>Tim</span> Tarkam</>}
            description="Klik nama tim untuk menuju halaman detail tim. Gunakan filter gender untuk detail yang lebih spesifik."
          />
          <div className="tarkam-link-row" style={{ margin: '24px 0' }}>
            <Link
              to={buildTarkamDetailPath(tarkamId)}
              className={genderFilter === 'all' ? 'active-gender-filter' : ''}
              style={{
                padding: '8px 16px',
                color: genderFilter === 'all' ? '#000' : '#fff',
                background: genderFilter === 'all' ? '#fff' : 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              All
            </Link>
            <Link
              to={`${buildTarkamDetailPath(tarkamId)}?gender=female`}
              className={genderFilter === 'female' ? 'active-gender-filter' : ''}
              style={{
                padding: '8px 16px',
                color: genderFilter === 'female' ? '#000' : '#fff',
                background: genderFilter === 'female' ? '#fff' : 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              Female
            </Link>
            <Link
              to={`${buildTarkamDetailPath(tarkamId)}?gender=male`}
              className={genderFilter === 'male' ? 'active-gender-filter' : ''}
              style={{
                padding: '8px 16px',
                color: genderFilter === 'male' ? '#000' : '#fff',
                background: genderFilter === 'male' ? '#fff' : 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              Male
            </Link>
          </div>
          <div className="row">
            {visibleTeams.length ? (
              visibleTeams.map((team) => (
                <div className="col-lg-4 col-md-6 sm-padding" key={team.id || team.name}>
                  <div className="team-item galactic-hover-card tarkam-data-card">
                    <div className="team-thumb" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                      <img src={placeholderTeam} alt={team.name || "Team"} />
                    </div>
                    <div className="team-content">
                      <h3>
                        <Link to={buildTeamDetailPath(team.id || "")}>
                          {team.name || "Team"}
                          {team.group?.name ? <> | {team.group.name}</> : null}
                          <> | {team.gender || "Open"}</>
                        </Link>
                      </h3>
                      <p>
                        {formatDate(team.date)} | {team.time || "TBA"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>Tidak ada tim tersambung untuk Tarkam ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="players" className="team-section padding-top tarkam-section">
        <div className="container">
          <SectionHeading eyebrow="Player" title={<>Daftar <span>Player</span></>} description="Roster player dari detail Tarkam dan bisa difilter berdasarkan gender." />
          <div className="row">
            {visiblePlayers.length ? visiblePlayers.map((player) => (
              <div className="col-lg-4 col-md-6 sm-padding" key={player.id || player.member?.slug || player.member?.nickname}>
                <article className="galactic-hover-card tarkam-member-card">
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                    <img src={player.member?.picture_url || placeholderPlayer} alt={player.member?.nickname || player.member?.username || "Player"} style={{ width: "72px", height: "72px", borderRadius: "18px", objectFit: "cover" }} />
                    <div>
                      <h3 style={{ marginBottom: "6px" }}>
                        <Link to={player.member ? buildPlayerDetailPath(player.member.slug || player.member.id || "") : galacticRoutes.clubs}>
                          {player.member?.nickname || player.member?.username || "Player"}
                        </Link>
                      </h3>
                      <div style={{ color: "rgba(255,255,255,0.72)" }}>{player.member?.gender || "Unknown"} | {player.member?.tier || "-"}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Club</span> <strong>{player.member?.club?.name || "-"}</strong></div>
                    <div><span style={{ color: "rgba(255,255,255,0.60)" }}>City</span> <strong>{player.member?.city || "-"}</strong></div>
                    <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Score</span> <strong>{formatNumber(player.score)}</strong></div>
                    <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Paid</span> <strong>{player.paid ? "Yes" : "No"}</strong></div>
                  </div>
                </article>
              </div>
            )) : (
              <div className="col-12"><p>Belum ada player yang bisa ditampilkan untuk filter gender ini.</p></div>
            )}
          </div>
        </div>
      </section>

      <section id="sessions" className="team-section padding-top tarkam-section">
        <div className="container">
          <SectionHeading eyebrow="Sessions" title={<>Relasi <span>Session</span></>} description="Semua sesi yang terhubung ke Tarkam, termasuk participant, point, dan status." />
          <div className="row">
            {visibleSessions.length ? visibleSessions.map((relation) => {
              const session = relation.session;
              return (
                <div className="col-lg-4 col-md-6 sm-padding" key={relation.id || relation.session_fk}>
                  <article className="galactic-hover-card tarkam-session-card">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                      <div>
                        <h3 style={{ marginBottom: "6px" }}>Session {session?.sesi ?? relation.session_fk ?? "-"}</h3>
                        <div style={{ color: "rgba(255,255,255,0.72)" }}>{statusLabel(session?.status)}</div>
                      </div>
                      <span style={{ padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>{formatNumber(session?.point)}</span>
                    </div>
                    <div style={{ display: "grid", gap: "6px" }}>
                      <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Participant</span> <strong>{session?.participant || "-"}</strong></div>
                      <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Created</span> <strong>{formatDateTime(session?.created_at || relation.created_at)}</strong></div>
                      <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Updated</span> <strong>{formatDateTime(session?.updated_at || relation.updated_at)}</strong></div>
                    </div>
                  </article>
                </div>
              );
            }) : <div className="col-12"><p>Belum ada sesi yang terhubung ke Tarkam ini.</p></div>}
          </div>
        </div>
      </section>

      <section id="timelines" className="team-section padding-top tarkam-section">
        <div className="container">
          <SectionHeading eyebrow="Timeline" title={<>Riwayat <span>Timeline</span></>} description="Timeline menampilkan jejak aktivitas detail, termasuk relasi member, club, dan session." />
          <div className="row">
            {visibleTimelines.length ? visibleTimelines.map((relation) => {
              const timeline = relation.timeline;
              return (
                <div className="col-lg-6 sm-padding" key={relation.id || relation.timeline_fk || relation.session_fk}>
                  <article className="galactic-hover-card tarkam-timeline-card">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                      <div>
                        <h3 style={{ marginBottom: "6px" }}>{timeline?.member?.nickname || timeline?.club?.name || "Tarkam"}</h3>
                        <div style={{ color: "rgba(255,255,255,0.72)" }}>{timeline?.session?.sesi !== undefined ? `Session ${timeline.session.sesi}` : "Timeline Tarkam"}</div>
                      </div>
                      <span style={{ padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>{formatDateTime(timeline?.created_at || relation.created_at)}</span>
                    </div>
                    <p style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.82)" }}>{timeline?.description || "Belum ada deskripsi timeline."}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {timeline?.member?.gender ? <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)" }}>{timeline.member.gender}</span> : null}
                      {timeline?.club?.name ? <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)" }}>{timeline.club.name}</span> : null}
                      {timeline?.session?.status ? <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)" }}>{statusLabel(timeline.session.status)}</span> : null}
                    </div>
                  </article>
                </div>
              );
            }) : <div className="col-12"><p>Belum ada timeline yang terhubung ke Tarkam ini.</p></div>}
          </div>
        </div>
      </section>

      <section id="contests" className="blog-section blog-page padding-top tarkam-section">
        <div className="container">
          <SectionHeading eyebrow="Contests" title={<>Matchup <span>Contest</span></>} description="Kontes dan pemenang ditampilkan sebagai ringkasan terpisah berdasarkan gender." />
          <div className="row">
            {visibleContests.length ? (
              visibleContests.map((contest) => (
                <div className="col-lg-6 sm-padding" key={contest.id || `${contest.team1_fk}-${contest.team2_fk}`}>
                  <article className="galactic-hover-card tarkam-contest-card">
                    <h3 style={{ marginBottom: "8px" }}>{contest.team1?.name || contest.team1_fk || "-"} vs {contest.team2?.name || contest.team2_fk || "-"}</h3>
                    <div style={{ color: "rgba(255,255,255,0.72)", marginBottom: "10px" }}>{contest.gender || "Open"} | Score {contest.score ?? "TBA"}</div>
                    <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Winner</span> <strong>{contest.winnerTeam?.name || "TBA"}</strong></div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12"><p>Belum ada contest yang terhubung ke gender filter ini.</p></div>
            )}
          </div>

          {visibleWinners.length ? (
            <div style={{ marginTop: "24px" }}>
              <SectionHeading eyebrow="Winners" title={<>Daftar <span>Pemenang</span></>} description="Ringkasan pemenang berdasarkan gender dan team yang terhubung ke tarkam." />
              <div className="row">
                {visibleWinners.map((winner) => (
                  <div className="col-lg-4 col-md-6 sm-padding" key={winner.id || winner.nickname}>
                    <article className="galactic-hover-card tarkam-winner-card">
                      <h3 style={{ marginBottom: "8px" }}>{winner.nickname || "Winner"}</h3>
                      <div style={{ color: "rgba(255,255,255,0.72)", marginBottom: "10px" }}>{winner.gender || "Open"} | {winner.team?.name || "Team"}</div>
                      <div><span style={{ color: "rgba(255,255,255,0.60)" }}>Prize</span> <strong>{winner.prize || "-"}</strong></div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {visibleStreamings.length ? (
        <section className="team-section padding-top tarkam-section">
          <div className="container">
            <SectionHeading eyebrow="Live Stream" title={<>Siaran <span>Streaming</span></>} description="Jika Tarkam terhubung ke live stream, semua tautannya akan ditampilkan di sini." />
            <div className="row">
              {visibleStreamings.map((stream) => (
                <div className="col-lg-4 col-md-6 sm-padding" key={stream.id || stream.title}>
                  <article className="galactic-hover-card tarkam-stream-card">
                    <img src={stream.thumbnail || placeholderVideoThumb} alt={stream.title || "Streaming"} className="tarkam-data-card__image" />
                    <h3 style={{ marginBottom: "8px" }}>{stream.title || "Streaming"}</h3>
                    <p style={{ color: "rgba(255,255,255,0.72)" }}>{stream.description || "Tanpa deskripsi."}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {stream.url ? <a className="default-btn" href={stream.url} target="_blank" rel="noreferrer">Open Stream</a> : null}
                      {stream.embed ? <a className="default-btn" href={stream.embed} target="_blank" rel="noreferrer" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}>Open Embed</a> : null}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="blog-section blog-page padding-top tarkam-section">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="post-details">
              <h3 className="comment-title">Komentar Tarkam</h3>
              <DisqusThread
                key={`tarkam-${detail.id || tarkamId}`}
                identifier={`tarkam-${detail.id || tarkamId}`}
                title={detail.title || `Tarkam ${detail.week || "?"}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { TarkamDetailsContent };
