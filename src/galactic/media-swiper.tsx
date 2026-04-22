import { useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination as SwiperPagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getExternalVideoUrl, getImageSource, getNormalizedVideoUrl, placeholderPlayer, placeholderVideoThumb, PlaySvg } from "@/galactic/media-helpers";
import { type SponsorItem, type StreamItem } from "@/galactic/data";

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
        breakpoints={{
          0: { slidesPerView: 1.15, spaceBetween: 0 },
          768: { slidesPerView: 1.8, spaceBetween: 0 },
          1200: { slidesPerView: 2.6, spaceBetween: 0 },
        }}
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
        slidesPerView={2.6}
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

export { SponsorTestimonialSection, TestimonialSection, WatchLiveGrid };
