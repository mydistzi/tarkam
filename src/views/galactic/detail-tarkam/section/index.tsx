import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Api from "@/api";
import "@/assets/css/tarkam-theme.css";
import { DisqusThread, PageHeader, VideoStreemButton } from "@/galactic/common";
import { buildPlayerDetailPath, buildTeamDetailPath, galacticRoutes } from "@/galactic/data";

type GenderFilter = "all" | "male" | "female";
type DetailTab = "overview" | "gender" | "sessions" | "timelines" | "competition";

type ApiEnvelope<T> = {
  data?: T;
};

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
  ((payload as ApiEnvelope<T> | undefined)?.data ?? payload ?? null) as T | null;

const unwrapList = <T,>(payload?: ApiEnvelope<T[]>): T[] =>
  Array.isArray(payload?.data) ? payload.data : [];

const formatDate = (value?: string | null) => {
  if (!value) return "TBA";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(date);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date);
};

const formatNumber = (value?: number | string | null) =>
  new Intl.NumberFormat("id-ID").format(Number(value ?? 0));

const formatCurrency = (value?: number | string | null) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

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

const genderLabel = (gender: GenderFilter) => {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  return "Semua";
};

const matchGender = (value: string | undefined | null, filter: GenderFilter) =>
  filter === "all" || String(value || "").toLowerCase() === filter;

