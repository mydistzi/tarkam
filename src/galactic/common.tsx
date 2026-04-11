import { type CSSProperties, type FormEvent, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import CarouselLib, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { DiscussionEmbed } from "disqus-react";
import { Link, useLocation } from "react-router-dom";
import { Autoplay, EffectCoverflow, Pagination as SwiperPagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import clickAudio from "@/assets/audio/click.wav";
import aboutCharacters from "@/assets/images/about-characters.png";
import comment1 from "@/assets/images/comment-1.png";
import comment2 from "@/assets/images/comment-2.png";
import comment3 from "@/assets/images/comment-3.png";
import signImage from "@/assets/images/sign.png";
import usaFlag from "@/assets/images/usa-flag.svg";
import SEO from "@/components/SEO";
import {
  brand,
  faqs,
  type GalacticMenuItem,
  type MatchItem,
  type PlayerItem,
  type PostItem,
  type ProductItem,
  type SponsorItem,
  type StreamItem,
} from "@/galactic/data";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Carousel = (CarouselLib as unknown as { default: React.ComponentType<any> }).default || (CarouselLib as React.ComponentType<any>);
const getImageSource = (src?: string, fallback?: string): string | undefined => {
  const normalized = src?.trim();
  if (normalized) {
    return normalized;
  }
  return fallback?.trim() || undefined;
};
type PageShellProps = {
  title: string;
  description?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  articleTag?: string[];
  children: ReactNode;
};
type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  infoClassName?: string;
  meta?: ReactNode;
  children?: ReactNode;
};
type SectionHeadingProps = {
  eyebrow: string;
  title: ReactElement;
  description: ReactNode;
};
type MenuListProps = {
  items: GalacticMenuItem[];
  currentPath: string;
  isMobile: boolean;
  openKeys: string[];
  onToggle: (key: string) => void;
};
type GalacticChromeProps = {
  children: ReactNode;
  menuItems?: GalacticMenuItem[];
  logoUrl?: string;
};
type FooterLinkItem = {
  label: string;
  path: string;
  external?: boolean;
};
type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  description?: string;
  socialLinks?: Array<{ icon: string; label: string; href: string }>;
  usefulLinks?: FooterLinkItem[];
  contact?: {
    location?: string;
    email?: string;
    phone?: string;
  };
};
type VideoModalState = {
  title: string;
  url: string;
};
type WowInstance = {
  init: () => void;
  sync?: () => void;
};
declare global {
  interface Window {
    WOW?: new (options?: Record<string, unknown>) => WowInstance;
  }
}
const DISQUS_SHORTNAME = import.meta.env.VITE_DISQUS_SHORTNAME || "tarkam";

type DisqusThreadProps = {
  identifier: string;
  title: string;
  url?: string;
};

const DisqusThread = ({ identifier, title, url }: DisqusThreadProps) => {
  if (!DISQUS_SHORTNAME || typeof window === "undefined") {
    return null;
  }

  const pageUrl = url || window.location.href;

  return (
    <div className="disqus-thread">
      <DiscussionEmbed
        shortname={DISQUS_SHORTNAME}
        config={{
          url: pageUrl,
          identifier,
          title,
        }}
      />
    </div>
  );
};

