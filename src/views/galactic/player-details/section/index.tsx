import {
  GameplaySection,
  SponsorCarousel,
  signImage,
  usaFlag,
} from "@/galactic/common";
import type { PlayerRecord } from "../../shared";
import type { SponsorItem, StreamItem } from "@/galactic/data";

const PlayerDetailsContent = ({
  record,
  sponsors,
  streams,
}: {
  record?: PlayerRecord;
  sponsors: SponsorItem[];
  streams: StreamItem[];
}) => {
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

  const player = record.item;

  return (
    <>
      <section className="page-header team-details player-details">
        <div className="container">
          <div className="page-header-info player-details">
            <div className="player-thumb">
              <img
                src={player.image || "/assets/images/placeholder-player.png"}
                alt={player.name}
              />
            </div>
            <h2>
              {player.name} <span>{player.game}</span>
            </h2>
          </div>
        </div>
        <div className="page-header-shape">
          <div className="shape" />
          <div className="shape right" />
          <div className="shape center" />
          <div className="shape center back" />
        </div>
      </section>
      <div className="team-details-info player-details">
        <div className="container">
          <div className="team-details-wrap">
            <div className="player-team">
              <a href={player.teamPath || "#"}>
                <img src={player.teamLogo} alt={player.team} />
              </a>
              <h3>
                <a href={player.teamPath || "#"}>{player.team}</a>
              </h3>
            </div>
            <ul className="social-list">
              <li>Divisi:</li>
              <li>
                <a href="#">{player.role}</a>
              </li>
            </ul>
            <ul className="player-info">
              <li>
                <div>
                  <img className="flag" src={usaFlag} alt="flag" />{" "}
                  <span>{player.country || "Indonesia"}</span>
                </div>
                <h4>Kebangsaan</h4>
              </li>
              <li>
                <div>
                  <i className="las la-user" />
                  <span>Aktivitas</span>
                </div>
                <h4>{record.ageLabel}</h4>
              </li>
              <li>
                <div>
                  <i className="las la-calendar" />
                  <span>Gabung</span>
                </div>
                <h4>{record.joinLabel}</h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="about-team-section padding-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 sm-padding">
              <div className="section-heading">
                <h3>Tentang Gue</h3>
                <h2>
                  Tentang <span>Player</span>
                </h2>
                <p>{player.about}</p>
                <p className="mt-20">
                  Statistik sekarang: {record.wins} win, {record.losses} lose,{" "}
                  {record.points} poin. Klub:{" "}
                  {record.club?.name || "Independent"}.
                </p>
                <img src={signImage} alt="sign" />
              </div>
            </div>
            <div className="col-md-6 sm-padding">
              <div className="player-thumb">
                <img
                  src={player.image || "/assets/images/placeholder-player.png"}
                  alt={player.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="product-description padding-top">
        <div className="container">
          <ul className="nav tab-navigation" role="tablist">
            <li role="presentation">
              <button className="active" type="button">
                Deskripsi
              </button>
            </li>
            <li role="presentation">
              <button type="button">Info tambahan</button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active">
              <div className="description">
                <p>{player.about}</p>
                <ul className="description-meta">
                  <li>
                    <span>Win:</span> {record.wins}
                  </li>
                  <li>
                    <span>Loss:</span> {record.losses}
                  </li>
                  <li>
                    <span>Total Pertandingan:</span>{" "}
                    {record.wins + record.losses}
                  </li>
                  <li>
                    <span>Total Poin:</span> {record.points}
                  </li>
                  <li>
                    <span>Klub:</span> {record.club?.name || "Independent"}
                  </li>
                  <li>
                    <span>Gender:</span> {player.role}
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-pane">
              <div className="description">
                <p>{player.about}</p>
                <ul className="description-meta">
                  <li>
                    <span>Info Tambahan:</span> Belum ada informasi tambahan.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cart-section padding-top">
        <div className="container">
          <div className="row cart-header">
            <div className="col-lg-1">No.</div>
            <div className="col-lg-6">Keterangan</div>
            <div className="col-lg-3">Tanggal</div>
          </div>
          <div className="row cart-body pb-30">
            <div className="col-lg-6">
              <div className="cart-item">
                <div className="cart-content">
                  <h3>Timeline</h3>
                  <p>Keterangan:</p>
                </div>
              </div>
            </div>
            <div className="col-3 col-lg-1">
              <div className="cart-item">
                <p>Kamis, 15 Juni 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { PlayerDetailsContent };
