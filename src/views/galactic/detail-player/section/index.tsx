import "@/assets/css/detail-player.css";
import { Link } from "react-router-dom";
import { PageHeader } from "@/galactic/common";
import { buildClubDetailPath, galacticRoutes } from "@/galactic/data";
import { placeholderPlayer, placeholderSquad } from "@/galactic/placeholders";
import type { PlayerRecord } from "../../shared";

const formatDateLabel = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

const formatCoordinate = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(4);
};

const normalizeSocialUrl = (value?: string) => {
  if (!value?.trim()) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value.replace(/^\/+/, "")}`;
};

const getStatusLabel = (value?: string) => {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "active") return "Aktif";
  if (normalized === "inactive") return "Nonaktif";
  if (normalized === "pending") return "Pending";
  if (normalized === "suspended") return "Suspended";

  return value || "Belum diketahui";
};

const getStatusClass = (value?: string) => {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "active") return "is-active";
  if (normalized === "inactive") return "is-idle";
  if (normalized === "pending") return "is-pending";
  if (normalized === "suspended") return "is-danger";

  return "is-idle";
};

const getTierClass = (tier?: string) => {
  const normalized = String(tier || "").trim().toLowerCase();

  if (normalized === "s" || normalized === "ss") return "is-elite";
  if (normalized === "a") return "is-advanced";
  if (normalized === "b") return "is-balanced";
  if (normalized === "c") return "is-core";

  return "is-core";
};

const getWinRate = (wins?: number, losses?: number) => {
  const total = Number(wins ?? 0) + Number(losses ?? 0);
  if (!total) {
    return 0;
  }

  return Math.round((Number(wins ?? 0) / total) * 100);
};

const PlayerDetailsContent = ({ record }: { record?: PlayerRecord }) => {
  if (!record) {
    return (
      <section className="about-team-section padding-top">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Data player belum tersedia.</h2>
          </div>
        </div>
      </section>
    );
  }

  const member = record.member;
  const club = record.club;
  const team = record.team;
  const player = record.item;
  const displayName = member?.nickname || member?.username || record.alias || "Player";
  const handle = record.alias || member?.slug || member?.username || displayName;
  const clubName = club?.name || "Independent";
  const clubPath = club?.slug ? buildClubDetailPath(club.slug) : galacticRoutes.clubs;
  const socialLinks = [
    { icon: "fab fa-facebook-f", label: "Facebook", href: normalizeSocialUrl(member?.facebook) },
    { icon: "fab fa-instagram", label: "Instagram", href: normalizeSocialUrl(member?.instagram) },
    { icon: "fab fa-tiktok", label: "TikTok", href: normalizeSocialUrl(member?.tiktok) },
  ].filter((item) => Boolean(item.href));

  const totalMatches = Number(record.wins ?? 0) + Number(record.losses ?? 0);
  const winRate = getWinRate(record.wins, record.losses);

  const profileRows = [
    { label: "Username", value: member?.username || "-" },
    { label: "Nickname", value: member?.nickname || "-" },
    { label: "Slug", value: member?.slug || "-" },
    { label: "Discord ID", value: member?.discord_user_id || "-" },
    { label: "Phone", value: member?.phone_number || "-" },
    { label: "Tunisia Phone", value: member?.tunisia_phone || "-" },
    { label: "Gender", value: member?.gender || "-" },
    { label: "Tier", value: member?.tier || "-" },
    { label: "City", value: member?.city || "-" },
    { label: "Status", value: getStatusLabel(member?.status) },
    { label: "Club FK", value: member?.club_fk != null ? String(member.club_fk) : "-" },
    { label: "Latitude", value: formatCoordinate(member?.latitude) },
    { label: "Longitude", value: formatCoordinate(member?.longitude) },
    { label: "Created At", value: formatDateLabel(member?.created_at) },
    { label: "Updated At", value: formatDateLabel(member?.updated_at) },
  ];

  const timelineEntries = [...record.timeline].sort((left, right) =>
    String(right.value || "").localeCompare(String(left.value || "")),
  );

  return (
    <>
      <PageHeader
        className="team-details player-details player-page-header"
        infoClassName="player-page-hero"
        eyebrow="Player Profile"
        title={displayName}
        description={`${handle} | ${member?.tier || "Tier belum diatur"} | ${member?.gender || "Gender belum diatur"}`}
      >
        <div className="player-hero-shell">
          <div className="player-hero-portrait">
            <img
              src={member?.picture_url || player.image || placeholderPlayer}
              alt={displayName}
            />
          </div>
          <div className="player-hero-copy">
            <div className="player-hero-badges">
              <span className={`player-pill ${getStatusClass(member?.status)}`}>
                {getStatusLabel(member?.status)}
              </span>
              <span className={`player-pill ${getTierClass(member?.tier)}`}>
                Tier {member?.tier || "-"}
              </span>
              <span className="player-pill is-neutral">{record.joinLabel}</span>
            </div>
            <p>
              Profil ini menampilkan data member resmi berdasarkan field `members`, jadi yang
              muncul adalah identitas, kontak, lokasi, statistik, dan relasi klub/team yang benar.
            </p>
            <div className="player-hero-links">
              <Link className="player-hero-link" to={clubPath}>
                <img src={club?.logo || placeholderSquad} alt={clubName} />
                <div>
                  <span>Club</span>
                  <strong>{clubName}</strong>
                </div>
              </Link>
              <div className="player-hero-link is-static">
                <div>
                  <span>Team</span>
                  <strong>{team?.name || "Tidak terhubung"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      <section className="player-command-section padding-top">
        <div className="container">
          <div className="player-kpi-grid">
            <article className="player-kpi-card galactic-hover-card">
              <span>Win Rate</span>
              <h3>{winRate}%</h3>
              <p>{record.wins} menang dari {totalMatches} pertandingan.</p>
            </article>
            <article className="player-kpi-card galactic-hover-card">
              <span>Win</span>
              <h3>{record.wins}</h3>
              <p>Statistik kemenangan member.</p>
            </article>
            <article className="player-kpi-card galactic-hover-card">
              <span>Lose</span>
              <h3>{record.losses}</h3>
              <p>Statistik kekalahan member.</p>
            </article>
            <article className="player-kpi-card galactic-hover-card">
              <span>Matches</span>
              <h3>{member?.t_matches ?? 0}</h3>
              <p>Total pertandingan yang tercatat.</p>
            </article>
            <article className="player-kpi-card galactic-hover-card">
              <span>Points</span>
              <h3>{record.points}</h3>
              <p>Poin terkini yang dimiliki member.</p>
            </article>
            <article className="player-kpi-card galactic-hover-card">
              <span>Club</span>
              <h3>{club?.code || "N/A"}</h3>
              <p>{clubName}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="player-info-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Member Ledger</h3>
            <h2>
              Semua <span>Field Members</span> dalam satu layar
            </h2>
            <p>
              Bagian ini fokus ke field yang benar-benar tersimpan di tabel members dan relasinya.
            </p>
          </div>

          <div className="player-info-grid">
            {profileRows.map((item) => (
              <article className="player-info-card galactic-hover-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="player-affiliation-grid">
            <article className="player-affiliation-card">
              <div className="player-section-head">
                <span>Club Relation</span>
                <h3>Relasi klub member</h3>
              </div>
              <p>
                {member?.nickname || member?.username || displayName} saat ini terhubung ke club{" "}
                <strong>{clubName}</strong>. Jika club berubah, kartu ini akan ikut memperbarui
                relasinya.
              </p>
              <ul className="player-affiliation-list">
                <li>
                  <span>Club FK</span>
                  <strong>{member?.club_fk != null ? String(member.club_fk) : "-"}</strong>
                </li>
                <li>
                  <span>Team</span>
                  <strong>{team?.name || "-"}</strong>
                </li>
                <li>
                  <span>Group</span>
                  <strong>{team?.group?.name || "-"}</strong>
                </li>
                <li>
                  <span>Tarkam</span>
                  <strong>{team?.tarkam?.week ? `Week ${team.tarkam.week}` : record.joinLabel}</strong>
                </li>
              </ul>
            </article>

            <article className="player-affiliation-card">
              <div className="player-section-head">
                <span>Contact & Social</span>
                <h3>Kontak member resmi</h3>
              </div>
              <ul className="player-contact-list">
                <li>
                  <span>Discord</span>
                  <strong>{member?.discord_user_id || "-"}</strong>
                </li>
                <li>
                  <span>Phone</span>
                  <strong>{member?.phone_number || "-"}</strong>
                </li>
                <li>
                  <span>Tunisia Phone</span>
                  <strong>{member?.tunisia_phone || "-"}</strong>
                </li>
                <li>
                  <span>Lokasi</span>
                  <strong>{member?.city || "-"}</strong>
                </li>
              </ul>
              <div className="player-social-dock">
                {socialLinks.length > 0 ? (
                  socialLinks.map((social) => (
                    <a
                      className="player-social-dock__item"
                      href={social.href}
                      key={social.label}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <i className={social.icon} />
                      <span>{social.label}</span>
                    </a>
                  ))
                ) : (
                  <div className="player-empty-inline">
                    Belum ada tautan sosial media yang tercatat.
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="player-timeline-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Career Timeline</h3>
            <h2>
              Riwayat <span>{displayName}</span>
            </h2>
            <p>
              Timeline ini menampilkan perjalanan member berdasarkan data yang sudah tersimpan di
              sistem, tanpa bergantung ke field tampilan lama.
            </p>
          </div>

          {timelineEntries.length > 0 ? (
            <div className="player-timeline-list">
              {timelineEntries.map((entry, index) => (
                <article
                  className="player-timeline-card galactic-hover-card"
                  key={`${entry.label}-${index}`}
                >
                  <div className="player-timeline-card__rail">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="player-timeline-card__body">
                    <span className="player-timeline-card__eyebrow">{entry.label}</span>
                    <p>{entry.value}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="player-empty-state">
              <h3>Timeline belum tersedia</h3>
              <p>Member ini belum memiliki catatan timeline yang bisa ditampilkan.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export { PlayerDetailsContent };
