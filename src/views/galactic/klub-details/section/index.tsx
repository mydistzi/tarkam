import { useEffect, useRef } from "react";
import { PageHeader, PlayerCarousel } from "@/galactic/common";
import type { PlayerItem } from "@/galactic/data";

declare global {
  interface Window {
    Odometer?: any;
  }
}

type ClubItem = {
  id: number;
  code?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
};

type ClubsContentProps = {
  record?: ClubItem;
  members: PlayerItem[];
  clubWins: number;
  clubLosses: number;
  clubPoints: number;
};

const OdometerCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const odometerConstructor = window.Odometer;
    if (!odometerConstructor || !ref.current) {
      return;
    }

    const od = new odometerConstructor({
      el: ref.current,
      value: 0,
      format: "(ddd)",
    });

    od.update(value);
  }, [value]);

  return <span ref={ref} className="odometer">0</span>;
};

const ClubsContent = ({ record, members, clubWins, clubLosses, clubPoints }: ClubsContentProps) => {
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
        {record.logo ? <img src={record.logo} alt={record.name || "Logo Klub"} /> : <img src="/assets/images/placeholder-squad.png" alt="Logo Klub" />}
      </PageHeader>
      <div className="team-details-info">
        <div className="container">
          <div className="team-details-wrap">
            <ul className="social-list">
                <li>Follow:</li>
                <li><a href={record.facebook || "#"}><i className="fab fa-facebook-f"></i></a></li>
                <li><a href={record.instagram || "#"}><i className="fab fa-instagram"></i></a></li>
                <li><a href={record.tiktok || "#"}><i className="fab fa-tiktok"></i></a></li>
            </ul>
            <ul className="team-counter">
              <li className="counter-list">
                <h3><OdometerCounter value={clubWins} /></h3>
                <h4>Menang</h4>
              </li>
              <li className="counter-list">
                <h3><OdometerCounter value={clubLosses} /></h3>
                <h4>Kalah</h4>
              </li>
              <li className="counter-list">
                <h3><OdometerCounter value={clubPoints} /></h3>
                <h4>Poin</h4>
              </li>
              <li className="counter-list">
                <h3><OdometerCounter value={members.length ?? 0} /></h3>
                <h4>Players</h4>
              </li>
            </ul>
            <ul className="rating">
                <li>Ratings:</li>
                <li><i className="las la-star"></i></li>
                <li><i className="las la-star"></i></li>
                <li><i className="las la-star"></i></li>
                <li><i className="las la-star"></i></li>
                <li><i className="las la-star"></i></li>
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
