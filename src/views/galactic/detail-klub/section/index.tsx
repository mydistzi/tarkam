import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, PlayerCarousel } from "@/galactic/common";
import { placeholderSquad } from "@/galactic/placeholders";
import { buildPlayerDetailPath, type ClubItem, type MemberItem, type PlayerItem } from "@/galactic/data";

type ClubsContentProps = {
  record?: ClubItem;
  members: MemberItem[];
  clubWins: number;
  clubLosses: number;
  clubPoints: number;
};

const AnimatedCounter = ({ value, delay = 300 }: { value: number; delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const frameId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);
  const startTime = useRef(0);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;

    if (startValue === endValue) {
      previousValue.current = endValue;
      return;
    }

    const duration = 800;

    const tick = (now: number) => {
      const elapsed = Math.min(now - startTime.current, duration);
      const progress = elapsed / duration;
      const eased = 1 - Math.pow(1 - progress, 2);
      setDisplayValue(Math.round(startValue + (endValue - startValue) * eased));

      if (elapsed < duration) {
        frameId.current = requestAnimationFrame(tick);
      } else {
        previousValue.current = endValue;
      }
    };

    timeoutId.current = window.setTimeout(() => {
      startTime.current = performance.now();
      frameId.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [value, delay]);

  return <span className="odometer">{displayValue}</span>;
};

const mapMemberToPlayerItem = (member: MemberItem): PlayerItem => ({
  id: member.id,
  name: member.name,
  game: member.tier || "Player",
  image: member.image || placeholderSquad,
  speciality: member.role || "",
  role: member.role || "",
  country: member.city || "Indonesia",
  team: member.clubName || "",
  teamLogo: member.clubLogo || placeholderSquad,
  about: member.about || "",
  path: member.path || buildPlayerDetailPath(member.slug || member.id || ""),
});

const ClubsContent = ({ record, members, clubWins, clubLosses, clubPoints }: ClubsContentProps) => {
  const [activeTab, setActiveTab] = useState<"about" | "details">("about");
  const playerItems = useMemo(() => members.map(mapMemberToPlayerItem), [members]);

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
        {record.logo ? <img src={record.logo} alt={record.name || "Logo Klub"} /> : <img src={placeholderSquad} alt="Logo Klub" />}
      </PageHeader>
      <div className="team-details-info">
        <div className="container">
          <div className="team-details-wrap">
            <ul className="social-list">
              <li>Follow:</li>
              <li>
                <a href={record.facebook || "#"}>
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href={record.instagram || "#"}>
                  <i className="fab fa-instagram" />
                </a>
              </li>
              <li>
                <a href={record.tiktok || "#"}>
                  <i className="fab fa-tiktok" />
                </a>
              </li>
            </ul>
            <ul className="team-counter">
              <li className="counter-list">
                <h3>
                  <AnimatedCounter value={clubWins} delay={400} />
                </h3>
                <h4>Menang</h4>
              </li>
              <li className="counter-list">
                <h3>
                  <AnimatedCounter value={clubLosses} delay={400} />
                </h3>
                <h4>Kalah</h4>
              </li>
              <li className="counter-list">
                <h3>
                  <AnimatedCounter value={clubPoints} delay={400} />
                </h3>
                <h4>Poin</h4>
              </li>
              <li className="counter-list">
                <h3>
                  <AnimatedCounter value={members.length} delay={400} />
                </h3>
                <h4>Players</h4>
              </li>
            </ul>
            <ul className="rating">
              <li>Ratings:</li>
              <li>
                <i className="las la-star" />
              </li>
              <li>
                <i className="las la-star" />
              </li>
              <li>
                <i className="las la-star" />
              </li>
              <li>
                <i className="las la-star" />
              </li>
              <li>
                <i className="las la-star" />
              </li>
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
          <PlayerCarousel items={playerItems} />
        </div>
      </section>
      <section className="product-description padding-top">
        <div className="container">
          <ul className="nav tab-navigation" id="product-tab-navigation" role="tablist">
            <li role="presentation">
              <button
                className={activeTab === "about" ? "active" : ""}
                id="about-tab"
                type="button"
                role="tab"
                aria-controls="about"
                aria-selected={activeTab === "about"}
                onClick={() => setActiveTab("about")}
              >
                Deskripsi
              </button>
            </li>
            <li role="presentation">
              <button
                className={activeTab === "details" ? "active" : ""}
                id="details-tab"
                type="button"
                role="tab"
                aria-controls="details"
                aria-selected={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              >
                Info tambahan
              </button>
            </li>
          </ul>
          <div className="tab-content" id="product-tab-content">
            <div
              className={`tab-pane fade description${activeTab === "about" ? " show active" : ""}`}
              id="about"
              role="tabpanel"
              aria-labelledby="about-tab"
            >
              <div className="description-wrap">
                <p>{record.level ? `Level klub: ${record.level}` : "Informasi level klub belum tersedia."}</p>
                <p>{record.points !== undefined ? `Total poin klub: ${record.points}` : "Poin klub belum tersedia."}</p>
                <ul className="description-meta">
                  <li>
                    <span>Kode Klub:</span> {record.code || "-"}
                  </li>
                  <li>
                    <span>Anggota Terdaftar:</span> {record.membersCount ?? members.length}
                  </li>
                  <li>
                    <span>Facebook:</span> {record.facebook ? <a href={record.facebook}>{record.facebook}</a> : "-"}
                  </li>
                  <li>
                    <span>Instagram:</span> {record.instagram ? <a href={record.instagram}>{record.instagram}</a> : "-"}
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`tab-pane fade${activeTab === "details" ? " show active" : ""}`}
              id="details"
              role="tabpanel"
              aria-labelledby="details-tab"
            >
              <div className="table-responsive">
                <table className="table product-table">
                  <thead>
                    <tr>
                      <th scope="col">Label</th>
                      <th scope="col">Informasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Kode Klub</td>
                      <td>{record.code || "-"}</td>
                    </tr>
                    <tr>
                      <td>Nama Klub</td>
                      <td>{record.name || "-"}</td>
                    </tr>
                    <tr>
                      <td>Level</td>
                      <td>{record.level || "-"}</td>
                    </tr>
                    <tr>
                      <td>Poin</td>
                      <td>{record.points ?? "-"}</td>
                    </tr>
                    <tr>
                      <td>Jumlah Anggota</td>
                      <td>{record.membersCount ?? members.length}</td>
                    </tr>
                    <tr>
                      <td>Facebook</td>
                      <td>{record.facebook || "-"}</td>
                    </tr>
                    <tr>
                      <td>Instagram</td>
                      <td>{record.instagram || "-"}</td>
                    </tr>
                    <tr>
                      <td>Tiktok</td>
                      <td>{record.tiktok || "-"}</td>
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
            <h3>Timeline Klub</h3>
            <h2>Perjalanan <span>{record.name}</span> selama musim ini.</h2>
          </div>
          <div className="row cart-body pb-30">
            {record.timeline && record.timeline.length > 0 ? (
              record.timeline.map((entry) => (
                <div className="col-lg-3" key={`${entry.label}-${entry.value}`}>
                  <div className="cart-item">
                    <div className="cart-content">
                      <h3>{entry.label}</h3>
                      <p>{entry.value}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="cart-item">
                  <div className="cart-content">
                    <h3>Data timeline belum tersedia.</h3>
                    <p>Klub belum memiliki entri timeline.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export { ClubsContent }; 