const videoHref = "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/chandra.albaz.9/videos/756597290539585/?idorvanity=1077594326683243";
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
const templateHeaderDescription = (
  <>
    Kesuksesan kami bikin solusi bisnis datang dari tim yang jago dan sangat komit.
  </>
);
const pageBackground = (image = brand.background): CSSProperties => ({
  backgroundImage: `linear-gradient(rgba(12, 12, 53, 0.78), rgba(12, 12, 53, 0.88)), url(${image})`,
  backgroundPosition: "center center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});
const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
const getMenuPaths = (item: GalacticMenuItem): string[] => {
  const directPath = item.path ? [item.path] : [];
  const childPaths = item.children ? item.children.flatMap(getMenuPaths) : [];
  return [...directPath, ...childPaths];
};
const isMenuActive = (item: GalacticMenuItem, pathname: string) =>
  getMenuPaths(item).some((path) => path === pathname);
const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};
const PlaySvg = () => (
  <svg enableBackground="new 0 0 41.999 41.999" version="1.1" viewBox="0 0 41.999 41.999" xmlSpace="preserve">
    <path d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176zM7.5,39.095V2.904l26.239,18.096L7.5,39.095z" />
  </svg>
);
const toEmbedUrl = (url: string) => {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  return url;
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
const VideoModal = ({ video, onClose }: { video: VideoModalState | null; onClose: () => void }) => {
  if (!video) {
    return null;
  }
  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal" onClick={(event) => event.stopPropagation()}>
        <button className="video-modal-close" type="button" aria-label="Close video" onClick={onClose}>
          ×
        </button>
        <div className="video-modal-content">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            src={toEmbedUrl(video.url)}
            title={video.title}
          />
        </div>
      </div>
    </div>
  );
};
const PageShell = ({
  title,
  description = brand.description,
  type = "website",
  image = brand.logo,
  articleTag = [],
  children,
}: PageShellProps) => (
  <>
    <SEO
      title={title}
      description={description}
      image={image}
      type={type}
      siteName={brand.name}
      author={brand.name}
      articleTag={articleTag}
    />
    {children}
  </>
);
const SectionHeading = ({ eyebrow, title, description }: SectionHeadingProps) => (
  <div className="section-heading mb-40 text-center wow fade-in-bottom">
    <h3>{eyebrow}</h3>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);
const PageHeader = ({
  eyebrow,
  title,
  description,
  className = "",
  infoClassName = "",
  meta,
  children,
}: PageHeaderProps) => (
  <section className={`page-header ${className}`.trim()}>
    <div className="container">
      <div className={`page-header-info ${infoClassName}`.trim()}>
        {children}
        {eyebrow ? <h4>{eyebrow}</h4> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        {meta}
      </div>
    </div>
    <div className="page-header-shape">
      <div className="shape" />
      <div className="shape right" />
      <div className="shape center" />
      <div className="shape center back" />
    </div>
  </section>
);
const SocialLinks = () => (
  <ul className="social-list">
    {brand.socialLinks.map((item) => (
      <li key={item.label}>
        <a href={item.href} aria-label={item.label}>
          <i className={item.icon} />
        </a>
      </li>
    ))}
  </ul>
);
const MenuList = ({ items, currentPath, isMobile, openKeys, onToggle }: MenuListProps) => (
  <ul className="nav-menu">
    {items.map((item) => {
      const key = item.label;
      const active = isMenuActive(item, currentPath);
      const hasChildren = Boolean(item.children?.length);
      const firstChildPath = item.children?.[0]?.path ?? item.path ?? "#";
      return (
        <li
          className={`${active ? "active " : ""}${hasChildren ? "dropdown_menu" : ""}`.trim()}
          key={key}
        >
          {item.path || hasChildren ? (
            <Link
              to={firstChildPath}
              onClick={(event) => {
                if (isMobile && hasChildren) {
                  event.preventDefault();
                  onToggle(key);
                }
              }}
            >
              {item.label}
              {hasChildren ? <span /> : null}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {hasChildren ? (
            <>
              <ul style={isMobile && openKeys.includes(key) ? { display: "block" } : undefined}>
                {item.children?.map((child) => (
                  <li key={`${key}-${child.label}`}>
                    <Link to={child.path ?? "#"}>{child.label}<span /></Link>
                  </li>
                ))}
              </ul>
              <span
                className="dropdown-plus"
                onClick={() => onToggle(key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggle(key);
                  }
                }}
                role="button"
                tabIndex={0}
              />
            </>
          ) : null}
        </li>
      );
    })}
  </ul>
);
const HeaderMarkup = ({
  currentPath,
  isMobile,
  menuOpen,
  openKeys,
  onToggleMenu,
  onToggleDropdown,
  onSearchOpen,
  menuItems = [],
  logoUrl,
}: {
  currentPath: string;
  isMobile: boolean;
  menuOpen: boolean;
  openKeys: string[];
  onToggleMenu: () => void;
  onToggleDropdown: (key: string) => void;
  onSearchOpen: () => void;
  menuItems?: GalacticMenuItem[];
  logoUrl?: string;
}) => (
  <div className="primary-header">
    <div className="container">
      <div className="primary-header-inner">
        <div className="header-logo">
          <Link to="/">
            <img className="logo" src={logoUrl || brand.logo} alt="Logo" />
          </Link>
        </div>
        <div className="header-menu-wrap" style={isMobile && menuOpen ? { display: "block" } : undefined}>
          <MenuList
            items={menuItems}
            currentPath={currentPath}
            isMobile={isMobile}
            openKeys={openKeys}
            onToggle={onToggleDropdown}
          />
        </div>
        <div className="header-right">
          <div className="search-icon dl-search-icon" onClick={onSearchOpen} onKeyDown={() => undefined} role="button" tabIndex={0}>
            <i className="las la-search" />
          </div>
          <Link className="default-btn" to="/contact">
            Gabung Tim Kami<span />
          </Link>
          <div className="mobile-menu-icon" onClick={onToggleMenu} onKeyDown={() => undefined} role="button" tabIndex={0}>
            <div className={`burger-menu${menuOpen ? " menu-open" : ""}`}>
              <div className="line-menu line-half first-line" />
              <div className="line-menu" />
              <div className="line-menu line-half last-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const SearchOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <div id="popup-search-box" className={open ? "toggled" : ""} onClick={onClose}>
    <div className="box-inner-wrap d-flex align-items-center" onClick={(event) => event.stopPropagation()}>
      <form id="form" action="#" method="get" role="search" onSubmit={preventSubmit}>
        <input id="popup-search" type="text" name="s" placeholder="Ketik kata kunci..." />
        <button id="popup-search-button" type="submit" name="submit">
          <i className="las la-search" />
        </button>
      </form>
    </div>
  </div>
);
const Footer = ({
  logoUrl,
  siteName = brand.name,
  description = "Kesuksesan kami datang dari tim yang kreatif, dedikasi tinggi, dan semangat gaming yang nggak pernah padam.",
  socialLinks = brand.socialLinks,
  usefulLinks = [],
  contact = brand.contact,
}: FooterProps) => (
  <footer className="footer-section">
    <div className="container">
      <div className="row footer-items">
        <div className="col-lg-3 col-sm-6 sm-padding">
          <div className="footer-item">
            <Link className="brand" to="/">
              <img src={logoUrl || brand.logo} alt={siteName} />
            </Link>
            <p>{description}</p>
            <ul className="social-list">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} aria-label={item.label} rel="noreferrer" target={item.href.startsWith("http") ? "_blank" : undefined}>
                    <i className={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 sm-padding">
          <div className="footer-item footer-list">
            <div className="widget-title">
              <h3>Link Berguna</h3>
            </div>
            <ul className="footer-links">
              {usefulLinks.map((item) => (
                <li key={`${item.label}-${item.path}`}>
                  {item.external ? (
                    <a href={item.path} rel="noreferrer" target="_blank">{item.label}</a>
                  ) : (
                    <Link to={item.path}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 sm-padding">
          <div className="footer-item">
            <div className="widget-title">
              <h3>Kontak</h3>
            </div>
            <ul className="footer-contact">
              <li><span>Lokasi:</span>{contact.location || brand.contact.location}</li>
              <li><span>Email:</span>{contact.email || brand.contact.email}</li>
              <li><span>Telepon:</span>{contact.phone || brand.contact.phone}</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 sm-padding">
          <div className="footer-item subscribe-wrap">
            <div className="widget-title">
              <h3>Daftar Newsletter</h3>
            </div>
            <form action="#" className="subscribe-form" onSubmit={preventSubmit}>
              <input className="form-control" type="email" id="email" name="EMAIL" placeholder="Email kamu" autoComplete="email" required />
              <button className="submit">Daftar Sekarang</button>
              <div className="clearfix" />
              <div id="subscribe-result">
                <div className="subscription-success" />
                <div className="subscription-error" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="copyright-wrap">
      <div className="container">
        <p>© <span id="currentYear">{new Date().getFullYear()}</span> {siteName} All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);
const VideoCardButton = ({ href }: { href: string }) => (
  <button
    className="dl-video-popup play-btn vbox-item"
    data-video-title="Galactic Highlight Reel"
    data-video-url={href}
    type="button"
  >
    <PlaySvg />
    <div className="ripple" />
  </button>
);
const MatchList = ({ items }: { items: MatchItem[] }) => (
  <ul className="upcoming-matches">
    {items.map((match) => (
      <li className="matches-list" key={`${match.id || "match"}-${match.leftTeam}-${match.rightTeam}`}>
        <div className="participate-team wow fade-in-left">
          <img src={getImageSource(match.leftLogo, "/assets/images/placeholder-squad.png")} alt={match.leftTeam} />
          <h3><Link to={match.leftTeamPath || "/team-details"}>{match.leftTeam}</Link></h3>
          <div className="match-info">{match.group}</div>
        </div>
        <div className="match-time">
          <h3>{match.time}<span>{match.date}</span></h3>
          <ul className="watch-btn">
            <li>
              <button className="galactic-play-trigger" data-video-title={match.leftTeam} data-video-url={match.videoUrl || videoHref} type="button">
                <i className="lab la-youtube" />
              </button>
            </li>
            <li>
              <button className="galactic-play-trigger" data-video-title={match.rightTeam} data-video-url={match.videoUrl || videoHref} type="button">
                <i className="lab la-twitch" />
              </button>
            </li>
          </ul>
        </div>
        <div className="participate-team oponent wow fade-in-right">
          <h3><Link to={match.rightTeamPath || "/team-details"}>{match.rightTeam}</Link></h3>
          <div className="match-info">{match.group}</div>
          <img src={getImageSource(match.rightLogo, "/assets/images/placeholder-squad.png")} alt={match.rightTeam} />
        </div>
      </li>
    ))}
  </ul>
);
const LatestMatchesList = ({ items }: { items: MatchItem[] }) => (
  <>
    {items.map((match) => (
      <div className="latest-matches-lists" key={`latest-${match.leftTeam}-${match.rightTeam}`}>
        <div className="latest-matches-list">
          <div className="matches-thumb">
            <img src={getImageSource(match.leftLogo, "/assets/images/placeholder-squad.png")} alt={match.leftTeam} />
          </div>
          <div className="matches-content">
            <h3>{match.leftTeam} <span>vs</span> {match.rightTeam}</h3>
            <p>{match.group}</p>
          </div>
          <div className="match-time">
            <h3>{match.time}<span>{match.date}</span></h3>
          </div>
        </div>
      </div>
    ))}
  </>
);
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
            <img src={getImageSource(stream.image, "/assets/images/video-thumb.jpg")} alt="thumb" />
            <button
              className="dl-video-popup play-btn vbox-item galactic-play-trigger"
              data-video-title={stream.title}
              data-video-url={stream.videoUrl}
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
      <img src={getImageSource(player.image, "/assets/images/placeholder-player.png")} alt={player.name} />
      <div className="shape-wrap">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>
    </div>
    <div className="team-content">
      <span className="whte-shape" />
      <h3><Link to={player.path || "/player-details"}>{player.name}</Link></h3>
      <h4>{player.game}</h4>
    </div>
  </div>
);
const PlayerGrid = ({ items, columnClass = "col-lg-3 col-md-6 sm-padding" }: { items: PlayerItem[]; columnClass?: string }) => (
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
            <img src={getImageSource(sponsor.image, "/assets/images/placeholder-sponsor.png")} alt={sponsor.name} />
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
          <img src={getImageSource(sponsor.image, "/assets/images/placeholder-sponsor.png")} alt={sponsor.name} />
        </a>
      </div>
    ))}
  </div>
);
const JoinMailSection = () => (
  <section className="contact-section padding-bottom">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 sm-padding">
          <div className="section-heading">
            <h3>Kirim Pesan ke Kami</h3>
            <h2>Gabung Jadi Super Fans dan Dapatkan <span>Segala Keuntungannya</span></h2>
            <p>{templateHeaderDescription}</p>
            <Link className="default-btn" to="/contact">Gabung Tim Kami <span /></Link>
          </div>
        </div>
        <div className="col-md-6 sm-padding">
          <ContactForm className="ml-40" />
        </div>
      </div>
    </div>
  </section>
);
const CtaSection = () => (
  <section className="cta-section">
    <div className="container">
      <div className="section-heading">
        <h3>Terhubung dengan Tim Gaming Kami!</h3>
        <h2>Ikut kami untuk turnamen<br />gaming yang bakal datang!</h2>
        <Link className="default-btn" to="/contact">Gabung Tim Kami</Link>
      </div>
    </div>
  </section>
);
const ProductCard = ({ product }: { product: ProductItem }) => (
  <div className="product-card galactic-hover-card">
    <div className="product-thumb">
      <img src={getImageSource(product.image, "/assets/images/placeholder-shop.png")} alt={product.name} />
      <a href="#" className={`badge ${product.badgeClass}`}>{product.badge}</a>
      <Link className="default-btn" to="/cart">
        Tambah ke Keranjang<span />
      </Link>
    </div>
    <div className="product-info">
      <div className="product-inner">
        <ul className="category">
          <li><a href="#">{product.category}</a></li>
        </ul>
        <ul className="rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={`${product.name}-star-${index + 1}`}><i className="las la-star" /></li>
          ))}
        </ul>
      </div>
      <h3><Link to={product.path || "/shop-details"}>{product.name}</Link></h3>
      <h4 className="price">{formatCurrency(product.price)}</h4>
    </div>
  </div>
);
const ProductGrid = ({ items }: { items: ProductItem[] }) => (
  <div className="row">
    {items.map((product) => (
      <div className="col-lg-4 col-md-6 padding-15" key={product.sku}>
        <ProductCard product={product} />
      </div>
    ))}
  </div>
);
const ProductCarousel = ({ items }: { items: ProductItem[] }) => (
  <div className="outside-spacing galactic-carousel shop-carousel">
    <Carousel
      arrows={false}
      autoPlay
      autoPlaySpeed={3400}
      customButtonGroup={<CarouselButtonGroup className="is-shop" />}
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
      {items.map((product) => (
        <div className="swiper-slide galactic-carousel-slide" key={`product-carousel-${product.sku}`}>
          <ProductCard product={product} />
        </div>
      ))}
    </Carousel>
  </div>
);
const PostMeta = ({ post }: { post: PostItem }) => (
  <ul className="post-meta">
    <li><i className="las la-calendar" />{post.date}</li>
    <li><i className="las la-user" />{post.author}</li>
  </ul>
);
const PostCard = ({ post }: { post: PostItem }) => (
  <div className="post-card galactic-hover-card">
    <div className="post-thumb">
      <img src={getImageSource(post.image, "/assets/images/placeholder-post.jpg")} alt={post.title} />
      <Link className="post-category" to={post.categoryPath || "/blog-classic"}>{post.category}</Link>
    </div>
    <div className="post-content-wrap">
      <PostMeta post={post} />
      <div className="post-content">
        <h3><Link to={post.path || "/blog-details"}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <Link className="read-more" to={post.path || "/blog-details"}>Baca Selengkapnya</Link>
      </div>
    </div>
  </div>
);
const HomePostGrid = ({ items }: { items: PostItem[] }) => (
  <div className="row grid-post">
    {items.map((post, index) => (
      <div
        className="col-lg-4 col-md-6 padding-15 wow fade-in-bottom"
        data-wow-delay={`${300 + index * 100}ms`}
        key={`home-post-${post.title}`}
      >
        <PostCard post={post} />
      </div>
    ))}
  </div>
);
const PagePagination = () => (
  <ul className="pagination-wrap mt-40">
    <li><a className="active" href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#"><i className="las la-angle-right" /></a></li>
  </ul>
);
const BlogSidebar = ({
  categories = [],
  recentPosts = [],
  tags = [],
}: {
  categories?: string[];
  recentPosts?: PostItem[];
  tags?: string[];
}) => (
  <>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Cari Berita</h3>
      </div>
      <form className="search-form" onSubmit={preventSubmit}>
        <input className="form-control" type="text" placeholder="Cari..." />
        <button className="search-btn" type="submit"><i className="las la-search" /></button>
      </form>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Kategori</h3>
      </div>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={`${category}-${index + 1}`}><a href="#">{category}</a><span>{index + 1}</span></li>
        ))}
      </ul>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Postingan Terbaru</h3>
      </div>
      <ul className="thumb-post">
        {recentPosts.map((post) => (
          <li key={`sidebar-${post.title}`}>
            <span className="thumb">
              <img src={getImageSource(post.image, "/assets/images/placeholder-post.jpg")} alt={post.title} />
            </span>
            <div className="thumb-post-info">
              <h3><Link to={post.path || "/blog-details"}>{post.title}</Link></h3>
              <span className="date"><i className="las la-calendar" />{post.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Tag Populer</h3>
      </div>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}><a href="#">{tag}</a></li>
        ))}
      </ul>
    </div>
  </>
);
const ClassicBlogSidebar = ({
  categories = [],
  recentPosts = [],
  tags = [],
}: {
  categories?: string[];
  recentPosts?: PostItem[];
  tags?: string[];
}) => (
  <>
    <div className="sidebar-widget">
      <form className="search-form" onSubmit={preventSubmit}>
        <input className="form-control" type="text" placeholder="Cari" />
        <button className="search-btn" type="submit"><i className="fa fa-search" /></button>
      </form>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Kategori</h3>
      </div>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={`${category}-${index + 1}`}><a href="#">{category}</a><span>{index + 1}</span></li>
        ))}
      </ul>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Artikel Terbaru</h3>
      </div>
      <ul className="thumb-post">
        {recentPosts.map((post) => (
          <li key={`classic-sidebar-${post.title}`}>
            <div className="thumb">
              <img src={getImageSource(post.image, "/assets/images/placeholder-post.jpg")} alt={post.title} />
            </div>
            <div className="thumb-post-info">
              <h3><Link to={post.path || "/blog-details"}>{post.title}</Link></h3>
              <Link className="date" to={post.path || "/blog-details"}>{post.date}</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Tag</h3>
      </div>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}><a href="#">{tag}</a></li>
        ))}
      </ul>
    </div>
  </>
);
const ContactForm = ({ className = "" }: { className?: string }) => (
  <div className={`contact-form ${className}`.trim()}>
    <form className="form-horizontal" onSubmit={preventSubmit}>
      <div className="contact-form-group">
        <div className="form-field">
          <input type="text" id="username" name="username" autoComplete="username" className="form-control" placeholder="Nama Anda" required />
        </div>
        <div className="form-field">
          <input type="email" id="email" name="email" autoComplete="email" className="form-control" placeholder="Email" required />
        </div>
        <div className="form-field message">
          <textarea cols={30} rows={4} id="message" name="message" className="form-control" placeholder="Pesan" required />
        </div>
        <div className="form-field">
          <button className="default-btn" type="submit">
            Kirim Pesan<span /><span />
          </button>
        </div>
      </div>
      <div id="form-messages" className="alert" role="alert" />
    </form>
  </div>
);
type PromoCard = {
  image?: string;
  title: string;
};
const PromoSection = ({ items = [] }: { items?: PromoCard[] }) => (
  <section className="promo-section padding">
    <div className="container">
      <div className="row">
        {items.map((item, index) => (
          <div className="col-lg-4 col-md-6 sm-padding wow fade-in-bottom" data-wow-delay={`${200 + index * 200}ms`} key={item.title}>
            <div className="promo-item">
              <div className="promo-content">
                <img className="promo-icon" src={getImageSource(item.image)} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{templateHeaderDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
const GameplaySection = ({
  title = <>Watch Our <span>Gameplay</span></>,
  items = [],
}: {
  title?: ReactNode;
  items?: StreamItem[];
}) => (
  <section className="latest-gameplay padding-bottom">
    <div className="container">
      <div className="section-heading text-center mb-40 wow fade-in-bottom" data-wow-delay="200ms">
        <h3>Latest Gameplay</h3>
        <h2>{title}</h2>
        <p>{templateHeaderDescription}</p>
      </div>
      <div className="row">
        {items.map((item, index) => (
          <div className="col-lg-4 col-md-6 sm-padding wow fade-in-bottom" data-wow-delay={`${200 + index * 200}ms`} key={`gameplay-${item.title}-${index}`}>
            <div className="gameplay-card">
              <img src={getImageSource(item.image)} alt={item.title} />
              <button className="play-btn galactic-play-trigger" data-video-title={item.title} data-video-url={item.videoUrl || videoHref} type="button">
                <i className="las la-play" />
              </button>
              <div className="gameplay-info">
                <ul className="post-meta">
                  <li><i className="las la-calendar" />{item.category}</li>
                </ul>
                <h2>{item.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
const TestimonialSection = ({ items = [] }: { items?: { image?: string; name: string; date?: string; }[] }) => (
  <section className="testimonial-section padding-bottom">
    <div className="container">
      <div className="section-heading text-center mb-40 wow fade-in-bottom" data-wow-delay="200ms">
        <h3>Testimonials</h3>
        <h2>5000+ <span>Happy Gamers</span> <br /> Around The World</h2>
        <p>{templateHeaderDescription}</p>
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
const ContactDetails = ({
  location = brand.contact.location,
  email = brand.contact.email,
  phone = brand.contact.phone,
}: {
  location?: string;
  email?: string;
  phone?: string;
}) => (
  <ul className="contact-details">
    <li><i className="las la-map-marker" /><span>{location}</span></li>
    <li><i className="las la-envelope" /><span>{email}</span></li>
    <li><i className="las la-phone" /><span>{phone}</span></li>
  </ul>
);
const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="accordion" id="faq-accordion">
      {faqs.map((item, index) => (
        <div className="accordion-item" key={item.question}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button${openIndex === index ? "" : " collapsed"}`}
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              {item.question}
            </button>
          </h2>
          <div className={`accordion-collapse collapse${openIndex === index ? " show" : ""}`}>
            <div className="accordion-body">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const GalacticChrome = ({ children, menuItems, logoUrl }: GalacticChromeProps) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sticky, setSticky] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [cursorGrow, setCursorGrow] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoModalState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wowRef = useRef<WowInstance | null>(null);

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 993;
      setIsMobile(mobile);
      document.body.classList.remove("viewport-lg", "viewport-sm");
      document.body.classList.add(mobile ? "viewport-sm" : "viewport-lg");
    };

    const handleScroll = () => {
      setSticky(window.scrollY > 150);
      setShowScroll(window.scrollY > 300);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    updateViewport();
    handleScroll();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("viewport-lg", "viewport-sm", "loaded");
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(clickAudio);
    audioRef.current.preload = "auto";

    return () => {
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setMenuOpen(false);
    setOpenDropdowns([]);
    setSearchOpen(false);
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (loading) {
      document.body.classList.remove("loaded");
    } else {
      document.body.classList.add("loaded");
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!window.WOW) {
        return;
      }

      if (!wowRef.current) {
        wowRef.current = new window.WOW({
          live: false,
          mobile: true,
        });
        wowRef.current.init();
        return;
      }

      wowRef.current.sync?.();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [loading, location.pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setActiveVideo(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("video-modal-open", Boolean(activeVideo));
    return () => {
      document.body.classList.remove("video-modal-open");
    };
  }, [activeVideo]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const interactiveTarget = target.closest(
        "a, button, [role='button'], input, textarea, select, .team-item, .product-card, .post-card, .gameplay-card",
      );

      if (interactiveTarget && audioRef.current) {
        audioRef.current.currentTime = 0;
        void audioRef.current.play().catch(() => undefined);
      }

      const videoTrigger = target.closest<HTMLElement>("[data-video-url]");
      if (videoTrigger) {
        event.preventDefault();
        setActiveVideo({
          title: videoTrigger.dataset.videoTitle ?? "Galactic Video",
          url: videoTrigger.dataset.videoUrl ?? videoHref,
        });
      }
    };

    const handleHoverState = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const hoverTarget = target.closest(
        "a, button, [role='button'], input, textarea, select, .team-item, .product-card, .post-card, .gameplay-card",
      );

      setCursorGrow(Boolean(hoverTarget));
    };

    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("mouseover", handleHoverState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("mouseover", handleHoverState);
    };
  }, []);

  const scrollIdClass = showScroll ? "show" : "hide";

  return (
    <>
      <div className="site-preloader">
        <div className="spinner" />
      </div>

      <header className="header">
        <HeaderMarkup
          currentPath={location.pathname}
          isMobile={isMobile}
          menuOpen={menuOpen}
          openKeys={openDropdowns}
          onToggleMenu={() => setMenuOpen((value) => !value)}
          onToggleDropdown={(key) =>
            setOpenDropdowns((value) => (value.includes(key) ? value.filter((item) => item !== key) : [...value, key]))
          }
          onSearchOpen={() => setSearchOpen(true)}
          menuItems={menuItems}
          logoUrl={logoUrl}
        />
      </header>

      <div className={`sticky-header${sticky ? " sticky-fixed-top" : ""}`}>
        <HeaderMarkup
          currentPath={location.pathname}
          isMobile={isMobile}
          menuOpen={menuOpen}
          openKeys={openDropdowns}
          onToggleMenu={() => setMenuOpen((value) => !value)}
          onToggleDropdown={(key) =>
            setOpenDropdowns((value) => (value.includes(key) ? value.filter((item) => item !== key) : [...value, key]))
          }
          onSearchOpen={() => setSearchOpen(true)}
          menuItems={menuItems}
          logoUrl={logoUrl}
        />
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      <main className={`galactic-page-shell${loading ? "" : " is-ready"}`}>
        {children}
      </main>

      <div id="scrollup" className={scrollIdClass}>
        <button id="scroll-top" className="scroll-to-top hover-target" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <i className="las la-arrow-up" />
        </button>
      </div>

      <div
        className={`dl-cursor${isMobile ? " hide" : ""}${cursorGrow ? " cursor-grow" : ""}`}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
          visibility: isMobile ? "hidden" : "visible",
        }}
      />
    </>
  );
};

export {
  Carousel,
  videoHref,
  cardResponsive,
  sponsorResponsive,
  smoothCarouselTransition,
  templateHeaderDescription,
  pageBackground,
  formatCurrency,
  getMenuPaths,
  isMenuActive,
  preventSubmit,
  PlaySvg,
  toEmbedUrl,
  CarouselButtonGroup,
  VideoModal,
  PageShell,
  SectionHeading,
  PageHeader,
  SocialLinks,
  DisqusThread,
  MenuList,
  HeaderMarkup,
  SearchOverlay,
  Footer,
  VideoCardButton,
  MatchList,
  LatestMatchesList,
  WatchLiveGrid,
  PlayerCard,
  PlayerGrid,
  PlayerCarousel,
  SponsorCarousel,
  SponsorGrid,
  JoinMailSection,
  CtaSection,
  ProductCard,
  ProductGrid,
  ProductCarousel,
  PostMeta,
  PostCard,
  HomePostGrid,
  PagePagination,
  BlogSidebar,
  ClassicBlogSidebar,
  ContactForm,
  PromoSection,
  GameplaySection,
  TestimonialSection,
  ContactDetails,
  FaqAccordion,
  comment1,
  comment2,
  comment3,
  signImage,
  usaFlag,
  aboutCharacters,
  type GalacticMenuItem,
  GalacticChrome,
}
