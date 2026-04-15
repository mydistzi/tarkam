import "@/assets/css/detail-player.css";
import { Link } from "react-router-dom";
import { PageHeader } from "@/galactic/common";
import { buildClubDetailPath, buildTeamDetailPath, galacticRoutes } from "@/galactic/data";
import { placeholderPlayer, placeholderSquad } from "@/galactic/placeholders";

type ApiSession = { id?: number | string; sesi?: number | string; point?: number | string; participant?: string | null; status?: string | null; created_at?: string; updated_at?: string; };
type ApiTimeline = { id?: number | string; description?: string | null; created_at?: string; updated_at?: string; session?: ApiSession | null; };
type ApiMemberSession = { id?: number | string; created_at?: string; updated_at?: string; session?: ApiSession | null; };
type ApiPlayer = { id?: number | string; paid?: boolean | number | null; score?: number | string | null; created_at?: string; updated_at?: string; tarkam?: { title?: string; week?: string | number; status?: string; points_awarded?: number | string; } | null; };
type ApiTeamMember = { nickname?: string; username?: string; picture_url?: string; };
type ApiTeam = { id?: number | string; name?: string; gender?: string; date?: string; time?: string; member1?: ApiTeamMember | null; member2?: ApiTeamMember | null; member3?: ApiTeamMember | null; group?: { name?: string; tarkam?: { title?: string; week?: string | number; status?: string; } | null; } | null; tarkam?: { title?: string; week?: string | number; status?: string; } | null; };
type ApiPenyawer = { id?: number | string; name?: string; gender?: string; amount?: number | string | null; pesan?: string | null; created_at?: string; updated_at?: string; tarkam?: { title?: string; week?: string | number; status?: string; } | null; };

export type MemberDetailPayload = {
  username?: string; nickname?: string; slug?: string; discord_user_id?: string; phone_number?: string; tunisia_phone?: string; facebook?: string; instagram?: string; tiktok?: string; gender?: string; latitude?: number; longitude?: number; picture_url?: string; tier?: string; city?: string; club_fk?: number | string | null; wins?: number; losses?: number; t_matches?: number; points?: number; status?: string; created_at?: string; updated_at?: string;
  club?: { code?: string; slug?: string; name?: string; logo?: string; };
  alias?: Array<{ alias?: string | null }> | { alias?: string | null } | null;
  players?: ApiPlayer[];
  timelines?: ApiTimeline[];
  memberTimelines?: Array<{ id?: number | string; created_at?: string; updated_at?: string; timeline?: ApiTimeline | null; }>;
  sessions?: ApiMemberSession[];
  teamsAsMember1?: ApiTeam[]; teamsAsMember2?: ApiTeam[]; teamsAsMember3?: ApiTeam[];
  penyawers?: ApiPenyawer[];
};

type Props = { record?: MemberDetailPayload | null; loading?: boolean; error?: string | null; };
type Chip = { label: string; value: string; };

