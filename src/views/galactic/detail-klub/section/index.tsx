import "@/assets/css/detail-club.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  OdometerNumber,
  PageHeader,
} from "@/galactic/common";
import { Carousel, CarouselButtonGroup, smoothCarouselTransition } from "@/galactic/media";
import { placeholderPlayer, placeholderSquad } from "@/galactic/placeholders";
import {
  buildPlayerDetailPath,
  type ClubItem,
  type ClubSessionItem,
  type ClubTimelineItem,
  type MemberItem,
} from "@/galactic/data";

type ClubsContentProps = {
  record?: ClubItem;
  members: MemberItem[];
  clubWins: number;
  clubLosses: number;
  clubPoints: number;
};

const memberCarouselResponsive = {
  desktop: {
    breakpoint: { max: 4000, min: 1200 },
    items: 3,
  },
  laptop: {
    breakpoint: { max: 1199, min: 768 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
  },
};

const formatDateLabel = (value?: string) => {
  if (!value) return "-";

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

const formatRewardLabel = (value?: number) => {
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

const normalizeSocialUrl = (value?: string) => {
  if (!value?.trim()) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value.replace(/^\/+/, "")}`;
};

const getStatusLabel = (value?: string) => {
  const normalized = String(value || "unknown").toLowerCase();

  if (normalized === "active") return "Aktif";
  if (normalized === "completed" || normalized === "complete") return "Selesai";
  if (normalized === "pending") return "Menunggu";
  if (normalized === "inactive") return "Nonaktif";
  return value || "Belum ada status";
};

const getStatusClass = (value?: string) => {
  const normalized = String(value || "unknown").toLowerCase();
  if (normalized === "active") return "is-active";
  if (normalized === "completed" || normalized === "complete") return "is-complete";
  if (normalized === "pending") return "is-pending";
  return "is-idle";
};

const formatParticipantSnapshot = (value?: string) => {
  if (!value?.trim()) {
    return "Belum ada snapshot peserta yang tersimpan untuk sesi ini.";
  }

  const compact = value
    .split("|")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" • ");

  return compact || value;
};

const resolveSessionTitle = (session: ClubSessionItem) => {
  if (session.sesi !== undefined && session.sesi !== null) {
    return `Session ${session.sesi}`;
  }

  if (session.sessionFk !== undefined && session.sessionFk !== null) {
    return `Session #${session.sessionFk}`;
  }

  return "Session klub";
};

const resolveTimelineTitle = (item: ClubTimelineItem) =>
  item.title || item.sessionLabel || "Timeline klub";

const MemberCarousel = ({ members }: { members: MemberItem[] }) => {
  if (members.length === 0) {
    return (
      <div className="club-empty-state">
        <h3>Roster belum tersedia</h3>
        <p>Belum ada anggota yang terhubung ke klub ini saat ini.</p>
      </div>
    );
  }

  return (
    <div className="outside-spacing galactic-carousel team-carousel club-member-carousel">
      <Carousel
        arrows={false}
        autoPlay={members.length > 1}
        autoPlaySpeed={3600}
        customButtonGroup={<CarouselButtonGroup className="is-team" />}
        infinite={members.length > 3}
        keyBoardControl
        pauseOnHover
        customTransition={smoothCarouselTransition}
        renderButtonGroupOutside
        responsive={memberCarouselResponsive}
        showDots={false}
        swipeable
        transitionDuration={500}
      >
        {members.map((member) => (
          <div
            className="swiper-slide galactic-carousel-slide"
            key={`${member.slug || member.id}-${member.alias || member.nickname || member.username || "member"}`}
          >
            <article className="club-member-card galactic-hover-card">
              <div className="club-member-card__media">
                <img
                  src={member.pictureUrl || member.image || placeholderPlayer}
                  alt={member.nickname || member.username || "Member"}
                />
                <span className={`club-member-card__status ${getStatusClass(member.status)}`}>
                  {getStatusLabel(member.status)}
                </span>
              </div>
              <div className="club-member-card__body">
                <div className="club-member-card__headline">
                  <h3>
                    <Link
                      to={
                        member.path ||
                        buildPlayerDetailPath(member.slug || member.id || "")
                      }
                    >
                      {member.nickname || member.username || "Member"}
                    </Link>
                  </h3>
                  <p>{member.alias ? `@${member.alias}` : member.username || "Tanpa alias"}</p>
                </div>
                <ul className="club-member-card__meta">
                  <li>
                    <span>Kota</span>
                    <strong>{member.city || "-"}</strong>
                  </li>
                  <li>
                    <span>Tier</span>
                    <strong>{member.tier || "-"}</strong>
                  </li>
                  <li>
                    <span>Gender</span>
                    <strong>{member.gender || "-"}</strong>
                  </li>
                </ul>
                <div className="club-member-card__stats">
                  <div>
                    <span>{member.wins ?? 0}</span>
                    <small>Win</small>
                  </div>
                  <div>
                    <span>{member.losses ?? 0}</span>
                    <small>Lose</small>
                  </div>
                  <div>
                    <span>{member.sessionPoints ?? 0}</span>
                    <small>Poin Sesi</small>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const ClubsContent = ({
  record,
  members,
  clubWins,
  clubLosses,
  clubPoints,
}: ClubsContentProps) => {
  if (!record) {
    return (
      <section className="about-team-section padding-top">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Data klub belum tersedia.</h2>
          </div>
        </div>
      </section>
    );
  }

  const totalMembers = members.length;
  const activeMembers = members.filter(
    (member) => String(member.status || "").toLowerCase() === "active",
  ).length;
  const totalMemberPoints = members.reduce(
    (sum, member) => sum + Number(member.sessionPoints ?? 0),
    0,
  );
  const totalSessionReward = members.reduce(
    (sum, member) => sum + Number(member.sessionReward ?? 0),
    0,
  );
  const averageMemberPoints = totalMembers
    ? Math.round(totalMemberPoints / totalMembers)
    : 0;
  const maleMembers = members.filter(
    (member) => String(member.gender || "").toLowerCase() === "male",
  ).length;
  const femaleMembers = members.filter(
    (member) => String(member.gender || "").toLowerCase() === "female",
  ).length;
  const totalMatches = members.reduce(
    (sum, member) => sum + Number(member.tMatches ?? 0),
    0,
  );
  const socialLinks = [
    {
      icon: "lab la-facebook-f",
      label: "Facebook",
      href: normalizeSocialUrl(record.facebook),
    },
    {
      icon: "lab la-instagram",
      label: "Instagram",
      href: normalizeSocialUrl(record.instagram),
    },
    {
      icon: "lab la-tiktok",
      label: "TikTok",
      href: normalizeSocialUrl(record.tiktok),
    },
  ].filter((item) => Boolean(item.href));
  const sessionEntries = [...(record.sessions || [])].sort((left, right) =>
    String(right.relationCreatedAt || right.createdAt || "").localeCompare(
      String(left.relationCreatedAt || left.createdAt || ""),
    ),
  );
  const [visibleTimelineCount, setVisibleTimelineCount] = useState(3);

  const timelineEntries = [...(record.timeline || [])].sort((left, right) =>
    String(right.createdAt || "").localeCompare(String(left.createdAt || "")),
  );
  const visibleTimelineEntries = timelineEntries.slice(0, visibleTimelineCount);
  const canLoadMoreTimeline = visibleTimelineCount < timelineEntries.length;

  useEffect(() => {
    setVisibleTimelineCount(Math.min(3, timelineEntries.length));
  }, [timelineEntries.length]);

  const handleLoadMore = () => {
    setVisibleTimelineCount((current) =>
      Math.min(current + 3, timelineEntries.length),
    );
  };

  let topMember: MemberItem | undefined;
  for (const member of members) {
    if (!topMember || Number(member.sessionPoints ?? 0) > Number(topMember.sessionPoints ?? 0)) {
      topMember = member;
    }
  }

  const clubInfo = [
    { label: "Nama Klub", value: record.name || "-" },
    { label: "Kode", value: record.code || "-" },
    { label: "Slug", value: record.slug || "-" },
    { label: "Level", value: record.level || "-" },
    { label: "Point Session Klub", value: String(record.sessionPoints ?? 0) },
    { label: "Point Lifetime Klub", value: String(record.lifetimePoints ?? record.points ?? 0) },
    { label: "Reward Session Klub", value: formatRewardLabel(record.sessionReward) },
    { label: "Jumlah Member", value: String(record.membersCount ?? members.length) },
    { label: "Facebook", value: record.facebook || "-" },
    { label: "Instagram", value: record.instagram || "-" },
    { label: "TikTok", value: record.tiktok || "-" },
    { label: "Dibuat", value: formatDateLabel(record.createdAt) },
    { label: "Diperbarui", value: formatDateLabel(record.updatedAt) },
  ];

  return (
    <>
      <PageHeader title={record.name || "Detail Klub"}>
        <img src={record.logo || placeholderSquad} alt={record.name || "Logo Klub"} />
      </PageHeader>

      <section className="club-command-section padding-top">
        <div className="container">
          <div className="club-command-grid">
            <article className="club-orbit-card club-orbit-card--primary">
              <div className="club-orbit-card__glow" />
              <div className="club-orbit-card__brand">
                <div className="club-orbit-card__logo">
                  <img src={record.logo || placeholderSquad} alt={record.name || "Logo Klub"} />
                </div>
                <div>
                  <span className="club-orbit-card__eyebrow">Tarkam Club Profile</span>
                  <h2>{record.name || "Klub Tanpa Nama"}</h2>
                  <p>
                    {record.code ? `${record.code} • ` : ""}
                    {record.level || "Level belum diatur"} • {record.slug || "tanpa-slug"}
                  </p>
                </div>
              </div>
              <div className="club-orbit-card__copy">
                {record.slogan ? <p>{record.slogan}</p> : <p> Basis komando <code>{record.name || "klub ini"}</code> menampilkan seluruh identitas klub, performa roster, relasi sesi, dan history timeline dalam satu layar.</p>}
              </div>
              <div className="club-orbit-card__footer">
                <span className="club-chip">{getStatusLabel(activeMembers > 0 ? "active" : "inactive")}</span>
                <span className="club-chip">Top scorer: {topMember?.nickname || topMember?.username || "-"}</span>
                <span className="club-chip">Update: {formatDateLabel(record.updatedAt)}</span>
              </div>
            </article>

            <div className="club-orbit-card club-orbit-card--secondary">
              <div className="club-section-head">
                <span>Social Dock</span>
                <h3>Jejak klub di jaringan sosial</h3>
              </div>
              {socialLinks.length > 0 ? (
                <div className="club-social-dock">
                  {socialLinks.map((social) => (
                    <a
                      className="club-social-dock__item"
                      href={social.href}
                      key={social.label}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <i className={social.icon} />
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="club-empty-inline">
                  Klub ini belum menyimpan tautan media sosial.
                </div>
              )}

              <div className="club-radar-note">
                <strong>Roster pulse</strong>
                <p>
                  {activeMembers} member aktif dari {totalMembers} total roster, dengan rata-rata{" "}
                  {averageMemberPoints} poin per member.
                </p>
              </div>
            </div>
          </div>

          <div className="club-kpi-grid">
            <div className="club-kpi-card">
              <h3><OdometerNumber value={clubWins} delay={220} /></h3>
              <p>Total Menang</p>
            </div>
            <div className="club-kpi-card">
              <h3><OdometerNumber value={clubLosses} delay={280} /></h3>
              <p>Total Kalah</p>
            </div>
            <div className="club-kpi-card">
              <h3><OdometerNumber value={clubPoints} delay={340} /></h3>
              <p>Point Session Klub</p>
            </div>
            <div className="club-kpi-card">
              <h3>{formatRewardLabel(totalSessionReward)}</h3>
              <p>Reward Session</p>
            </div>
            <div className="club-kpi-card">
              <h3><OdometerNumber value={activeMembers} delay={400} /></h3>
              <p>Member Aktif</p>
            </div>
            <div className="club-kpi-card">
              <h3><OdometerNumber value={maleMembers} delay={460} /></h3>
              <p>Roster Male</p>
            </div>
            <div className="club-kpi-card">
              <h3><OdometerNumber value={femaleMembers} delay={520} /></h3>
              <p>Roster Female</p>
            </div>
          </div>
        </div>
      </section>

      <section className="club-intel-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Club Intel</h3>
            <h2>
              Semua <span>Informasi Klub</span>
            </h2>
            <p>
              Field yang ditampilkan mengikuti informasi data klub yang kami terima saat ini.
            </p>
          </div>

          <div className="club-intel-grid">
            {clubInfo.map((item) => (
              <article className="club-info-card galactic-hover-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="club-story-grid">
            <article className="club-story-panel">
              <div className="club-section-head">
                <span>Roster Summary</span>
                <h3>Ringkasan kekuatan skuad</h3>
              </div>
              <ul className="club-story-list">
                <li>
                  <span>Total Pertandingan</span>
                  <strong>{totalMatches}</strong>
                </li>
                <li>
                  <span>Rata-rata point session member</span>
                  <strong>{averageMemberPoints}</strong>
                </li>
                <li>
                  <span>Top performer session</span>
                  <strong>{topMember?.nickname || topMember?.username || "-"}</strong>
                </li>
                <li>
                  <span>Total reward session</span>
                  <strong>{formatRewardLabel(totalSessionReward)}</strong>
                </li>
              </ul>
            </article>

            <article className="club-story-panel">
              <div className="club-section-head">
                <span>Identity Matrix</span>
                <h3>Identitas klub dalam satu panel</h3>
              </div>
              <p>
                Klub <strong>{record.name || "-"}</strong> memakai kode{" "}
                <strong>{record.code || "-"}</strong> dengan tier organisasi level{" "}
                <strong>{record.level || "-"}</strong>. Slug publiknya adalah{" "}
                <strong>{record.slug || "-"}</strong>.
              </p>
              <p>
                Data ini tersinkron dengan relasi roster, sesi, dan timeline sehingga halaman
                detail bisa berfungsi sebagai pusat navigasi untuk klub.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="club-roster-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Anggota Tim</h3>
            <h2>
              Yuk kenalan dengan Roster <span>{record.name}</span>
            </h2>
            <p>
              Setiap kartu anggota terhubung langsung ke halaman detail player dan menampilkan
              statistik inti roster.
            </p>
          </div>
          <MemberCarousel members={members} />
        </div>
      </section>

      <section className="club-session-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Riwayat Sesi</h3>
            <h2>
              Relasi <span>Sesi Klub</span>
            </h2>
            <p>
              Section ini khusus menampilkan keterhubungan klub pada musim tertentu.
            </p>
          </div>

          <div className="club-session-grid">
            {sessionEntries.length > 0 ? (
              sessionEntries.map((session) => (
                <article
                  className="club-session-card galactic-hover-card"
                  key={`${session.id || session.sessionFk}-${session.relationCreatedAt || session.createdAt || "session"}`}
                >
                  <div className="club-session-card__header">
                    <div>
                      <span className="club-session-card__eyebrow">Session Link</span>
                      <h3>{resolveSessionTitle(session)}</h3>
                    </div>
                    <span className={`club-status-pill ${getStatusClass(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                  </div>
                  <ul className="club-session-card__meta">
                    <li>
                      <span>ID Session</span>
                      <strong>{session.sessionFk ?? "-"}</strong>
                    </li>
                    <li>
                      <span>Poin Session</span>
                      <strong>{session.point ?? 0}</strong>
                    </li>
                    <li>
                      <span>Tercatat Sejak</span>
                      <strong>{formatDateLabel(session.relationCreatedAt || session.createdAt)}</strong>
                    </li>
                    <li>
                      <span>Update Terakhir</span>
                      <strong>{formatDateLabel(session.relationUpdatedAt || session.updatedAt)}</strong>
                    </li>
                  </ul>
                  <div className="club-session-card__snapshot">
                    <span>Snapshot peserta</span>
                    <p>{formatParticipantSnapshot(session.participant)}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="club-empty-state">
                <h3>Belum ada data sesi</h3>
                <p>Relasi pada Musim untuk klub ini belum tersedia atau belum tersinkron.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="club-timeline-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Timeline Klub</h3>
            <h2>
              History <span>{record.name}</span>
            </h2>
            <p>
              Timeline menampung perubahan individual klub dan tidak terhubung dengan musim tertentu.
            </p>
          </div>

          {timelineEntries.length > 0 ? (
            <>
              <div className="club-timeline-list">
                {visibleTimelineEntries.map((entry, index) => (
                  <article
                    className="club-timeline-card galactic-hover-card"
                    key={`${entry.id || resolveTimelineTitle(entry)}-${entry.createdAt || index}`}
                  >
                    <div className="club-timeline-card__rail">
                      <span />
                    </div>
                    <div className="club-timeline-card__body">
                      <div className="club-timeline-card__header">
                        <div>
                          <span className="club-timeline-card__eyebrow">
                            {resolveTimelineTitle(entry)}
                          </span>
                          <h3>{entry.sessionLabel || "History Klub"}</h3>
                        </div>
                        <span className={`club-status-pill ${getStatusClass(entry.sessionStatus)}`}>
                          {getStatusLabel(entry.sessionStatus)}
                        </span>
                      </div>
                      <p>{entry.description}</p>
                      <div className="club-timeline-card__footer">
                        <span>Dibuat: {formatDateLabel(entry.createdAt)}</span>
                        <span>Update: {formatDateLabel(entry.updatedAt)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {canLoadMoreTimeline && (
                <div className="text-center mt-50">
                  <button className="default-btn" type="button" onClick={handleLoadMore}>
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="club-empty-state">
              <h3>Timeline belum tersedia</h3>
              <p>Belum ada history klub yang tercatat di timeline saat ini.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export { ClubsContent };
