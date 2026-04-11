import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/galactic/common";
import { Link } from "react-router-dom";

type ClubItem = {
  id: number;
  code?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number;
};

type ClubsContentProps = {
  clubs: ClubItem[];
};

const ClubsContent = ({ clubs }: ClubsContentProps) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(5);
  }, [clubs]);

  useEffect(() => {
    if (!loadMoreRef.current || visibleCount >= clubs.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 5, clubs.length));
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [clubs.length, visibleCount]);

  if (!clubs?.length) {
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

  const visibleClubs = clubs.slice(0, visibleCount);
  const canLoadMore = visibleCount < clubs.length;

  return (
    <>
      <PageHeader
        eyebrow="List Klub"
        title="Semua Klub yang Terdaftar"
        description="Berikut adalah daftar klub yang terdaftar di platform kami. Klik pada setiap klub untuk melihat detail lebih lanjut tentang anggota, prestasi, dan informasi lainnya."
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
            return (
              <div className="row cart-body pb-30" key={club.id}>
                <div className="col-lg-6">
                  <div className="cart-item">
                    {club.logo ? <img src={club.logo} alt={club.name || "Logo Klub"} /> : <img src="/assets/images/placeholder-squad.png" alt="Logo Klub" />}
                    <div className="cart-content">
                      <h3>
                        <Link to={`/klub/${clubSlug}`}>{club.name || "Klub Tanpa Nama"}</Link>
                      </h3>
                      <p>{club.level ? `Level ${club.level}` : "Level belum ditentukan"}</p>
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
                  onClick={() => setVisibleCount((count) => Math.min(count + 5, clubs.length))}
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
