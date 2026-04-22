import { type ComponentType, useRef } from "react";
import { Link } from "react-router-dom";
import CarouselLib, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination as SwiperPagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  placeholderPlayer,
  placeholderSponsor,
  placeholderVideoThumb,
} from "@/galactic/placeholders";
import {
  type PlayerItem,
  type SponsorItem,
  type StreamItem,
} from "@/galactic/data";

const Carousel =
  (CarouselLib as unknown as { default: ComponentType<any> }).default ||
  (CarouselLib as ComponentType<any>);

const cardResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1200 }, items: 3 },
  tablet: { breakpoint: { max: 1199, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 767, min: 0 }, items: 1 },
};

const sponsorResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1200 }, items: 5 },
  tablet: { breakpoint: { max: 1199, min: 768 }, items: 3 },
  mobile: { breakpoint: { max: 767, min: 0 }, items: 2 },
};

const smoothCarouselTransition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";

const getImageSource = (src?: string, fallback?: string): string | undefined => {
  const normalized = src?.trim();
  if (normalized) {
    const isPlaceholderAsset = /\/assets\/images\/placeholder-[\w-]+\.(png|jpe?g|webp)$/i.test(normalized);
    if (isPlaceholderAsset) {
      return fallback?.trim() || undefined;
    }

    return normalized;
  }

  return fallback?.trim() || undefined;
};

const PlaySvg = () => (
  <svg enableBackground="new 0 0 41.999 41.999" version="1.1" viewBox="0 0 41.999 41.999" xmlSpace="preserve">
    <path d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176zM7.5,39.095V2.904l26.239,18.096L7.5,39.095z" />
  </svg>
);

const isFacebookVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  return /(?:facebook\.com|fb\.watch)\/(?:video\.php|watch|plugins\/video\.php|videos?)/i.test(normalized);
};

const getFacebookVideoPostUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  try {
    const parsed = new URL(
      normalized.startsWith("http") ? normalized : `https://${normalized.replace(/^\/+/u, "")}`,
    );
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith("facebook.com") || hostname.endsWith("fb.watch")) {
      if (parsed.pathname.includes("plugins/video.php")) {
        const href = parsed.searchParams.get("href");
        return href ? decodeURIComponent(href) : normalized;
      }

      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return normalized;
  }

  return normalized;
};

const getFacebookEmbedUrl = (url: string) => {
  const postUrl = getFacebookVideoPostUrl(url);
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(postUrl)}&show_text=0&autoplay=1`;
};

const getYouTubeVideoId = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(
      normalized.startsWith("http") ? normalized : `https://${normalized.replace(/^\/+/u, "")}`,
    );
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }
    }
  } catch {
    return "";
  }

  return "";
};

const getExternalVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  if (isFacebookVideoUrl(normalized)) {
    return getFacebookVideoPostUrl(normalized);
  }

  const youtubeId = getYouTubeVideoId(normalized);
  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  return normalized;
};

const getNormalizedVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  if (isFacebookVideoUrl(normalized)) {
    return getFacebookEmbedUrl(normalized);
  }

  const youtubeId = getYouTubeVideoId(normalized);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`;
  }

  return normalized;
};

const CarouselButtonGroup = ({
  next,
  previous,
  className = "",
}: ButtonGroupProps & { className?: string }) => (
  <div className={`galactic-carousel-nav ${className}`.trim()}>
    <button className="swiper-nav swiper-prev" onClick={previous} type="button" aria-label="Previous slide">
      <i className="las la-long-arrow-alt-left" />
    </button>
    <button className="swiper-nav swiper-next" onClick={next} type="button" aria-label="Next slide">
      <i className="las la-long-arrow-alt-right" />
    </button>
  </div>
);

const VideoCardButton = ({ href, normalizeFacebook = false }: { href: string; normalizeFacebook?: boolean }) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;
  const sourceHref = getExternalVideoUrl(href);

  return (
    <button
      className="dl-video-popup play-btn vbox-item"
      data-video-title="Tarkam Highlight Reel"
      data-video-url={normalizedHref}
      data-video-source-url={sourceHref}
      type="button"
    >
      <PlaySvg />
      <div className="ripple" />
    </button>
  );
};

const VideoStreemButton = ({
  href,
  normalizeFacebook = false,
  label = "Watch Stream",
}: {
  href: string;
  normalizeFacebook?: boolean;
  label?: string;
}) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;
  const sourceHref = getExternalVideoUrl(href);

  return (
    <button
      className="dl-video-popup vbox-item fb-video"
      data-video-title={label}
      data-autoplay="true"
      data-mute="false"
      data-allowfullscreen="true"
      data-video-url={normalizedHref}
      data-video-source-url={sourceHref}
      type="button"
    >
      <i className="lab la-youtube" /> {label}
    </button>
  );
};

const WatchLiveGrid = ({ items }: { items: StreamItem[] }) => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const minLoopSlides = 8;
  const loopItems = items.length === 0
    ? []
    : Array.from({ length: Math.max(items.length, minLoopSlides) }, (_, index) => items[index % items.length]);

  return (
    <div className="carousel-wrap watch-carousel-shell">
      <button
        className="swiper-nav swiper-prev watch-live-prev"
        type="button"
        aria-label="Previous slide"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <i className="las la-long-arrow-alt-left" />
      </button>
      <button
        className="swiper-nav swiper-next watch-live-next"
        type="button"
        aria-label="Next slide"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <i className="las la-long-arrow-alt-right" />
      </button>
      <Swiper
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        centeredSlides
        className="watch-carousel swiper-container swiper-coverflow swiper-3d swiper-initialized swiper-horizontal swiper-pointer-events"
        coverflowEffect={{
          depth: 100,
          modifier: 5,
          rotate: 0,
          scale: 1,
          slideShadows: false,
          stretch: 0,
        }}
        effect="coverflow"
        grabCursor
        loop={loopItems.length >= 4}
        loopAdditionalSlides={1}
        loopPreventsSliding={false}
        slidesPerGroup={1}
        modules={[Autoplay, EffectCoverflow]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={2}
        spaceBetween={0}
        speed={650}
      >
        {loopItems.map((stream, index) => (
          <SwiperSlide className="watch-carousel-slide" key={`${stream.title}-${index + 1}`}>
            <img src={getImageSource(stream.image, placeholderVideoThumb)} alt="thumb" />
            <button
              className="dl-video-popup play-btn vbox-item galactic-play-trigger"
              data-video-title={stream.title}
              data-video-url={getNormalizedVideoUrl(stream.videoUrl)}
              data-video-source-url={getExternalVideoUrl(stream.videoUrl)}
              type="button"
            >
              <PlaySvg />
              <div className="ripple" />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const PlayerCard = ({ player }: { player: PlayerItem }) => (
  <div className="team-item galactic-hover-card">
    <div className="team-thumb">
      <img src={getImageSource(player.image, placeholderPlayer)} alt={player.name} />
      <div className="shape-wrap">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>
    </div>
    <div className="team-content">
      <span className="whte-shape" />
      <h3><Link to={player.path || "/detail-player"}>{player.name}</Link></h3>
      <h4>{player.country ? player.country : "Jakarta"}</h4>
    </div>
  </div>
);

const PlayerGrid = ({
  items,
  columnClass = "col-lg-3 col-md-6 sm-padding",
}: {
  items: PlayerItem[];
  columnClass?: string;
}) => (
  <div className="row">
    {items.map((player) => (
      <div className={columnClass} key={`${player.name}-${player.game}`}>
        <PlayerCard player={player} />
      </div>
    ))}
  </div>
);

const PlayerCarousel = ({ items }: { items: PlayerItem[] }) => (
  <div className="outside-spacing galactic-carousel team-carousel">
    <Carousel
      arrows={false}
      autoPlay
      autoPlaySpeed={3200}
      customButtonGroup={<CarouselButtonGroup className="is-team" />}
      infinite
      keyBoardControl
      pauseOnHover
      customTransition={smoothCarouselTransition}
      renderButtonGroupOutside
      responsive={cardResponsive}
      showDots={false}
      swipeable
      transitionDuration={500}
    >
      {items.map((player) => (
        <div className="swiper-slide galactic-carousel-slide" key={`player-carousel-${player.name}`}>
          <PlayerCard player={player} />
        </div>
      ))}
    </Carousel>
  </div>
);

const SponsorCarousel = ({ items = [] }: { items?: SponsorItem[] }) => (
  <div className="galactic-carousel sponsor-carousel">
    <Carousel
      arrows={false}
      autoPlay
      autoPlaySpeed={2500}
      infinite
      keyBoardControl
      pauseOnHover
      customTransition={smoothCarouselTransition}
      responsive={sponsorResponsive}
      showDots={false}
      swipeable
      transitionDuration={500}
    >
      {items.map((sponsor, index) => (
        <div className="swiper-slide galactic-carousel-slide" key={`sponsor-${index + 1}`}>
          <a href={sponsor.url || "#"} rel="noreferrer" target={sponsor.url?.startsWith("http") ? "_blank" : undefined}>
            <img src={getImageSource(sponsor.image, placeholderSponsor)} alt={sponsor.name} />
          </a>
        </div>
      ))}
    </Carousel>
  </div>
);

const SponsorGrid = ({ items = [] }: { items?: SponsorItem[] }) => (
  <div className="sponsor-grid">
    {items.map((sponsor, index) => (
      <div className="sponsor-item" key={`sponsor-grid-${index + 1}`}>
        <a href={sponsor.url || "#"} rel="noreferrer" target={sponsor.url?.startsWith("http") ? "_blank" : undefined}>
          <img src={getImageSource(sponsor.image, placeholderSponsor)} alt={sponsor.name} />
        </a>
      </div>
    ))}
  </div>
);

const SponsorTestimonialSection = ({ items = [] }: { items?: SponsorItem[] }) => (
  <section className="sponsor-testimonial-section padding-top padding-bottom">
    <div className="container">
      <div className="section-heading text-center mb-40 wow fade-in-bottom" data-wow-delay="200ms">
        <h3>Pesan dari Sponsor</h3>
        <h2>Support Dari <span>Sponsor</span> &amp; Pesan Mereka</h2>
        <p>Pesan langsung dari sponsor lengkap dengan detail partner, dukungan jumlah, dan kontak media sosial.</p>
      </div>
      <div className="carousel-wrap">
        <Swiper
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          className="sponsor-testimonial-carousel swiper"
          loop={items.length > 2}
          loopAdditionalSlides={items.length > 2 ? items.length : undefined}
          modules={[Autoplay, SwiperPagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          speed={400}
          breakpoints={{ 767: { slidesPerView: 2, spaceBetween: 30 } }}
        >
          {items.map((sponsor, index) => (
            <SwiperSlide key={`sponsor-testimonial-${index + 1}`}>
              <div className="testimonial-item sponsor-testimonial-card">
                <div className="testi-thumb">
                  <img
                    src={getImageSource(sponsor.memberPicture, placeholderPlayer)}
                    alt={sponsor.memberNickname || sponsor.name}
                  />
                  <h3>{sponsor.name}
                    {sponsor.amount != null ? (
                      <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(sponsor.amount)}</span>
                    ) : null}
                  </h3>
                </div>
                <p className="sponsor-message">{sponsor.message?.trim() || "Sponsor belum meninggalkan pesan apapun untuk saat ini."}</p>
                <div className="sponsor-testimonial-meta">
                  <div className="sponsor-testimonial-social">
                    {sponsor.socialLinks?.map((link, socialIndex) => (
                      <a key={`social-${index}-${socialIndex}`} href={link.href} target="_blank" rel="noreferrer">
                        <i className={link.icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  </section>
);

const TestimonialSection = ({ items = [] }: { items?: { image?: string; name: string; date?: string }[] }) => (
  <section className="testimonial-section padding-top padding-bottom">
    <div className="container">
      <div className="section-heading text-center mb-40 wow fade-in-bottom" data-wow-delay="200ms">
        <h3>Pesan dari Sponsor</h3>
        <h2>Dukung dan selalu supoort <span>Players</span> <br /> Agar Lebih Semangat.</h2>
        <p>Kesuksesan kami bikin solusi bisnis datang dari tim yang jago dan sangat komit.</p>
      </div>
      <div className="carousel-wrap">
        <Swiper
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          className="testimonial-carousel swiper"
          loop
          loopAdditionalSlides={items.length}
          modules={[Autoplay, SwiperPagination]}
          onBeforeInit={(swiper) => {
            (swiper.params as typeof swiper.params & { loopedSlides?: number }).loopedSlides = items.length;
          }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          speed={400}
          breakpoints={{ 767: { slidesPerView: 2, spaceBetween: 30 } }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={`testimonial-${item.name}-${index + 1}`}>
              <div className="testimonial-item">
                <div className="testi-thumb">
                  <img src={getImageSource(item.image)} alt={item.name} />
                  <h3>{item.name} <span>{item.date}</span></h3>
                </div>
                <p>Love this game. With the mortar turret you are able to use just one kind of turret to attack all enemies. Whether they are on ground or in the sky.</p>
                <ul className="rating">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <li key={`${item.name}-testimonial-star-${starIndex + 1}`}><i className="las la-star" /></li>
                  ))}
                </ul>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  </section>
);

export {
  Carousel,
  smoothCarouselTransition,
  CarouselButtonGroup,
  VideoCardButton,
  VideoStreemButton,
  WatchLiveGrid,
  PlayerGrid,
  PlayerCarousel,
  SponsorCarousel,
  SponsorGrid,
  SponsorTestimonialSection,
  TestimonialSection,
};
