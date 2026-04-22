import { Link } from "react-router-dom";
import { CtaSection, LatestMatchesList, PageHeader, SectionHeading, aboutCharacters } from "@/galactic/common";
import { PlayerCarousel, SponsorCarousel } from "@/galactic/media";
import { galacticRoutes, type MatchItem, type PlayerItem, type SponsorItem } from "@/galactic/data";

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
      description="Pelajari visi, komunitas, dan keunggulan Tarkam sebagai platform turnamen dan layanan esport."
    />
    <section className="about-section padding">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 sm-padding">
            <div className="about-content">
              <div className="section-heading">
                <h3>Tentang Galactic Squad</h3>
                <h2>Generasi <span>gaming</span> terbaru sudah datang.</h2>
                <p>{aboutDescription || "Tarkam menyatukan turnamen komunitas, streaming, peringkat klub, dan cerita roster dalam satu pengalaman gaming yang lengkap."}</p>
                <p className="mt-20">
                  Temukan bagaimana komunitas, event, dan konten resmi tampil bersama dalam platform esport yang profesional.
                </p>
                <Link className="default-btn" to={galacticRoutes.contact}>Gabung Tim Kita</Link>
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
          <div><Link className="default-btn" to={galacticRoutes.matchSchedule}>Lihat Semua Match</Link></div>
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
          eyebrow="Gamer Kita"
          title={<>Kenalan Sama <span>Gamer</span> Kita</>}
          description={<>Roster di bawah ini berasal dari member, klub, dan registrasi tim aktif di sistem Tarkam.</>}
        />
        <PlayerCarousel items={players} />
      </div>
    </section>
    <CtaSection />
  </>
);

export { AboutContent };
