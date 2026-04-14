import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/galactic/common";
import { placeholderSquad } from "@/galactic/placeholders";
import { useGalacticContent } from "../../shared";
import { Link } from "react-router-dom";

type ClubItem = {
  id: number;
  code?: string;
  name?: string;
  slug?: string;
  logo?: string;
  level?: string;
  points?: number;
};

type ClubsContentProps = {
  clubs: ClubItem[];
};

const ClubsContent = ({ clubs }: ClubsContentProps) => {
  const { playerRecords } = useGalacticContent();
  const sortedClubs = useMemo(
    () => [...clubs].sort((left, right) => (right.points ?? 0) - (left.points ?? 0)),
    [clubs],
  );

  const memberCounts = useMemo(() => {
    const counts = new Map<number, number>();
    playerRecords?.forEach((record) => {
      const clubId = record.club?.id;
      if (clubId != null) {
        counts.set(clubId, (counts.get(clubId) ?? 0) + 1);
      }
    });
    return counts;
  }, [playerRecords]);

  const [visibleCount, setVisibleCount] = useState(5);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(5);
  }, [sortedClubs]);

  useEffect(() => {
    if (!loadMoreRef.current || visibleCount >= sortedClubs.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 5, sortedClubs.length));
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [sortedClubs.length, visibleCount]);

  if (!sortedClubs?.length) {
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

  const visibleClubs = sortedClubs.slice(0, visibleCount);
  const canLoadMore = visibleCount < sortedClubs.length;

  return (
    <>
      <PageHeader
        eyebrow="Klub IDM"
        title="List Klub Terdaftar"
        description="Berikut adalah daftar klub yang terdaftar di platform kami. Klik pada setiap klub \n untuk melihat detail lebih lanjut tentang anggota, prestasi, dan informasi lainnya."
      />
      <section className="cart-section padding-top">
        <div className="container">
          <div className="row cart-header">
            <div className="col-lg-6">Klub</div>
            <div className="col-lg-3">Level</div>
            <div className="col-lg-1">Poin</div>
            <div className="col-lg-2">Kode</div>
          </div>
          {visibleClubs.map((club) => {
            const clubSlug = club.code || String(club.id);
            const memberCount = memberCounts.get(club.id) ?? 0;
            return (
              <div className="row cart-body pb-30" key={club.id}>
                <div className="col-lg-6">
                  <div className="cart-item">
                    {club.logo ? <img src={club.logo} alt={club.name || "Logo Klub"} /> : <img src={placeholderSquad} alt="Logo Klub" />}
                    <div className="cart-content">
                      <h3>
                        <Link to={`/klub/${club.slug}`}>{club.name || "Klub Tanpa Nama"}</Link>
                      </h3>
                      <p>{memberCount > 0 ? `${memberCount} anggota` : "Anggota belum tersedia"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="cart-item">
                    <p>{club.level || "-"}</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="cart-item">
                    <p>{club.points ?? 0}</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="cart-item">
                    <p>{clubSlug}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {canLoadMore && (
            <div className="row justify-content-center mt-40">
              <div className="col-lg-6 text-center">
                <button
                  className="default-btn"
                  type="button"
                  onClick={() => setVisibleCount((count) => Math.min(count + 5, sortedClubs.length))}
                >
                  Muat lebih banyak
                </button>
              </div>
            </div>
          )}

          <div ref={loadMoreRef} />
        </div>
      </section>
    </>
  );
};

export { ClubsContent };