const fmtDate = (value?: string, style: Intl.DateTimeFormatOptions["dateStyle"] = "long") => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: style, timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date);
};
const fmtShort = (value?: string) => fmtDate(value, "medium");
const fmtNum = (value?: number | string | null) => (value === undefined || value === null || value === "" ? "0" : (Number.isNaN(Number(value)) ? String(value) : new Intl.NumberFormat("id-ID").format(Number(value))));
const fmtCoord = (value?: number) => (value === undefined || value === null || Number.isNaN(Number(value)) ? "-" : Number(value).toFixed(4));
const socialUrl = (value?: string) => !value?.trim() ? undefined : value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value.replace(/^\/+/, "")}`;
const statusLabel = (value?: string) => ({ active: "Aktif", inactive: "Nonaktif", pending: "Pending", suspended: "Suspended", completed: "Selesai", complete: "Selesai" } as Record<string, string>)[String(value || "").toLowerCase()] || value || "Belum diketahui";
const statusClass = (value?: string) => ({ active: "is-active", inactive: "is-idle", pending: "is-pending", suspended: "is-danger", completed: "is-complete", complete: "is-complete" } as Record<string, string>)[String(value || "").toLowerCase()] || "is-idle";
const tierClass = (tier?: string) => ({ s: "is-elite", ss: "is-elite", a: "is-advanced", b: "is-balanced", c: "is-core" } as Record<string, string>)[String(tier || "").trim().toLowerCase()] || "is-core";
const genderLabel = (value?: string) => ({ male: "Male", m: "Male", female: "Female", f: "Female" } as Record<string, string>)[String(value || "").toLowerCase()] || value || "-";
const winRate = (wins?: number, losses?: number) => { const total = Number(wins ?? 0) + Number(losses ?? 0); return total ? Math.round((Number(wins ?? 0) / total) * 100) : 0; };
const asArray = <T,>(value?: T[] | null) => (Array.isArray(value) ? value : []);
const aliases = (value?: MemberDetailPayload["alias"]) => !value ? [] : Array.isArray(value) ? value.map((item) => item?.alias?.trim()).filter(Boolean) as string[] : value.alias?.trim() ? [value.alias.trim()] : [];

const PlayerDetailsContent = ({ record, loading = false, error = null }: Props) => {
  const displayName = record?.nickname || record?.username || "Player";
  const handle = record?.slug || record?.username || displayName;
  const clubName = record?.club?.name || "Independent";
  const clubPath = record?.club?.slug ? buildClubDetailPath(record.club.slug) : galacticRoutes.clubs;
  const sessionEntries = asArray(record?.sessions).map((item, index) => ({ key: `session-${item.id ?? index}`, item })).sort((a, b) => String(b.item.session?.created_at || b.item.created_at || "").localeCompare(String(a.item.session?.created_at || a.item.created_at || "")));
  const timelineEntries = [
    ...asArray(record?.memberTimelines).map((item, index) => ({ key: `member-timeline-${item.id ?? index}`, source: "member_timeline", title: item.timeline?.session?.sesi !== undefined ? `Session ${item.timeline.session.sesi}` : "Member timeline", description: item.timeline?.description || "Belum ada deskripsi.", createdAt: item.timeline?.created_at || item.created_at || item.updated_at, meta: [item.timeline?.session?.status ? `Status ${item.timeline.session.status}` : null, item.timeline?.session?.point !== undefined ? `${item.timeline.session.point} point` : null].filter(Boolean) as string[] })),
    ...asArray(record?.timelines).map((item, index) => ({ key: `timeline-${item.id ?? index}`, source: "timeline", title: item.session?.sesi !== undefined ? `Session ${item.session.sesi}` : "Timeline member", description: item.description || "Belum ada deskripsi.", createdAt: item.created_at || item.updated_at, meta: [item.session?.status ? `Status ${item.session.status}` : null, item.session?.point !== undefined ? `${item.session.point} point` : null].filter(Boolean) as string[] })),
  ].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const teamEntries = [
    ...asArray(record?.teamsAsMember1).map((team, index) => ({ key: `m1-${team.id ?? index}`, slot: "member1", team })),
    ...asArray(record?.teamsAsMember2).map((team, index) => ({ key: `m2-${team.id ?? index}`, slot: "member2", team })),
    ...asArray(record?.teamsAsMember3).map((team, index) => ({ key: `m3-${team.id ?? index}`, slot: "member3", team })),
  ].sort((a, b) => String(b.team.date || b.team.time || "").localeCompare(String(a.team.date || a.team.time || "")));
  const playerEntries = asArray(record?.players).sort((a, b) => String(b.created_at || b.updated_at || "").localeCompare(String(a.created_at || a.updated_at || "")));
  const penyawerEntries = asArray(record?.penyawers).sort((a, b) => String(b.created_at || b.updated_at || "").localeCompare(String(a.created_at || a.updated_at || "")));
  const socialLinks = [{ icon: "fab fa-facebook-f", label: "Facebook", href: socialUrl(record?.facebook) }, { icon: "fab fa-instagram", label: "Instagram", href: socialUrl(record?.instagram) }, { icon: "fab fa-tiktok", label: "TikTok", href: socialUrl(record?.tiktok) }].filter((item): item is { icon: string; label: string; href: string } => Boolean(item.href));
  const profileRows: Chip[] = [
    { label: "Username", value: record?.username || "-" }, { label: "Nickname", value: record?.nickname || "-" }, { label: "Slug", value: record?.slug || "-" }, { label: "Discord", value: record?.discord_user_id || "-" }, { label: "Phone", value: record?.phone_number || "-" }, { label: "Tunisia Phone", value: record?.tunisia_phone || "-" }, { label: "Gender", value: genderLabel(record?.gender) }, { label: "Tier", value: record?.tier || "-" }, { label: "City", value: record?.city || "-" }, { label: "Status", value: statusLabel(record?.status) }, { label: "Club FK", value: record?.club_fk != null ? String(record.club_fk) : "-" }, { label: "Latitude", value: fmtCoord(record?.latitude) }, { label: "Longitude", value: fmtCoord(record?.longitude) }, { label: "Created", value: fmtDate(record?.created_at) }, { label: "Updated", value: fmtDate(record?.updated_at) },
  ];
  const totalWins = Number(record?.wins ?? 0); const totalLosses = Number(record?.losses ?? 0); const totalMatches = Number(record?.t_matches ?? 0); const totalPoints = Number(record?.points ?? 0);

  if (loading) return <section className="player-page-section padding-top"><div className="container"><div className="player-loading-card galactic-hover-card"><span className="player-loading-chip">Loading</span><h2>Memuat detail member...</h2><p>Menyiapkan data profil, sesi, dan timeline terbaru.</p></div></div></section>;
  if (error) return <section className="player-page-section padding-top"><div className="container"><div className="player-empty-state player-empty-state--error"><h3>Gagal memuat detail member</h3><p>{error}</p></div></div></section>;
  if (!record) return <section className="player-page-section padding-top"><div className="container"><div className="player-empty-state"><h3>Data member belum tersedia.</h3><p>Slug member ini tidak menghasilkan data yang bisa ditampilkan.</p></div></div></section>;

  return <>
    <PageHeader className="team-details player-details player-page-header" infoClassName="player-page-hero" eyebrow="Player Profile" title={displayName} description={`${handle} | ${record.tier || "Tier belum diatur"} | ${genderLabel(record.gender)}`}>
      <div className="player-hero-shell">
        <div className="player-hero-portrait"><img src={record.picture_url || placeholderPlayer} alt={displayName} /></div>
        <div className="player-hero-copy">
          <div className="player-hero-badges"><span className={`player-pill ${statusClass(record.status)}`}>{statusLabel(record.status)}</span><span className={`player-pill ${tierClass(record.tier)}`}>Tier {record.tier || "-"}</span><span className="player-pill is-neutral">{clubName}</span></div>
          <p>Halaman ini membaca langsung data resmi dari tabel <code>members</code>, lalu memecahnya menjadi profil inti, catatan sesi, serta timeline riwayat member.</p>
          <div className="player-hero-links">
            <Link className="player-hero-link" to={clubPath}><img src={record.club?.logo || placeholderSquad} alt={clubName} /><div><span>Club</span><strong>{clubName}</strong></div></Link>
            <div className="player-hero-link is-static"><div><span>Handle</span><strong>@{handle}</strong></div></div>
          </div>
        </div>
      </div>
    </PageHeader>

    <section className="player-page-section player-stats-section padding-top"><div className="container"><div className="player-kpi-grid">
      <article className="player-kpi-card player-kpi-card--accent galactic-hover-card"><span>Points</span><h3>{fmtNum(totalPoints)}</h3><p>Poin member yang tercatat di database.</p></article>
      <article className="player-kpi-card galactic-hover-card"><span>Win Rate</span><h3>{winRate(totalWins, totalLosses)}%</h3><p>{totalWins} menang dari {totalMatches} pertandingan.</p></article>
      <article className="player-kpi-card galactic-hover-card"><span>Wins</span><h3>{fmtNum(totalWins)}</h3><p>Jumlah kemenangan member.</p></article>
      <article className="player-kpi-card galactic-hover-card"><span>Losses</span><h3>{fmtNum(totalLosses)}</h3><p>Jumlah kekalahan member.</p></article>
      <article className="player-kpi-card galactic-hover-card"><span>Matches</span><h3>{fmtNum(totalMatches)}</h3><p>Total pertandingan yang tercatat.</p></article>
      <article className="player-kpi-card galactic-hover-card"><span>Sessions</span><h3>{fmtNum(sessionEntries.length)}</h3><p>Relasi session aktif untuk member ini.</p></article>
    </div></div></section>

    <section className="player-page-section player-ledger-section padding-top"><div className="container">
      <div className="section-heading mb-40 text-center"><h3>Member Ledger</h3><h2>Semua <span>field members</span> dalam satu tampilan</h2><p>Blok ini mengambil data dari field resmi `members`, tanpa campuran properti generik dari model lain.</p></div>
      <div className="player-ledger-grid">{profileRows.map((item) => <article className="player-info-card galactic-hover-card" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}</div>
      <div className="player-affiliation-grid">
        <article className="player-affiliation-card"><div className="player-section-head"><span>Aliases</span><h3>Nama alternatif member</h3></div>{aliases(record.alias).length > 0 ? <div className="player-chip-list">{aliases(record.alias).map((item) => <span className="player-chip" key={item}>{item}</span>)}</div> : <div className="player-empty-inline">Belum ada alias yang tercatat.</div>}<div className="player-mini-matrix"><div><span>Latitude</span><strong>{fmtCoord(record.latitude)}</strong></div><div><span>Longitude</span><strong>{fmtCoord(record.longitude)}</strong></div><div><span>Created</span><strong>{fmtDate(record.created_at)}</strong></div><div><span>Updated</span><strong>{fmtDate(record.updated_at)}</strong></div></div></article>
        <article className="player-affiliation-card"><div className="player-section-head"><span>Club & Social</span><h3>Relasi klub dan kontak</h3></div><Link className="player-club-link" to={clubPath}><img src={record.club?.logo || placeholderSquad} alt={clubName} /><div><span>Club</span><strong>{clubName}</strong><small>{record.club?.code || "Kode club belum tersedia"}</small></div></Link><ul className="player-contact-list"><li><span>Discord</span><strong>{record.discord_user_id || "-"}</strong></li><li><span>Phone</span><strong>{record.phone_number || "-"}</strong></li><li><span>Tunisia Phone</span><strong>{record.tunisia_phone || "-"}</strong></li><li><span>Location</span><strong>{record.city || "-"}</strong></li></ul><div className="player-social-dock">{socialLinks.length > 0 ? socialLinks.map((social) => <a className="player-social-dock__item" href={social.href} key={social.label} target="_blank" rel="noreferrer noopener"><i className={social.icon} /><span>{social.label}</span></a>) : <div className="player-empty-inline">Belum ada tautan sosial media yang tercatat.</div>}</div></article>
      </div>
    </div></section>

    <section className="player-page-section player-connection-section padding-top"><div className="container">
      <div className="section-heading mb-40 text-center"><h3>Connection Deck</h3><h2>Relasi <span>member</span> yang ikut dibaca</h2><p>Bagian ini menampilkan kaitan member ke players, teams, dan penyawer yang ada di backend.</p></div>
      <div className="player-connection-grid">
        <article className="player-connection-card"><div className="player-section-head"><span>Players</span><h3>Rekaman kompetisi</h3></div>{playerEntries.length > 0 ? <div className="player-connection-list">{playerEntries.map((item, index) => <article className="player-connection-item" key={`${item.id ?? index}`}><div><span>{item.tarkam?.week !== undefined ? `Week ${item.tarkam.week}` : "Tarkam"}</span><strong>{item.tarkam?.title || "Tarkam"}</strong></div><ul><li><span>Score</span><strong>{fmtNum(item.score)}</strong></li><li><span>Paid</span><strong>{item.paid === true || item.paid === 1 ? "Lunas" : "Belum"}</strong></li><li><span>Status</span><strong>{item.tarkam?.status || "-"}</strong></li></ul></article>)}</div> : <div className="player-empty-inline">Belum ada rekaman players.</div>}</article>
        <article className="player-connection-card"><div className="player-section-head"><span>Teams</span><h3>Posisi member dalam team</h3></div>{teamEntries.length > 0 ? <div className="player-connection-list">{teamEntries.map((entry) => <article className="player-team-card" key={entry.key}><div className="player-team-card__top"><div><span>{entry.slot}</span><strong>{entry.team.name || "Team tanpa nama"}</strong></div><Link to={entry.team.id ? buildTeamDetailPath(entry.team.id) : galacticRoutes.clubs}>Detail</Link></div><ul className="player-team-meta"><li><span>Group</span><strong>{entry.team.group?.name || "-"}</strong></li><li><span>Tarkam</span><strong>{entry.team.tarkam?.title ? `${entry.team.tarkam.title} - Week ${entry.team.tarkam.week || "-"}` : entry.team.group?.tarkam?.title ? `${entry.team.group.tarkam.title} - Week ${entry.team.group.tarkam.week || "-"}` : "-"}</strong></li><li><span>Roster</span><strong>{[entry.team.member1, entry.team.member2, entry.team.member3].map((member) => member?.nickname || member?.username).filter(Boolean).join(" • ") || "Roster belum terhubung"}</strong></li></ul></article>)}</div> : <div className="player-empty-inline">Belum ada relasi team yang tercatat.</div>}</article>
        <article className="player-connection-card player-connection-card--wide"><div className="player-section-head"><span>Penyawer</span><h3>Histori sawer member</h3></div>{penyawerEntries.length > 0 ? <div className="player-connection-list player-connection-list--compact">{penyawerEntries.map((item, index) => <article className="player-donation-card" key={`${item.id ?? index}`}><div><span>{item.tarkam?.title || "Tarkam"}</span><strong>{item.name || "Penyawer"}</strong></div><ul><li><span>Amount</span><strong>{fmtNum(item.amount)}</strong></li><li><span>Gender</span><strong>{genderLabel(item.gender)}</strong></li><li><span>Pesan</span><strong>{item.pesan || "-"}</strong></li></ul></article>)}</div> : <div className="player-empty-inline">Belum ada histori penyawer.</div>}</article>
      </div>
    </div></section>

    <section className="player-page-section player-session-section padding-top"><div className="container">
      <div className="section-heading mb-40 text-center"><h3>Session Archive</h3><h2>Semua relasi <span>session</span> member</h2><p>Section ini memisahkan data sesi supaya history member tidak bercampur dengan timeline profil.</p></div>
      {sessionEntries.length > 0 ? <div className="player-session-grid">{sessionEntries.map((entry, index) => <article className="player-session-card galactic-hover-card" key={entry.key}><div className="player-session-card__index"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="player-session-card__body"><div className="player-session-card__headline"><div><span>Session</span><h3>{entry.item.session?.sesi !== undefined ? `Week ${entry.item.session.sesi}` : "Session member"}</h3></div><span className={`player-pill ${statusClass(entry.item.session?.status || undefined)}`}>{statusLabel(entry.item.session?.status || undefined)}</span></div><ul className="player-session-card__meta"><li><span>Point</span><strong>{fmtNum(entry.item.session?.point)}</strong></li><li><span>Participant</span><strong>{entry.item.session?.participant || "-"}</strong></li><li><span>Relation</span><strong>{fmtShort(entry.item.created_at)}</strong></li><li><span>Session</span><strong>{fmtShort(entry.item.session?.created_at)}</strong></li></ul></div></article>)}</div> : <div className="player-empty-state"><h3>Session belum tersedia</h3><p>Member ini belum memiliki relasi session yang bisa ditampilkan.</p></div>}
    </div></section>

    <section className="player-page-section player-timeline-section padding-top"><div className="container">
      <div className="section-heading mb-40 text-center"><h3>Timeline Archive</h3><h2>Riwayat <span>personal member</span></h2><p>Timeline ini menampung history individual member, baik yang datang langsung dari tabel timelines maupun relasi member_timeline.</p></div>
      {timelineEntries.length > 0 ? <div className="player-timeline-list">{timelineEntries.map((entry, index) => <article className="player-timeline-card galactic-hover-card" key={entry.key}><div className="player-timeline-card__rail"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="player-timeline-card__body"><div className="player-timeline-card__top"><span className="player-timeline-card__eyebrow">{entry.source === "member_timeline" ? "Member Timeline" : "Timeline"}</span><span className="player-timeline-card__date">{fmtShort(entry.createdAt)}</span></div><h3>{entry.title}</h3><p>{entry.description}</p>{entry.meta.length > 0 ? <div className="player-chip-list player-chip-list--compact">{entry.meta.map((meta) => <span className="player-chip" key={meta}>{meta}</span>)}</div> : null}</div></article>)}</div> : <div className="player-empty-state"><h3>Timeline belum tersedia</h3><p>Member ini belum memiliki catatan timeline yang bisa ditampilkan.</p></div>}
    </div></section>
  </>;
};

export { PlayerDetailsContent };
