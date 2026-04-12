import { Link } from "react-router-dom";
import { PageHeader, SectionHeading } from "@/galactic/common";
import { useGalacticContent } from "../../shared";

const TarkamDetailsContent = ({ tarkamId }: { tarkamId?: number }) => {
  const { tarkams, teams } = useGalacticContent();
  const tarkam = tarkamId ? tarkams.find((item) => item.id === tarkamId) : undefined;
  const tarkamTeams = tarkamId
    ? teams.filter((record) => Number(record.team?.tarkam_fk) === tarkamId)
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
            description="Klik nama tim untuk menuju halaman detail tim. Semua data tim diambil dari API tim publik."
          />
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
                          {team.group ? <> | {team.group.name}</> : <> | Belum ada grup</>}
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
    </>
  );
};

export { TarkamDetailsContent };
