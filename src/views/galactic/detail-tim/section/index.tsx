import { DisqusThread, PageHeader, PlayerCarousel } from "@/galactic/common";
import type { TeamRecord } from "../../shared";

const TeamDetailsContent = ({ record }: { record?: TeamRecord }) => {
  if (!record) {
    return (
      <section className="about-team-section padding-top">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Data tim belum tersedia.</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader className="team-details" title={record.name}>
        <img src={record.logo || placeholderSquad} alt={record.name} />
      </PageHeader>
      <div className="team-details-info">
        <div className="container">
          <div className="team-details-wrap">
            <ul className="social-list">
              <li>Divisi:</li>
              <li><a href="#">{record.gender}</a></li>
            </ul>
            <ul className="team-counter">
              <li className="counter-list"><h3><span className="odometer">{record.wins}</span></h3><h4>Menang</h4></li>
              <li className="counter-list"><h3><span className="odometer">{record.draws}</span></h3><h4>Seri</h4></li>
              <li className="counter-list"><h3><span className="odometer">{record.losses}</span></h3><h4>Kalah</h4></li>
              <li className="counter-list"><h3><span className="odometer">{record.members.length}</span></h3><h4>Pemain</h4></li>
            </ul>
            <ul className="rating">
              <li>Rating:</li>
              {Array.from({ length: record.rating }).map((_, index) => (
                <li key={`team-rating-${record.id}-${index + 1}`}><i className="las la-star" /></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="team-section padding-top">
        <div className="container">
          <div className="section-heading mb-40 text-center">
            <h3>Anggota Tim</h3>
            <h2>Kenalan Sama <span>Roster</span></h2>
            <p>Setiap kartu member di bawah terhubung ke halaman detail player live.</p>
          </div>
          <PlayerCarousel items={record.members} />
        </div>
      </section>
      <section className="blog-section blog-page padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="post-details">
              <h3 className="comment-title">Komentar Tim</h3>
              <DisqusThread
                identifier={`team-${record.id}`}
                title={record.name || "Detail Tim"}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { TeamDetailsContent };
