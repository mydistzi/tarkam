import { Link, useSearchParams } from "react-router-dom";
import { DisqusThread, PageHeader, SectionHeading } from "@/galactic/common";
import { useGalacticContent } from "../../shared";

const TarkamDetailsContent = ({ tarkamId }: { tarkamId?: number }) => {
  const [searchParams] = useSearchParams();
  const genderParam = searchParams.get("gender")?.toLowerCase();
  const genderFilter = genderParam === "male" || genderParam === "female" ? genderParam : "all";
  const { tarkams, teams } = useGalacticContent();
  const tarkam = tarkamId ? tarkams.find((item) => item.id === tarkamId) : undefined;
  const tarkamTeams = tarkamId
    ? teams.filter((record) => {
        const teamTarkamId = record.team?.tarkam_fk ? Number(record.team.tarkam_fk) : NaN;
        return (
          Number.isInteger(teamTarkamId) &&
          teamTarkamId === tarkamId &&
          (genderFilter === "all" || record.gender?.toLowerCase() === genderFilter)
        );
      })
    : [];

  if (!tarkamId || !tarkam) {
    return (
      <section className="matches-section padding-top">
        <div className="container">
          <div className="text-center">
            <h2>Tarkam tidak ditemukan</h2>
            <p>ID Tarkam yang dipilih tidak valid atau tidak tersedia.</p>
            <Link className="default-btn" to="/tarkam-schedule">Kembali ke Jadwal Tarkam</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Detail Tarkam"
        title={tarkam.title ? `${tarkam.title} (Week ${tarkam.week || "?"})` : `Tarkam Week ${tarkam.week || "?"}`}
        description={tarkam.description || "Lihat detail jadwal dan tim yang ikut berpartisipasi pada Tarkam ini."}
      />

      <section className="team-section padding-top">
        <div className="container">
          <SectionHeading
            eyebrow="Tim Peserta"
            title={<>Daftar <span>Tim</span> Tarkam</>}
            description="Klik nama tim untuk menuju halaman detail tim. Gunakan filter gender untuk detail yang lebih spesifik."
          />
          <div style={{ display: 'flex', gap: '10px', margin: '24px 0', flexWrap: 'wrap' }}>
            <Link
              to={`/detail-tarkam/${tarkamId}`}
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
              to={`/detail-tarkam/${tarkamId}?gender=female`}
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
              to={`/detail-tarkam/${tarkamId}?gender=male`}
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
          {/* <div style={{ marginBottom: '24px', color: '#fff' }}>
            Menampilkan tim: <strong>{genderFilter === 'all' ? 'Semua' : genderFilter}</strong>
          </div> */}
          <div className="row">
            {tarkamTeams.length ? (
              tarkamTeams.map((team) => (
                <div className="col-lg-4 col-md-6 sm-padding" key={team.id}>
                  <div className="team-item galactic-hover-card">
                    <div className="team-thumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                      <img src={team.logo || "/assets/images/placeholder-team.png"} alt={team.name} />
                    </div>
                    <div className="team-content">
                      <h3>
                        <Link to={team.teamPath || "/detail-tim"}>
                          {team.name}
                          {team.group ? <> | {team.group.name}</> : null}
                          <> | {team.gender}</>
                        </Link>
                      </h3>
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
      <section className="blog-section blog-page padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="post-details">
              <h3 className="comment-title">Komentar Tarkam</h3>
              <DisqusThread
                key={`tarkam-${tarkam.id}`}
                identifier={`tarkam-${tarkam.id}`}
                title={tarkam.title || `Tarkam ${tarkam.week || "?"}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { TarkamDetailsContent };