const getTeamMembers = (team?: ApiTeam | null) =>
  [team?.member1, team?.member2, team?.member3].filter((member): member is ApiMember => Boolean(member));

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="tarkam-mini-stat">
    <div className="tarkam-mini-stat__label">{label}</div>
    <div className="tarkam-mini-stat__value">{value}</div>
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
  const [bundle, setBundle] = useState<TarkamBundle>(emptyBundle);
  const [loading, setLoading] = useState(Boolean(tarkamId));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [activeGender, setActiveGender] = useState<GenderFilter>("all");

  useEffect(() => {
    if (!tarkamId) {
      setError("ID Tarkam tidak valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
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

      setBundle({
        detail: detailResult.value,
        teams: teamsResult.status === "fulfilled" ? teamsResult.value : [],
        players: playersResult.status === "fulfilled" ? playersResult.value : [],
        groups: groupsResult.status === "fulfilled" ? groupsResult.value : [],
        contests: contestsResult.status === "fulfilled" ? contestsResult.value : [],
        winners: winnersResult.status === "fulfilled" ? winnersResult.value : [],
        streamings: streamingsResult.status === "fulfilled" ? streamingsResult.value : [],
        sessions: sessionsResult.status === "fulfilled" ? sessionsResult.value : [],
        timelines: timelinesResult.status === "fulfilled" ? timelinesResult.value : [],
      });
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [tarkamId]);

  const detail = bundle.detail;

  const filteredTeams = useMemo(
    () => bundle.teams.filter((team) => matchGender(team.gender, activeGender)),
    [bundle.teams, activeGender],
  );

  const filteredPlayers = useMemo(
    () => bundle.players.filter((player) => matchGender(player.member?.gender, activeGender)),
    [bundle.players, activeGender],
  );

  const filteredGroups = useMemo(
    () => bundle.groups.filter((group) => matchGender(group.gender, activeGender)),
    [bundle.groups, activeGender],
  );

  const filteredContests = useMemo(
    () => bundle.contests.filter((contest) => matchGender(contest.gender, activeGender)),
    [bundle.contests, activeGender],
  );

  const filteredWinners = useMemo(
    () => bundle.winners.filter((winner) => matchGender(winner.gender, activeGender)),
    [bundle.winners, activeGender],
  );

  const title = detail?.title
    ? `${detail.title} (Week ${detail.week || "?"})`
    : `Tarkam Week ${detail?.week || tarkamId || "?"}`;

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
            <p>Menarik overview dan relasi spesifik dari route nested `/tarkams/{tarkamId}/*`.</p>
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
            <Link className="default-btn" to={galacticRoutes.tarkamSchedule}>
              Kembali ke Jadwal Tarkam
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        className="tarkam-page-header"
        infoClassName="tarkam-page-header__info"
        eyebrow="Detail Tarkam"
        title={title}
        description={detail.description || "Lihat detail jadwal, roster, sesi, timeline, pertandingan, dan streaming untuk Tarkam ini."}
      />

      <section className="team-section padding-top tarkam-section">
        <div className="container">
          <div className="tarkam-panel">
            <div className="tarkam-title-line">
              <div>
                <div className="tarkam-eyebrow">Tarkam Week {detail.week || "-"}</div>
                <h3 className="tarkam-title">{detail.title || "Tarkam"}</h3>
              </div>
              <div className="tarkam-badge-row">
                <span className={`tarkam-pill ${statusClass(detail.status)}`}>{statusLabel(detail.status)}</span>
                {detail.location ? <span className="tarkam-badge tarkam-badge--soft">{detail.location}</span> : null}
              </div>
            </div>

            <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.76)", lineHeight: 1.8 }}>
              {detail.description || "Tidak ada deskripsi tambahan untuk Tarkam ini."}
            </p>

            <div className="tarkam-kpi-grid">
              <MiniStat label="Teams" value={formatNumber(detail.teams_count ?? bundle.teams.length)} />
              <MiniStat label="Players" value={formatNumber(detail.players_count ?? bundle.players.length)} />
              <MiniStat label="Groups" value={formatNumber(detail.groups_count ?? bundle.groups.length)} />
              <MiniStat label="Contests" value={formatNumber(detail.contests_count ?? bundle.contests.length)} />
            </div>

            <div className="tarkam-meta-grid">
              <MiniStat label="Winners" value={formatNumber(detail.winners_count ?? bundle.winners.length)} />
              <MiniStat label="Sessions" value={formatNumber(detail.sessions_count ?? bundle.sessions.length)} />
              <MiniStat label="Timelines" value={formatNumber(detail.timelines_count ?? bundle.timelines.length)} />
              <MiniStat label="Streamings" value={formatNumber(detail.streamings_count ?? bundle.streamings.length)} />
            </div>

            <div className="tarkam-meta-grid" style={{ marginTop: "16px" }}>
              <MiniStat label="Pool Male" value={formatCurrency(detail.pool_price_m)} />
              <MiniStat label="Pool Female" value={formatCurrency(detail.pool_price_f)} />
              <MiniStat label="MVP Male" value={detail.mvp_m || "-"} />
              <MiniStat label="MVP Female" value={detail.mvp_f || "-"} />
            </div>

            <div className="tarkam-mini-stat" style={{ marginTop: "16px", color: "rgba(255,255,255,0.72)", display: "grid", gap: "6px" }}>
              {detail.transfer_info ? (
                <div>
                  <strong style={{ color: "#fff" }}>Transfer:</strong> {detail.transfer_info}
                </div>
              ) : null}
              {detail.proof ? (
                <div>
                  <strong style={{ color: "#fff" }}>Proof:</strong>{" "}
                  <a href={`https://wa.me/${detail.proof}`} target="_blank" rel="noreferrer">
                    Buka kontak
                  </a>
                </div>
              ) : null}
              {detail.updated_at || detail.created_at ? (
                <div>
                  <strong style={{ color: "#fff" }}>Updated:</strong> {formatDateTime(detail.updated_at || detail.created_at)}
                </div>
              ) : null}
            </div>

            <div className="tarkam-action-row" style={{ marginTop: "20px" }}>
              <div className="tab-navigation" role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: "12px", borderBottom: "none", paddingBottom: 0 }}>
                {([
                  ["overview", "Overview"],
                  ["gender", "Gender"],
                  ["sessions", "Sessions"],
                  ["timelines", "Timelines"],
                  ["competition", "Competition"],
                ] as const).map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    className={`default-btn${activeTab === tab ? " active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", whiteSpace: "nowrap" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" ? (
              <div className="tarkam-card-grid" style={{ marginTop: "22px" }}>
                <div className="tarkam-gender-card tarkam-gender-card--male">
                  <div className="tarkam-gender-card__head">
                    <div>
                      <div className="tarkam-gender-card__eyebrow tarkam-gender-card__eyebrow--male">Male</div>
                      <h3 style={{ marginBottom: 0 }}>{detail.title || "Tarkam"}</h3>
                    </div>
                  </div>
                  <div className="tarkam-meta-grid">
                    <MiniStat label="Date" value={formatDate(detail.male_date)} />
                    <MiniStat label="Time" value={detail.male_time || "TBA"} />
                    <MiniStat label="Slot" value={formatNumber(detail.male_slot)} />
                    <MiniStat label="Players" value={formatNumber(detail.male_players_count)} />
                    <MiniStat label="Completed" value={formatNumber(detail.male_completed)} />
                    <MiniStat label="MVP" value={detail.mvp_m || "-"} />
                  </div>
                </div>

                <div className="tarkam-gender-card tarkam-gender-card--female">
                  <div className="tarkam-gender-card__head">
                    <div>
                      <div className="tarkam-gender-card__eyebrow tarkam-gender-card__eyebrow--female">Female</div>
                      <h3 style={{ marginBottom: 0 }}>{detail.title || "Tarkam"}</h3>
                    </div>
                  </div>
                  <div className="tarkam-meta-grid">
                    <MiniStat label="Date" value={formatDate(detail.female_date)} />
                    <MiniStat label="Time" value={detail.female_time || "TBA"} />
                    <MiniStat label="Slot" value={formatNumber(detail.female_slot)} />
                    <MiniStat label="Players" value={formatNumber(detail.female_players_count)} />
                    <MiniStat label="Completed" value={formatNumber(detail.female_completed)} />
                    <MiniStat label="MVP" value={detail.mvp_f || "-"} />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "gender" ? (
              <>
                <div className="tarkam-link-row" style={{ marginTop: "22px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {(["all", "male", "female"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`default-btn${activeGender === gender ? " active" : ""}`}
                      onClick={() => setActiveGender(gender)}
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      {genderLabel(gender)}
                    </button>
                  ))}
                </div>

                <div className="row" style={{ marginTop: "8px" }}>
                  <div className="col-lg-4 sm-padding">
                    <article className="galactic-hover-card tarkam-session-card">
                      <h3 style={{ marginBottom: "12px" }}>Groups</h3>
                      {filteredGroups.length ? filteredGroups.map((group) => (
                        <div key={String(group.id)} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                          <span>{group.name || "Group"}</span>
                          <strong>{formatNumber(group.teams_count)}</strong>
                        </div>
                      )) : <p>Belum ada group untuk filter ini.</p>}
                    </article>
                  </div>

                  <div className="col-lg-8 sm-padding">
                    <article className="galactic-hover-card tarkam-session-card">
                      <h3 style={{ marginBottom: "12px" }}>Teams</h3>
                      {filteredTeams.length ? filteredTeams.map((team) => (
                        <div key={String(team.id)} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                            <strong>
                              <Link to={buildTeamDetailPath(team.id || "")}>{team.name || "Team"}</Link>
                            </strong>
                            <span>{team.group?.name || team.gender || "-"}</span>
                          </div>
                          <div style={{ color: "rgba(255,255,255,0.72)" }}>
                            {getTeamMembers(team).map((member) => member.nickname || member.username || "Member").join(", ") || "Belum ada member"}
                          </div>
                        </div>
                      )) : <p>Belum ada team untuk filter ini.</p>}
                    </article>
                  </div>

                  <div className="col-12 sm-padding">
                    <article className="galactic-hover-card tarkam-session-card">
                      <h3 style={{ marginBottom: "12px" }}>Players</h3>
                      <div className="row">
                        {filteredPlayers.length ? filteredPlayers.map((player) => (
                          <div className="col-lg-4 col-md-6 sm-padding" key={String(player.id)}>
                            <div className="tarkam-member-card">
                              <h4 style={{ marginBottom: "6px" }}>
                                <Link to={buildPlayerDetailPath(player.member?.slug || player.member?.id || player.id || "")}>
                                  {player.member?.nickname || player.member?.username || "Player"}
                                </Link>
                              </h4>
                              <div style={{ color: "rgba(255,255,255,0.72)", marginBottom: "8px" }}>
                                {player.member?.club?.name || "-"} | {player.member?.gender || "-"}
                              </div>
                              <div>Score: <strong>{formatNumber(player.score)}</strong></div>
                              <div>Paid: <strong>{player.paid ? "Yes" : "No"}</strong></div>
                            </div>
                          </div>
                        )) : <div className="col-12"><p>Belum ada player untuk filter ini.</p></div>}
                      </div>
                    </article>
                  </div>
                </div>
              </>
            ) : null}

            {activeTab === "sessions" ? (
              <div className="row" style={{ marginTop: "8px" }}>
                {bundle.sessions.length ? bundle.sessions.map((relation) => {
                  const session = relation.session;
                  return (
                    <div className="col-lg-4 col-md-6 sm-padding" key={String(relation.id || relation.session_fk)}>
                      <article className="galactic-hover-card tarkam-session-card">
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                          <div>
                            <h3 style={{ marginBottom: "6px" }}>Session {session?.sesi ?? relation.session_fk ?? "-"}</h3>
                            <div style={{ color: "rgba(255,255,255,0.72)" }}>{statusLabel(session?.status)}</div>
                          </div>
                          <span style={{ padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
                            {formatNumber(session?.point)}
                          </span>
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
            ) : null}

            {activeTab === "timelines" ? (
              <div className="row" style={{ marginTop: "8px" }}>
                {bundle.timelines.length ? bundle.timelines.map((relation) => {
                  const timeline = relation.timeline;
                  return (
                    <div className="col-lg-6 sm-padding" key={String(relation.id || relation.timeline_fk || relation.session_fk)}>
                      <article className="galactic-hover-card tarkam-timeline-card">
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                          <div>
                            <h3 style={{ marginBottom: "6px" }}>{timeline?.member?.nickname || timeline?.club?.name || "Tarkam"}</h3>
                            <div style={{ color: "rgba(255,255,255,0.72)" }}>
                              {timeline?.session?.sesi !== undefined ? `Session ${timeline.session.sesi}` : "Timeline Tarkam"}
                            </div>
                          </div>
                          <span style={{ padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
                            {formatDateTime(timeline?.created_at || relation.created_at)}
                          </span>
                        </div>
                        <p style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.82)" }}>
                          {timeline?.description || "Belum ada deskripsi timeline."}
                        </p>
                      </article>
                    </div>
                  );
                }) : <div className="col-12"><p>Belum ada timeline yang terhubung ke Tarkam ini.</p></div>}
              </div>
            ) : null}

            {activeTab === "competition" ? (
              <>
                <div className="tarkam-link-row" style={{ marginTop: "22px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {(["all", "male", "female"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`default-btn${activeGender === gender ? " active" : ""}`}
                      onClick={() => setActiveGender(gender)}
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      {genderLabel(gender)}
                    </button>
                  ))}
                </div>

                {bundle.streamings.length ? (
                  <div className="row" style={{ marginTop: "8px" }}>
                    {bundle.streamings.map((stream) => {
                      const streamUrl = stream.embed?.trim() || stream.url?.trim() || "";

                      return (
                        <div className="col-lg-4 col-md-6 sm-padding" key={String(stream.id)}>
                          <article className="galactic-hover-card tarkam-stream-card">
                            <h3 style={{ marginBottom: "10px" }}>{stream.title || "Streaming"}</h3>
                            <p style={{ color: "rgba(255,255,255,0.72)", marginBottom: "14px" }}>
                              {stream.description || "Streaming untuk Tarkam ini belum memiliki deskripsi."}
                            </p>
                            {streamUrl ? <VideoStreemButton href={streamUrl} normalizeFacebook /> : <span>Tidak ada tautan stream.</span>}
                          </article>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="row" style={{ marginTop: "8px" }}>
                  <div className="col-lg-7 sm-padding">
                    <article className="galactic-hover-card tarkam-session-card">
                      <h3 style={{ marginBottom: "12px" }}>Contests</h3>
                      {filteredContests.length ? filteredContests.map((contest) => (
                        <div key={String(contest.id)} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          <strong>{contest.team1?.name || "-"} vs {contest.team2?.name || "-"}</strong>
                          <div style={{ color: "rgba(255,255,255,0.72)", marginTop: "6px" }}>
                            {contest.gender || "Open"} | Score {contest.score ?? "TBA"} | Winner {contest.winnerTeam?.name || "TBA"}
                          </div>
                        </div>
                      )) : <p>Belum ada contest untuk filter ini.</p>}
                    </article>
                  </div>

                  <div className="col-lg-5 sm-padding">
                    <article className="galactic-hover-card tarkam-session-card">
                      <h3 style={{ marginBottom: "12px" }}>Winners</h3>
                      {filteredWinners.length ? filteredWinners.map((winner) => (
                        <div key={String(winner.id)} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          <strong>{winner.rank ? `#${winner.rank} ` : ""}{winner.nickname || "Winner"}</strong>
                          <div style={{ color: "rgba(255,255,255,0.72)", marginTop: "6px" }}>
                            {winner.team?.name || "Team"} | {winner.prize || "-"}
                          </div>
                        </div>
                      )) : <p>Belum ada winner untuk filter ini.</p>}
                    </article>
                  </div>
                </div>
              </>
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
