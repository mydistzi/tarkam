import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "@/assets/css/club-registry.css";
import { buildClubDetailPath } from "@/galactic/data";
import { placeholderSquad } from "@/galactic/placeholders";
import type { ClubItem } from "@/galactic/data";

type ClubRegistryItem = ClubItem & {
  activeMembersCount?: number;
  sessionCount?: number;
  timelineCount?: number;
};

type ClubsContentProps = {
  clubs: ClubRegistryItem[];
  loading?: boolean;
  error?: string | null;
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

const normalizeSocialUrl = (value?: string) => {
  if (!value?.trim()) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value.replace(/^\/+/, "")}`;
};

const ClubsContent = ({ clubs, loading = false, error = null }: ClubsContentProps) => {
  const sortedClubs = useMemo(
    () => [...clubs].sort((left, right) => (right.points ?? 0) - (left.points ?? 0) || String(left.name || "").localeCompare(String(right.name || ""))),
    [clubs],
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || visibleCount >= sortedClubs.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 6, sortedClubs.length));
        }
      },
      {
        rootMargin: "120px",
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [sortedClubs.length, visibleCount]);

  const totalClubs = sortedClubs.length;
  const totalMembers = sortedClubs.reduce((sum, club) => sum + Number(club.membersCount ?? 0), 0);
  const totalPoints = sortedClubs.reduce((sum, club) => sum + Number(club.points ?? 0), 0);
  const totalSessions = sortedClubs.reduce((sum, club) => sum + Number(club.sessionCount ?? 0), 0);
  const activeClubs = sortedClubs.filter((club) => Number(club.membersCount ?? 0) > 0).length;
  const topClub = sortedClubs[0];
  const visibleClubs = sortedClubs.slice(0, visibleCount);
  const canLoadMore = visibleCount < sortedClubs.length;

  if (loading) {
    return (
      <section className="club-registry-section padding-top">
        <div className="container">
          <div className="club-registry-empty">
            <h2>Memuat direktori klub resmi.</h2>
            <p>Mohon tunggu sejenak, data dari server sedang dipersiapkan.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="club-registry-section padding-top">
        <div className="container">
          <div className="club-registry-empty club-registry-empty--error">
            <h2>Direktori klub belum dapat ditampilkan.</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!sortedClubs.length) {
    return (
      <section className="club-registry-section padding-top">
        <div className="container">
          <div className="club-registry-empty">
            <h2>Belum ada klub yang terdaftar.</h2>
            <p>Data klub resmi akan muncul setelah server mengirimkan daftar yang valid.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="club-registry-hero">
        <div className="container">
          <div className="club-registry-shell">
            <div className="club-registry-copy">
              <p className="club-registry-note">Direktori Klub Tarkam</p>
              <h1>Informasi klub terupdate.</h1>
              <p>
                Setiap entri klub disusun berdasarkan poin, jumlah anggota, serta relasi yang
                tersinkron. Halaman ini berfungsi sebagai rujukan resmi untuk menelusuri profil
                klub, roster, dan statistik utama mereka.
              </p>
              <div className="club-registry-summary">
                <div>
                  <span>Total Klub</span>
                  <strong>{formatNumber(totalClubs)}</strong>
                </div>
                <div>
                  <span>Anggota Terdata</span>
                  <strong>{formatNumber(totalMembers)}</strong>
                </div>
                <div>
                  <span>Klub Aktif</span>
                  <strong>{formatNumber(activeClubs)}</strong>
                </div>
                <div>
                  <span>Total Poin</span>
                  <strong>{formatNumber(totalPoints)}</strong>
                </div>
              </div>
            </div>

            <aside className="club-registry-focus">
              <div className="club-registry-focus__header">
                <span>Klub Teratas</span>
                <h2>{topClub?.name || "Belum tersedia"}</h2>
              </div>
              <div className="club-registry-focus__media">
                <img src={topClub?.logo || placeholderSquad} alt={topClub?.name || "Logo Klub"} />
              </div>
              <ul className="club-registry-focus__meta">
                <li>
                  <span>Kode</span>
                  <strong>{topClub?.code || "-"}</strong>
                </li>
                <li>
                  <span>Level</span>
                  <strong>{topClub?.level || "-"}</strong>
                </li>
                <li>
                  <span>Anggota</span>
                  <strong>{formatNumber(topClub?.membersCount ?? 0)}</strong>
                </li>
                <li>
                  <span>Poin</span>
                  <strong>{formatNumber(topClub?.points ?? 0)}</strong>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="club-registry-section padding-top">
        <div className="container">
          <div className="club-registry-grid">
            {visibleClubs.map((club) => {
              const clubSlug = club.slug || "";
              return (
                <article className="club-registry-card galactic-hover-card" key={club.id}>
                  <div className="club-registry-card__brand">
                    <div className="club-registry-card__logo">
                      <img src={club.logo || placeholderSquad} alt={club.name || "Logo Klub"} />
                    </div>
                    <div>
                      <span>{club.code || "Kode belum tersedia"}</span>
                      <h3>
                        {clubSlug ? (
                          <Link to={buildClubDetailPath(clubSlug)}>{club.name || "Klub Tanpa Nama"}</Link>
                        ) : (
                          club.name || "Klub Tanpa Nama"
                        )}
                      </h3>
                    </div>
                  </div>

                  <p className="club-registry-card__lead">
                    {club.level ? `Level organisasi ${club.level}.` : "Level organisasi belum ditetapkan."}
                  </p>

                  <div className="club-registry-card__stats">
                    <div>
                      <span>{formatNumber(club.membersCount ?? 0)}</span>
                      <small>Anggota</small>
                    </div>
                    <div>
                      <span>{formatNumber(club.activeMembersCount ?? 0)}</span>
                      <small>Aktif</small>
                    </div>
                    <div>
                      <span>{formatNumber(club.sessionCount ?? 0)}</span>
                      <small>Sesi</small>
                    </div>
                    <div>
                      <span>{formatNumber(club.timelineCount ?? 0)}</span>
                      <small>Timeline</small>
                    </div>
                  </div>

                  <div className="club-registry-card__footer">
                    <span>Poin: {formatNumber(club.points ?? 0)}</span>
                    {club.facebook || club.instagram || club.tiktok ? (
                      <div className="club-registry-card__social">
                        {normalizeSocialUrl(club.facebook) ? <a href={normalizeSocialUrl(club.facebook)} target="_blank" rel="noreferrer noopener">Facebook</a> : null}
                        {normalizeSocialUrl(club.instagram) ? <a href={normalizeSocialUrl(club.instagram)} target="_blank" rel="noreferrer noopener">Instagram</a> : null}
                        {normalizeSocialUrl(club.tiktok) ? <a href={normalizeSocialUrl(club.tiktok)} target="_blank" rel="noreferrer noopener">TikTok</a> : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          {canLoadMore ? (
            <div className="club-registry-actions">
              <button
                className="club-registry-load-more"
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + 6, sortedClubs.length))}
              >
                Muat lebih banyak
              </button>
            </div>
          ) : null}

          <div ref={loadMoreRef} />
        </div>
      </section>

      <section className="club-registry-section club-registry-section--footer padding-top">
        <div className="container">
          <div className="club-registry-banner">
            <div>
              <span>Catatan Resmi</span>
              <h2>{totalSessions} sesi klub telah tersinkron pada direktori ini.</h2>
            </div>
            <p>
              Direktori ini dirancang untuk menampilkan status klub secara transparan dan konsisten
              dengan data server terbaru.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export { ClubsContent };
