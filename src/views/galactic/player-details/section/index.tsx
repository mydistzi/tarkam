import { useState } from "react";
import { signImage, usaFlag } from "@/galactic/common";
import type { PlayerRecord } from "../../shared";

const PlayerDetailsContent = ({ record }: { record?: PlayerRecord }) => {
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");
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
  const city = player.country || record.member?.city || "Jakarta";
  const division = record.member?.gender ? `${record.member.gender} Division` : player.role || "Open";
  const status = record.member?.status || (record.player?.paid ? "Aktif" : "Tidak Aktif");

  const normalizeSocialUrl = (value?: string) => {
    if (!value?.trim()) return undefined;
    if (value.startsWith("http")) return value;
    if (value.includes("instagram.com") || value.includes("facebook.com") || value.includes("tiktok.com")) return `https://${value.replace(/^https?:\/\//, "")}`;
    return value;
  };

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: normalizeSocialUrl(record.member?.facebook), label: "Facebook" },
    { icon: "fab fa-instagram", href: normalizeSocialUrl(record.member?.instagram), label: "Instagram" },
    { icon: "fab fa-tiktok", href: normalizeSocialUrl(record.member?.tiktok), label: "TikTok" },
  ].filter((item) => !!item.href);

  return (
    <>
      <section className="page-header team-details player-details">
        <div className="container">
          <div className="page-header-info player-details">
            <div className="player-thumb">
              <img
                src={
                  record.club?.logo ||
                  player.image ||
                  "/assets/images/placeholder-player.png"
                }
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
                  src={
                    record.club?.logo || "/assets/images/placeholder-squad.png"
                  }
                  alt={record.club?.name || player.team || "Independent"}
                />
              </a>
              <h3>
                <a href={`/klub/${clubSlug}`}>
                  {record.club?.name || player.team || "Independent"}
                </a>
              </h3>
            </div>
            <ul className="social-list">
              <li>Follow Me:</li>
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer noopener">
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))
              ) : (
                <li>Tidak ada tautan media sosial.</li>
              )}
            </ul>
            <ul className="player-info">
              <li>
                <div>
                  <img className="flag" src={usaFlag} alt="flag" />{" "}
                  <span>Lokasi</span>
                </div>
                <h4>{city}</h4>
              </li>
              <li>
                <div>
                  <i className="las la-user" />
                  <span>Divisi</span>
                </div>
                <h4>{division}</h4>
              </li>
              <li>
                <div>
                  <i className="las la-star" />
                  <span>Status</span>
                </div>
                <h4>{status}</h4>
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
          <ul
            className="nav tab-navigation"
            id="product-tab-navigation"
            role="tablist"
          >
            <li role="presentation">
              <button
                className={activeTab === "home" ? "active" : ""}
                id="home-tab"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected={activeTab === "home"}
                onClick={() => setActiveTab("home")}
              >
                Deskripsi
              </button>
            </li>
            <li role="presentation">
              <button
                className={activeTab === "profile" ? "active" : ""}
                id="profile-tab"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              >
                Info tambahan
              </button>
            </li>
          </ul>
          <div className="tab-content" id="product-tab-content">
            <div
              className={`tab-pane fade description${activeTab === "home" ? " show active" : ""}`}
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <p>{player.about}</p>
              <ul className="description-meta">
                <li>
                  <span>Tier:</span> {record.member?.tier || "-"}
                </li>
                <li>
                  <span>Alias:</span> {record.alias}
                </li>
                <li>
                  <span>Gender:</span>{" "}
                  {record.member?.gender || player.role || "-"}
                </li>
                <li>
                  <span>Klub:</span> {record.club?.name || "Independent"}
                </li>
                <li>
                  <span>Discord:</span> {record.member?.discord_user_id || "-"}
                </li>
                <li>
                  <span>Telepon:</span> {record.member?.phone_number || record.member?.tunisia_phone || "-"}
                </li>
              </ul>
            </div>
            <div
              className={`tab-pane fade${activeTab === "profile" ? " show active" : ""}`}
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="table-responsive">
                <table className="table product-table">
                  <thead>
                    <tr>
                      <th scope="col">Informasi</th>
                      <th scope="col">Tarkam</th>
                      <th scope="col">Win</th>
                      <th scope="col">Los</th>
                      <th scope="col">MVP</th>
                      <th scope="col">Total Pertandingan</th>
                      <th scope="col">Total Poin</th>
                      <th scope="col">Status</th>
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
                      <td>{status}</td>
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
            <h2>
              Perjalanan <span>{player.name}</span> selama season ini.
            </h2>
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
