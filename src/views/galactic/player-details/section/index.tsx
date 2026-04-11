import { signImage, usaFlag } from "@/galactic/common";
import type { PlayerRecord } from "../../shared";

const PlayerDetailsContent = ({
  record,
}: {
  record?: PlayerRecord;
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
  const alias = record.alias || player.name;
  const clubSlug = record.club?.code || String(record.club?.id || record.id);

  return (
    <>
      <section className="page-header team-details player-details">
        <div className="container">
          <div className="page-header-info player-details">
            <div className="player-thumb">
              <img
                src={record.club?.logo || player.image || "/assets/images/placeholder-player.png"}
                alt={player.name}
              />
            </div>
            <h2>
              {player.name} <span>{alias}</span>
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
              <a href={`/klub/${clubSlug}`}>
                <img
                  src={record.club?.logo || "/assets/images/placeholder-squad.png"}
                  alt={record.club?.name || player.team || "Independent"}
                />
              </a>
              <h3>
                <a href={`/klub/${clubSlug}`}>{record.club?.name || player.team || "Independent"}</a>
              </h3>
            </div>
            <ul className="social-list">
              <li>Follow Me:</li>
              <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="#"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#"><i className="fab fa-youtube"></i></a></li>
            </ul>
            <ul className="player-info">
              <li>
                <div>
                  <img className="flag" src={usaFlag} alt="flag" />{' '}
                  <span>{player.country || "Indonesia"}</span>
                </div>
                <h4>Kota: {player.country || player.team || "Jakarta"}</h4>
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
                <h3>Tentang Pemain</h3>
                <h2>
                  Profil <span>{player.name}</span>
                </h2>
                <p>{player.about}</p>
                <p className="mt-20">
                  Statistik sekarang: {record.wins} win, {record.losses} lose, {' '}
                  {record.points} poin. Klub: {record.club?.name || "Independent"}.
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
          <ul className="nav tab-navigation" id="product-tab-navigation" role="tablist">
            <li role="presentation">
              <button className="active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                Deskripsi
              </button>
            </li>
            <li role="presentation">
              <button id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Info tambahan</button>
            </li>
          </ul>
          <div className="tab-content" id="product-tab-content">
            <div className="tab-pane fade show active description" id="home" role="tabpanel" aria-labelledby="home-tab">
              <div className="description">
                <p>{player.about}</p>
                <ul className="description-meta">
                  <li>
                    <span>Tier:</span> {record.member?.tier || "-"}
                  </li>
                  <li>
                    <span>Alias:</span> {record.alias}
                  </li>
                  <li>
                    <span>Gender:</span> {record.member?.gender || player.role || "-"}
                  </li>
                  <li>
                    <span>Klub:</span> {record.club?.name || "Independent"}
                  </li>
                  <li>
                    <span>Season:</span> {record.joinLabel}
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <div className="table-responsive">
                <table className="table product-table">
                  <thead>
                    <tr>
                      <th scope="col">Informasi</th>
                      <th scope="col">Session</th>
                      <th scope="col">Win</th>
                      <th scope="col">Los</th>
                      <th scope="col">MVP</th>
                      <th scope="col">Total Pertandingan</th>
                      <th scope="col">Total Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{record.alias}</td>
                      <td>{record.joinLabel}</td>
                      <td>{record.wins}</td>
                      <td>{record.losses}</td>
                      <td>{Math.max(0, Math.round(record.points / 10))}</td>
                      <td>{record.member?.t_matches ?? 0}</td>
                      <td>{record.points}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cart-section padding-top">
        <div className="container">
          <div className="section-heading mb-30 text-center">
            <h3>Timeline Karier</h3>
            <h2>Perjalanan <span>{player.name}</span> selama season ini.</h2>
          </div>
          <div className="row cart-body pb-30">
            {record.timeline.map((entry: { label: string; value: string }) => (
              <div className="col-lg-3" key={entry.label}>
                <div className="cart-item">
                  <div className="cart-content">
                    <h3>{entry.label}</h3>
                    <p>{entry.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { PlayerDetailsContent };
