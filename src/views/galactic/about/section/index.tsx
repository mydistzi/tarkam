import { Link } from "react-router-dom";
import { CtaSection, LatestMatchesList, PageHeader, PlayerCarousel, SponsorCarousel, SectionHeading, aboutCharacters } from "@/galactic/common";
import type { MatchItem, PlayerItem, SponsorItem } from "@/galactic/data";

type AboutSectionProps = {
  aboutDescription?: string;
  aboutImage?: string;
  aboutImageAlt?: string;
  matches: MatchItem[];
  players: PlayerItem[];
  sponsors: SponsorItem[];
};

const AboutContent = ({
  aboutDescription,
  aboutImage,
  aboutImageAlt,
  matches,
  players,
  sponsors,
}: AboutSectionProps) => (
  <>
    <PageHeader
      eyebrow="Tentang Kami"
      title="Tentang Galactic Squad"
      description="Halaman galactic ini sekarang nyambung ke sumber data Tarkam, sambil tetap jaga vibe turnamen aslinya."
    />
    <section className="about-section padding">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 sm-padding">
            <div className="about-content">
              <div className="section-heading">
                <h3>Tentang Galactic Squad</h3>
                <h2>Generasi <span>gaming</span> terbaru sudah datang.</h2>
                <p>{aboutDescription || "Turnamen komunitas, streaming, ranking klub, dan cerita roster sekarang tampil dalam satu pengalaman galactic yang nyatu."}</p>
                <p className="mt-20">
                  Semua blok di halaman ini sekarang ambil data dari menu, pengaturan, roster, kontes, dan konten API, bukan lagi template statis.
                </p>
                <Link className="default-btn" to="/contact">Gabung Tim Kita</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 sm-padding">
            <img src={aboutImage || aboutCharacters} alt={aboutImageAlt || "About Tarkam Galactic"} />
          </div>
        </div>
      </div>
    </section>
    <section className="latest-matches padding-bottom">
      <div className="container">
        <div className="section-heading-group mb-40">
          <div className="section-heading">
            <h3>Gameplay Kita</h3>
            <h2>Gameplay <span>Terbaru</span></h2>
            <p>Baris kontes terbaru di bawah dibangun dari data `contests`, `teams`, dan `tarkams` yang nyambung.</p>
          </div>
          <div><Link className="default-btn" to="/upcoming-matches">Lihat Semua Match</Link></div>
        </div>
        <LatestMatchesList items={matches} />
      </div>
    </section>
    <div className="sponsor-section padding-bottom">
      <div className="container">
        <div className="outside-spacing">
          <SponsorCarousel items={sponsors} />
        </div>
      </div>
    </div>
    <section className="team-section padding-bottom">
      <div className="container">
        <SectionHeading
          eyebrow="Our Gamers"
          title={<>Meet Our <span>Gamers</span></>}
          description={<>Rosters below come from the current members, clubs, and active player registrations in the Tarkam system.</>}
        />
        <PlayerCarousel items={players} />
      </div>
    </section>
    <CtaSection />
  </>
);

export { AboutContent };
