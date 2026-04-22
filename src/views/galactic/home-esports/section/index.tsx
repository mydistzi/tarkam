import {
  GameplaySection,
  HomePostGrid,
  JoinMailSection,
  MatchList,
  PromoSection,
  SectionHeading,
  pageBackground,
} from "@/galactic/common";
import { PlayerCarousel, SponsorCarousel } from "@/galactic/media-carousel";
import { TestimonialSection, WatchLiveGrid } from "@/galactic/media-swiper";
import type { MatchItem, PlayerItem, PostItem, SponsorItem, StreamItem } from "@/galactic/data";

type HeroItem = {
  title?: string;
  subtitle?: string;
  image?: string;
};

const HomeEsportsHeroSection = ({ hero, streams }: { hero?: HeroItem; streams: StreamItem[] }) => (
  <section className="hero-section-2" style={pageBackground(hero?.image || streams[0]?.image)}>
    <div className="overlay" />
    <div className="container">
      <div className="hero-content wow fade-in-bottom" data-wow-delay="200ms">
        <h4>{hero?.subtitle || "Nikmati Game-nya"}</h4>
        <h1>{hero?.title || "Game Epik Buat Gamer Sejati!"}</h1>
      </div>
      {streams.length ? (
        <WatchLiveGrid items={streams} />
      ) : (
        <div className="tarkam-empty-block" style={{ marginTop: "20px" }}>
          <h4>Live stream belum tersedia</h4>
          <p>Konten video akan muncul di sini begitu kanal streaming aktif untuk Tarkam saat ini.</p>
        </div>
      )}
    </div>
  </section>
);

const HomeEsportsMatchesSection = ({ items }: { items: MatchItem[] }) => (
  <section className="matches-section padding-bottom">
    <div className="container">
      <SectionHeading
        eyebrow="Pertandingan Mendatang"
        title={<>Pertarungan Ekstrim <br /> Turnamen <span>Master</span></>}
        description={<>Lihat kontes mendatang, pasangan tim, dan jadwal resmi dalam satu tampilan turnamen.</>}
      />
      <MatchList items={items} />
    </div>
  </section>
);

const HomeEsportsSponsorsSection = ({ items }: { items: SponsorItem[] }) => (
  <div className="sponsor-section padding-bottom">
    <div className="container">
      <div className="outside-spacing">
        <SponsorCarousel items={items} />
      </div>
    </div>
  </div>
);

const HomeEsportsPlayersSection = ({ items }: { items: PlayerItem[] }) => (
  <section className="team-section padding-bottom">
    <div className="container">
      <SectionHeading
        eyebrow="Gamer Kita"
        title={<>Kenalan Sama <span>Gamer</span></>}
        description={<>Roster ini menampilkan pemain dan tim resmi yang berkompetisi dalam ekosistem Tarkam.</>}
      />
      <PlayerCarousel items={items} />
    </div>
  </section>
);

const HomeEsportsPromoSection = ({ items }: { items: { image?: string; title: string }[] }) => (
  <section className="promo-section padding-bottom">
    <div className="container">
      <PromoSection items={items} />
    </div>
  </section>
);

const HomeEsportsGameplaySection = ({ items }: { items: StreamItem[] }) => <GameplaySection items={items} />;

const HomeEsportsTestimonialSection = ({ items }: { items: { image?: string; name: string; date?: string }[] }) => (
  <section className="testimonial-wrapper padding-bottom">
    <div className="container">
      <TestimonialSection items={items} />
    </div>
  </section>
);

const HomeEsportsJoinSection = () => (
  <section className="newsletter-section padding-bottom">
    <div className="container">
      <JoinMailSection />
    </div>
  </section>
);

const HomeEsportsBlogSection = ({ items }: { items: PostItem[] }) => (
  <section className="blog-section">
    <div className="container">
      <SectionHeading
        eyebrow="Berita Terbaru"
        title={<>Berita &amp; <span>Headline</span></>}
        description={<>Berita resmi dan pengumuman turnamen disajikan di sini dengan tampilan yang konsisten dan profesional.</>}
      />
      <HomePostGrid items={items} />
    </div>
  </section>
);

export {
  HomeEsportsBlogSection,
  HomeEsportsGameplaySection,
  HomeEsportsHeroSection,
  HomeEsportsJoinSection,
  HomeEsportsMatchesSection,
  HomeEsportsPlayersSection,
  HomeEsportsPromoSection,
  HomeEsportsSponsorsSection,
  HomeEsportsTestimonialSection,
};
