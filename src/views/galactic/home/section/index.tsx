import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HomePostGrid,
  JoinMailSection,
  MatchList,
  PlayerCarousel,
  ProductCarousel,
  SectionHeading,
  SponsorCarousel,
  VideoCardButton,
  WatchLiveGrid,
} from "@/galactic/common";
import type { MatchItem, PlayerItem, PostItem, ProductItem, SponsorItem, StreamItem } from "@/galactic/data";

type HeroItem = {
  title?: string;
  subtitle?: string;
  image?: string;
  image_alt?: string;
  video_url?: string;
};

type HeroSectionProps = {
  hero?: HeroItem;
};

const HomeHeroSection = ({ hero }: HeroSectionProps) => {
  const heroImage = hero?.image ?? "";
  const heroTitle = hero?.title ?? "";
  const heroSubtitle = hero?.subtitle ?? "";
  const heroVideoUrl = hero?.video_url ?? "";

  function replaceWithBr() {
    return heroTitle.replace(/\n/g, "<br />");
  }

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content wow fade-in-bottom" data-wow-delay="200ms">
          <h4>{heroSubtitle}</h4>
          <h1 style={{ whiteSpace: "pre" }} dangerouslySetInnerHTML={{ __html: replaceWithBr() }} />
          <div className="btn-group">
            <Link className="default-btn" to="/contact">
              Gabung Yuk<span />
            </Link>
            <VideoCardButton href={heroVideoUrl} />
          </div>
          <div className="hero-element">
            {heroImage ? <img src={heroImage} alt={hero?.image_alt || heroTitle} /> : null}
            <div className="shape-wrap">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
              <div className="shape shape-4" />
            </div>
            <div className="shape-wrap right">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
              <div className="shape shape-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="gradiant-border" />
    </section>
  );
};

const HomeMatchesSection = ({ items }: { items: MatchItem[] }) => (
  <section className="matches-section padding">
    <div className="container">
      <SectionHeading
        eyebrow="Pertandingan Mendatang"
        title={<>Pertarungan Ekstrim <br /> Turnamen <span>Master</span></>}
        description={<>Jadwal terbaru, skor, dan status pemenang dari turnamen Tarkam langsung tersinkron lewat API.</>}
      />
      <MatchList items={items} />
    </div>
  </section>
);

const HomeStreamsSection = ({ items }: { items: StreamItem[] }) => (
  <section className="watch-live-section padding-bottom">
    <div className="container">
      <SectionHeading
        eyebrow="Nonton Gameplay"
        title={<>Nonton Live <span>Streaming</span></>}
        description={<>Stream andalan tersambung langsung ke endpoint `streamings`, fallback cuma kalau belum ada media hero.</>}
      />
      <WatchLiveGrid items={items} />
    </div>
  </section>
);

const HomePlayersSection = ({ items }: { items: PlayerItem[] }) => {
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female">("all");

  const filteredPlayers = useMemo(() => {
    if (selectedGender === "all") {
      return items;
    }

    return items.filter((player) => player.role?.toLowerCase().includes(selectedGender));
  }, [items, selectedGender]);

  return (
    <section className="team-section padding-bottom">
      <div className="container">
        <SectionHeading
          eyebrow="Gamer Kita"
          title={<><span>Player</span> Minggu Ini</>}
          description={<>Roster aktif dibuat dari player, member, klub, dan tim yang sedang jalan dalam minggu ini.</>}
        />
        <div className="product-shorting">
          <div>
            Menampilkan {filteredPlayers.length} dari {items.length} player
          </div>
          <div>
            <select aria-label="Urutkan toko" className="orderby" defaultValue="date" name="orderby">
                <option className={selectedGender === "all" ? "active" : ""} onSelect={() => setSelectedGender("all")} value="all">Semua</option>
                <option className={selectedGender === "male" ? "active" : ""} onSelect={() => setSelectedGender("male")} value="male">Male</option>
                <option className={selectedGender === "female" ? "active" : ""} onSelect={() => setSelectedGender("female")} value="female">Female</option>
              </select>
          </div>
        </div>
        <PlayerCarousel items={filteredPlayers} />
      </div>
    </section>
  );
};

const HomeJoinSection = () => <JoinMailSection />;

const HomeSponsorsSection = ({ items }: { items: SponsorItem[] }) => (
  <div className="sponsor-section padding-bottom">
    <div className="container">
      <div className="outside-spacing">
        <SponsorCarousel items={items} />
      </div>
    </div>
  </div>
);

const HomeShopSection = ({ items }: { items: ProductItem[] }) => (
  <section className="shop-section padding-bottom">
    <div className="container">
      <SectionHeading
        eyebrow="Toko Gaming Online"
        title={<>Jelajah <span>Perlengkapan</span></>}
        description={<>Barang dan perlengkapan muncul dari API `products`, lengkap dengan kategori, stok, dan thumbnail.</>}
      />
      <ProductCarousel items={items} />
    </div>
  </section>
);

const HomeBlogSection = ({ items }: { items: PostItem[] }) => (
  <section className="blog-section">
    <div className="container">
      <SectionHeading
        eyebrow="Berita Terbaru"
        title={<>Berita &amp; <span>Headline</span></>}
        description={<>Artikel publik dari `tarkam-api` sekarang langsung ngisi halaman ini.</>}
      />
      <HomePostGrid items={items} />
    </div>
  </section>
);

export {
  HomeBlogSection,
  HomeHeroSection,
  HomeJoinSection,
  HomeMatchesSection,
  HomePlayersSection,
  HomeShopSection,
  HomeSponsorsSection,
  HomeStreamsSection,
};
