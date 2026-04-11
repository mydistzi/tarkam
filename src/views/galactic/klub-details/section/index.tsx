import { PageHeader, PlayerCarousel } from "@/galactic/common";
import type { PlayerItem } from "@/galactic/data";

type ClubItem = {
  id: number;
  code?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number;
};

type ClubsContentProps = {
  record?: ClubItem;
  members: PlayerItem[];
};

const ClubsContent = ({ record, members }: ClubsContentProps) => {
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

  return (
    <>
      <PageHeader className="team-details" title={record.name || "Detail Klub"}>
        {record.logo ? <img src={record.logo} alt={record.name || "Logo Klub"} /> : null}
      </PageHeader>
      <div className="team-details-info">
        <div className="container">
          <div className="team-details-wrap">
            <ul className="team-counter">
              <li className="counter-list">
                <h3>{members.length}</h3>
                <h4>Anggota</h4>
              </li>
              <li className="counter-list">
                <h3>{record.points ?? 0}</h3>
                <h4>Poin</h4>
              </li>
              <li className="counter-list">
                <h3>{record.level || "-"}</h3>
                <h4>Level</h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="about-team-section padding-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading text-center">
                <h3>Tentang {record.name}</h3>
                <h2>Tentang <span>Klub</span></h2>
                <p>
                  {record.level
                    ? `Klub ${record.name} berada di level ${record.level} dengan ${record.points ?? 0} poin pada klasemen.`
                    : "Profil klub ini ditarik dari data klub live Tarkam."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="team-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Anggota Tim</h3>
            <h2>Kenalan Sama <span>Roster</span></h2>
            <p>Setiap kartu member di bawah terhubung ke halaman detail player live.</p>
          </div>
          <PlayerCarousel items={members} />
        </div>
      </section>
    </>
  );
};

export { ClubsContent }; 
