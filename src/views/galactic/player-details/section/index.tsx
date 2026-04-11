import { GameplaySection, SponsorCarousel, signImage, usaFlag } from "@/galactic/common";
import type { PlayerRecord } from "../../shared";
import type { SponsorItem, StreamItem } from "@/galactic/data";

const PlayerDetailsContent = ({ record, sponsors, streams }: { record?: PlayerRecord; sponsors: SponsorItem[]; streams: StreamItem[] }) => {
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
              <img src={player.image || "/assets/images/placeholder-player.png"} alt={player.name} />
            </div>
            <h2>{player.name} <span>{player.game}</span></h2>
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
              <a href={player.teamPath || "#"}><img src={player.teamLogo} alt={player.team} /></a>
              <h3><a href={player.teamPath || "#"}>{player.team}</a></h3>
            </div>
            <ul className="social-list">
              <li>Divisi:</li>
              <li><a href="#">{player.role}</a></li>
            </ul>
            <ul className="player-info">
              <li>
                <div>
                  <img className="flag" src={usaFlag} alt="flag" /> <span>{player.country || "Indonesia"}</span>
                </div>
                <h4>Kebangsaan</h4>
              </li>
              <li>
                <div><i className="las la-user" /><span>Aktivitas</span></div>
                <h4>{record.ageLabel}</h4>
              </li>
              <li>
                <div><i className="las la-calendar" /><span>Gabung</span></div>
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
                <h2>Tentang <span>Player</span></h2>
                <p>{player.about}</p>
                <p className="mt-20">
                  Statistik sekarang: {record.wins} win, {record.losses} lose, {record.points} poin.
                  Klub: {record.club?.name || "Independent"}.
                </p>
                <img src={signImage} alt="sign" />
              </div>
            </div>
            <div className="col-md-6 sm-padding">
              <div className="player-thumb">
                <img src={player.image || "/assets/images/placeholder-player.png"} alt={player.name} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GameplaySection title={<>Nonton <span>Gameplay</span> Player</>} items={streams} />
      <div className="sponsor-section">
        <div className="container">
          <div className="outside-spacing">
            <SponsorCarousel items={sponsors} />
          </div>
        </div>
      </div>
    </>
  );
};

export { PlayerDetailsContent };
