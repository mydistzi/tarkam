import { type CSSProperties, type FormEvent, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import CarouselLib, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { DiscussionEmbed } from "disqus-react";
import { Autoplay, EffectCoverflow, Pagination as SwiperPagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import clickAudio from "@/assets/audio/click.wav";
import {
  placeholderPlayer,
  placeholderSponsor,
  placeholderShop,
  placeholderPost,
  placeholderTeam,
  placeholderVideoThumb,
} from "@/galactic/placeholders";
import aboutCharacters from "@/assets/images/about-characters.png";
import comment1 from "@/assets/images/comment-1.png";
import comment2 from "@/assets/images/comment-2.png";
import comment3 from "@/assets/images/comment-3.png";
import signImage from "@/assets/images/sign.png";
import usaFlag from "@/assets/images/usa-flag.svg";
import SEO from "@/components/SEO";
import { useGalacticContent } from "@/views/galactic/shared";
import { useAuth } from "@/views/galactic/auth/AuthProvider";
import { getCartRequestPayload } from "@/galactic/session";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import {
  brand,
  buildNewsTagPath,
  galacticRoutes,
  faqs,
  type GalacticMenuItem,
  type MatchItem,
  type NewsCategoryWidgetItem,
  type NewsTagWidgetItem,
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
    const isPlaceholderAsset = /\/assets\/images\/placeholder-[\w-]+\.(png|jpe?g|webp)$/i.test(normalized);
    if (isPlaceholderAsset) {
      return fallback?.trim() || undefined;
    }
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
  span?: ReactNode;
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
type SponsorMarqueeEntry = {
  nickname?: string;
  name?: string;
  member_nickname?: string;
  total_amount?: number | string;
  sponsor_message?: string;
  pesan?: string;
};
type ApiEnvelope<T> = {
  data?: T;
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
    FB?: {
      XFBML?: {
        parse: (element?: HTMLElement) => void;
      };
    };
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

const videoHref = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
  "https://www.facebook.com/chandra.albaz.9/videos/756597290539585/?idorvanity=1077594326683243",
)}&autoplay=1&show_text=0`;
const DEFAULT_API_BASE_URL = "https://tarkam-api-web-production.up.railway.app/api/v1";
const normalizeApiBaseUrl = (value?: string): string => {
  const baseUrl = String(value || "").trim();
  if (!baseUrl) {
    return "";
  }

  const cleaned = baseUrl.replace(/^\/+/, "").replace(/\/+$/, "");
  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl.replace(/\/+$/, "");
  }

  return `https://${cleaned}`;
};
const API_BASE_URL =
  normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
  normalizeApiBaseUrl((import.meta.env as Record<string, string | undefined>).API_BASE_URL) ||
  DEFAULT_API_BASE_URL;
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
const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
// const formatCurrency = (value: number) => `$Rp. ${value.toFixed(2)}`;
const resolveSponsorMarqueeMessage = (entry: SponsorMarqueeEntry) => String(entry.sponsor_message || entry.pesan || "").trim();
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
  if (isFacebookVideoUrl(url)) {
    return getFacebookEmbedUrl(url);
  }
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
    const parsed = new URL(normalized.startsWith("http") ? normalized : `https://${normalized.replace(/^\/+/u, "")}`);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith("facebook.com") || hostname.endsWith("fb.watch")) {
      if (parsed.pathname.includes("plugins/video.php")) {
        const href = parsed.searchParams.get("href");
        return href ? decodeURIComponent(href) : normalized;
      }
      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // ignore invalid URL and fallback to raw value
  }

  return normalized;
};
const getFacebookEmbedUrl = (url: string) => {
  const postUrl = getFacebookVideoPostUrl(url);
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(postUrl)}`;
};
const getNormalizedVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  if (isFacebookVideoUrl(normalized)) {
    return getFacebookEmbedUrl(normalized);
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
const FacebookVideoEmbed = ({ url }: { url: string }) => {
  const embedUrl = getFacebookEmbedUrl(url);

  return (
    <iframe
      src={embedUrl}
      allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ width: "100%", minHeight: "420px", border: 0 }}
      title="Facebook video"
    />
  );
};

const VideoModal = ({ video, onClose }: { video: VideoModalState | null; onClose: () => void }) => {
  if (!video) {
    return null;
  }
  const normalizedUrl = getNormalizedVideoUrl(video.url);
  const isFacebook = isFacebookVideoUrl(normalizedUrl);

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal" onClick={(event) => event.stopPropagation()}>
        <button className="video-modal-close" type="button" aria-label="Close video" onClick={onClose}>
          ×
        </button>
        <div className="video-modal-content">
          {isFacebook ? (
            <FacebookVideoEmbed url={normalizedUrl} />
          ) : (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              src={toEmbedUrl(normalizedUrl)}
              title={video.title}
            />
          )}
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
    <div className="galactic-page-view">{children}</div>
  </>
);
const SectionHeading = ({ eyebrow, title, description }: SectionHeadingProps) => (
  <div className="section-heading mb-40 text-center wow fade-in-bottom">
    <h3>{eyebrow}</h3>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

function replaceWithBr(description: ReactNode) {
  return String(description || "").replace(/(?:\\n|\n)/g, "<br />");
}
const renderPageHeaderDescription = (description?: ReactNode) =>
  description ? (
    <p style={{ whiteSpace: "normal !important" }} dangerouslySetInnerHTML={{ __html: replaceWithBr(description) }} />
  ) : null;
const PageHeader = ({
  eyebrow,
  title,
  span,
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
        <h2>{title} <span>{span}</span></h2>
        {renderPageHeaderDescription(description)}
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
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
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
          {isAuthenticated ? (
            <>
              <span className="header-user-label">Hai, {user?.name || user?.email}</span>
              <Link className="default-btn" to="/logout">
                Logout<span />
              </Link>
            </>
          ) : (
            <>
              <Link className="default-btn" to="/signin">
                Login<span />
              </Link>
              {/* <Link className="default-btn" to="/register">
                Daftar<span />
              </Link> */}
            </>
          )}
          {/* <Link className="default-btn" to="/hubungi-kami">
            Gabung Tim Kami<span />
          </Link> */}
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
};
const SearchOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    clubs: any[];
    members: any[];
    tarkams: any[];
  }>({ clubs: [], members: [], tarkams: [] });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ clubs: [], members: [], tarkams: [] });
      return;
    }

    setIsSearching(true);
    try {
      const [clubsRes, membersRes, tarkamsRes] = await Promise.allSettled([
        Api.get("/clubs", { params: { search: query, limit: 5 } }),
        Api.get("/members", { params: { search: query, limit: 5 } }),
        Api.get("/tarkams", { params: { search: query, limit: 5 } }),
      ]);

      const clubs = clubsRes.status === "fulfilled" ? clubsRes.value.data?.data || [] : [];
      const members = membersRes.status === "fulfilled" ? membersRes.value.data?.data || [] : [];
      const tarkams = tarkamsRes.status === "fulfilled" ? tarkamsRes.value.data?.data || [] : [];

      setSearchResults({ clubs, members, tarkams });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ clubs: [], members: [], tarkams: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(searchQuery);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    // Debounce search
    const timeoutId = setTimeout(() => performSearch(value), 300);
    return () => clearTimeout(timeoutId);
  };

  const handleResultClick = (type: string, item: any) => {
    onClose();
    setSearchQuery("");
    setSearchResults({ clubs: [], members: [], tarkams: [] });

    switch (type) {
      case "club":
        navigate(`/detail-klub/${item.slug}`);
        break;
      case "member":
        navigate(`/detail-player/${item.slug}`);
        break;
      case "tarkam":
        navigate(`/detail-tarkam/${item.id}`);
        break;
    }
  };

  return (
    <div id="popup-search-box" className={open ? "toggled" : ""} onClick={onClose}>
      <div className="box-inner-wrap" onClick={(event) => event.stopPropagation()}>
        <form id="form" action="#" method="get" role="search" onSubmit={handleSubmit}>
          <input
            id="popup-search"
            type="text"
            name="s"
            placeholder="Cari club code, club name, member nickname, atau tarkam week..."
            value={searchQuery}
            onChange={handleInputChange}
            autoFocus={open}
          />
          <button id="popup-search-button" type="submit" name="submit" disabled={isSearching}>
            <i className={isSearching ? "las la-spinner la-spin" : "las la-search"} />
          </button>
        </form>

        {(searchResults.clubs.length > 0 || searchResults.members.length > 0 || searchResults.tarkams.length > 0) && (
          <div className="search-results">
            {searchResults.clubs.length > 0 && (
              <div className="search-section">
                <h4>Clubs</h4>
                <ul>
                  {searchResults.clubs.map((club) => (
                    <li key={club.id} onClick={() => handleResultClick("club", club)}>
                      <div className="search-result-item">
                        <strong>{club.name}</strong>
                        <span>Code: {club.code}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.members.length > 0 && (
              <div className="search-section">
                <h4>Members</h4>
                <ul>
                  {searchResults.members.map((member) => (
                    <li key={member.id} onClick={() => handleResultClick("member", member)}>
                      <div className="search-result-item">
                        <strong>{member.nickname}</strong>
                        {member.club && <span>{member.club.name}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.tarkams.length > 0 && (
              <div className="search-section">
                <h4>Tarkams</h4>
                <ul>
                  {searchResults.tarkams.map((tarkam) => (
                    <li key={tarkam.id} onClick={() => handleResultClick("tarkam", tarkam)}>
                      <div className="search-result-item">
                        <strong>{tarkam.title || `Week ${tarkam.week}`}</strong>
                        <span>Week {tarkam.week}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const Footer = ({
  logoUrl,
  siteName = brand.name,
  description = "Kesuksesan kami datang dari tim yang kreatif, dedikasi tinggi, dan semangat gaming yang nggak pernah padam.",
  socialLinks = brand.socialLinks,
  usefulLinks = [],
  // contact = brand.contact,
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
              <h3>Invite Bot</h3>
            </div>
            <ul className="footer-contact">
              {/* <li><span>Lokasi:</span>{contact.location || brand.contact.location}</li>
              <li><span>Email:</span>{contact.email || brand.contact.email}</li>
              <li><span>Telepon:</span>{contact.phone || brand.contact.phone}</li> */}
              <li><span>Discord:</span><Link className="default-btn" rel="noreferrer" target="_blank" to="https://discord.com/oauth2/authorize?client_id=1478890368429850674&permissions=8&scope=bot">Server Discord <span /></Link></li>
              <li><span>WhatsApp:</span><Link className="default-btn" rel="noreferrer" target="_blank" to="https://wa.me/message/PJEIVB5M56NGE1">Group WhatsApp <span /></Link></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 sm-padding">
          <div className="footer-item subscribe-wrap">
            <div className="widget-title">
              <h3>Daftar Newsletter</h3>
            </div>
            <SubscribeForm />
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
const VideoCardButton = ({ href, normalizeFacebook = false }: { href: string; normalizeFacebook?: boolean }) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;

  return (
    <button
      className="dl-video-popup play-btn vbox-item"
      data-video-title="Tarkam Highlight Reel"
      data-video-url={normalizedHref}
      type="button"
    >
      <PlaySvg />
      <div className="ripple" />
    </button>
  );
};

const VideoStreemButton = ({ href, normalizeFacebook = false }: { href: string; normalizeFacebook?: boolean }) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;

  return (
    <>
    <div id="fb-root"></div>
    <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
    <button
      className="dl-video-popup vbox-item fb-video"
      data-video-title="Tarkam Highlight Reel"
      data-autoplay="true"
      data-mute="false"
      data-allowfullscreen="true"
      data-video-url={normalizedHref}
      type="button"
    >
      <i className="lab la-youtube"></i> Highlights
    </button>
    </>
  );
};
const MatchList = ({ items }: { items: MatchItem[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  const filteredItems = items.filter((match) => {
    if (genderFilter === 'all') return true;

    if (match.gender) {
      return match.gender === genderFilter || match.gender === 'mixed';
    }

    const label = String(match.group || '').toLowerCase();
    if (genderFilter === 'male' && label.includes('male')) {
      return true;
    }
    if (genderFilter === 'female' && label.includes('female')) {
      return true;
    }

    if (genderFilter === 'male') {
      return Boolean(match.malePath);
    }
    if (genderFilter === 'female') {
      return Boolean(match.femalePath);
    }

    return true;
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div className="galactic-match-list-wrapper">
        <div className="galactic-match-list-header">
          <span
            className={`galactic-match-card__eyebrow${genderFilter === 'all' ? ' is-active' : ''}`}
            onClick={() => setGenderFilter('all')}
          >
            All
          </span>
          <span
            className={`galactic-match-card__eyebrow${genderFilter === 'male' ? ' is-active' : ''}`}
            onClick={() => setGenderFilter('male')}
          >
            Male
          </span>
          <span
            className={`galactic-match-card__eyebrow${genderFilter === 'female' ? ' is-active' : ''}`}
            onClick={() => setGenderFilter('female')}
          >
            Female
          </span>
        </div>

        <div className={`galactic-match-list${isExpanded ? ' is-expanded' : ''}`}>

          {filteredItems.map((match) => {
            const detailPath = match.path || "#";
            const hasVideo = Boolean(match.videoUrl?.trim());

            return (
              <article
                className="galactic-match-card"
                key={`${match.id || "match"}-${match.leftTeam}-${match.rightTeam}`}
              >
                <div className="galactic-match-card__meta">
                  <span className="galactic-match-card__tag">{match.group || "Official Match"}</span>
                  <span className="galactic-match-card__timestamp">
                    {match.date || "Tanggal menyusul"}{match.time ? ` • ${match.time}` : ""}
                  </span>
                </div>

                <div className="galactic-match-card__body">
                  <div className="galactic-match-card__team">
                    <img
                      src={getImageSource(match.leftLogo, placeholderTeam)}
                      alt={match.leftTeam}
                    />
                    <div>
                      <small>Left Team</small>
                      <h3>
                        {match.leftTeamPath ? (
                          <Link to={match.leftTeamPath}>{match.leftTeam}</Link>
                        ) : (
                          match.leftTeam
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="galactic-match-card__center">
                    <span className="galactic-match-card__eyebrow">Match Focus</span>
                    <strong>{match.time || "TBA"}</strong>
                    <div className="galactic-match-card__versus">VS</div>
                  </div>

                  <div className="galactic-match-card__team is-right">
                    <img
                      src={getImageSource(match.rightLogo, placeholderTeam)}
                      alt={match.rightTeam}
                    />
                    <div>
                      <small>Right Team</small>
                      <h3>
                        {match.rightTeamPath ? (
                          <Link to={match.rightTeamPath}>{match.rightTeam}</Link>
                        ) : (
                          match.rightTeam
                        )}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="galactic-match-card__actions">
                  {detailPath !== "#" ? (
                    <Link className="default-btn" to={detailPath}>
                      Lihat Detail<span />
                    </Link>
                  ) : (
                    <span className="galactic-match-card__muted">Detail belum tersedia</span>
                  )}

                  {hasVideo ? (
                    <button
                      className="galactic-match-card__video galactic-play-trigger"
                      data-video-title={`${match.leftTeam} vs ${match.rightTeam}`}
                      data-video-url={getNormalizedVideoUrl(match.videoUrl || videoHref)}
                      type="button"
                    >
                      <i className="lab la-youtube" />
                      Highlights
                    </button>
                  ) : (
                    <span className="galactic-match-card__muted">Streaming menyusul</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {filteredItems.length > 1 && (
          <div className="galactic-match-list-toggle">
            <button className="default-btn" onClick={toggleExpanded} type="button">
              {isExpanded ? 'Collapse' : 'Expand'}<span />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// const MatchList = ({ items }: { items: MatchItem[] }) => (
//   <ul className="upcoming-matches">
//     {items.map((match) => (
//       <li className="matches-list" key={`${match.id || "match"}-${match.leftTeam}-${match.rightTeam}`}>
//         <div className="participate-team wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="900ms">
//           <img src={getImageSource(match.leftLogo, placeholderTeam)} alt={match.leftTeam} />
//           <h3><Link to={match.leftTeamPath || "/team-details"}>{match.leftTeam}</Link></h3>
//           <div className="match-info">{match.group}</div>
//         </div>
//         <div className="match-time">
//           <h3>{match.time || "21:30"} <span>{match.date}</span></h3>
//           <ul className="watch-btn">
//             <li>
//               <button className="galactic-play-trigger" data-video-title={match.leftTeam} data-video-url={getNormalizedVideoUrl(match.videoUrl || videoHref)} type="button">
//                 <i className="lab la-youtube" />
//               </button>
//             </li>
//             <li>
//               <button className="galactic-play-trigger" data-video-title={match.rightTeam} data-video-url={getNormalizedVideoUrl(match.videoUrl || videoHref)} type="button">
//                 <i className="lab la-twitch" />
//               </button>
//             </li>
//           </ul>
//         </div>
//         <div className="participate-team oponent wow fadeInRight" data-wow-delay="200ms" data-wow-duration="900ms">
//           <h3><Link to={match.rightTeamPath || "/team-details"}>{match.rightTeam}</Link></h3>
//           <div className="match-info">{match.group}</div>
//           <img src={getImageSource(match.rightLogo, placeholderTeam)} alt={match.rightTeam} />
//         </div>
//       </li>
//     ))}
//   </ul>
// );
const LatestMatchesList = ({
  items,
  streams,
  animated,
}: {
  items: MatchItem[];
  streams?: StreamItem[];
  animated?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <>
      {items.map((match, index) => {
        const stream = streams?.[index];
        return (
          <div
            className={`latest-matches-lists${animated ? " animated fadeInUp" : ""}`}
            key={`latest-${match.leftTeam}-${match.rightTeam}`}
            style={animated ? { animationDelay: `${index * 100}ms`, animationDuration: "900ms" } : undefined}
          >
            <div
              className="latest-matches-list"
              onClick={() => match.path && navigate(match.path)}
              style={{ cursor: match.path ? "pointer" : undefined }}
            >
              <div className="matches-thumb">
                <img src={getImageSource(match.leftLogo, "/assets/images/video-thumb.png")} alt={match.leftTeam} />
              </div>
              <div className="latest-match-info">
                <a href="#" className="match-category">{match.group}</a>
                <h3>
                  {match.leftTeamPath ? <Link to={match.leftTeamPath}>{match.leftTeam}</Link> : <span>{match.leftTeam}</span>}
                  {/* <span className="vs-text"> vs </span> */}
                  {match.rightTeamPath ? <Link to={match.rightTeamPath}> {match.rightTeam}</Link> : <span> {match.rightTeam}</span>}
                </h3>
                <ul className="match-meta">
                  <li><a href="#">{match.date} - {match.time}</a></li>
                </ul>
                {(match.malePath || match.femalePath) && (
                  <div
                    className="match-gender-actions"
                    onClick={(event) => event.stopPropagation()}
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}
                  >
                    {match.malePath && (
                      <Link
                        className="gender-filter-btn male"
                        to={match.malePath}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.18)",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                        }}
                      >
                        Male
                      </Link>
                    )}
                    {match.femalePath && (
                      <Link
                        className="gender-filter-btn female"
                        to={match.femalePath}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.18)",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                        }}
                      >
                        Female
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="watch-info" onClick={(event) => event.stopPropagation()}>
                <a
                  className="dl-video-popup"
                  data-autoplay="true"
                  data-vbtype="video"
                  data-video-title={stream?.title || "Watch Stream"}
                  data-video-url={getNormalizedVideoUrl(stream?.videoUrl || videoHref)}
                  href={getNormalizedVideoUrl(stream?.videoUrl || videoHref)}
                >
                  <i className="lab la-youtube"></i>Watch Streem
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </>
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
      <h4>{player.country ? player.country : 'Jakarta'}</h4>
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
          {items.map((sponsor, index) => {
            const avatarName = sponsor.memberNickname || sponsor.name || "Sponsor Partner";
            return (
              <SwiperSlide key={`sponsor-testimonial-${index + 1}`}>
                <div className="testimonial-item sponsor-testimonial-card">
                  <div className="testi-thumb">
                    <img
                      src={getImageSource(sponsor.memberImage, `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&color=FCFCFC&background=0c0c35`)}
                      alt={sponsor.memberNickname || sponsor.name}
                    />
                    <h3>{sponsor.name}
                      {sponsor.amount != null ? (
                        <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(sponsor.amount)}</span>
                      ) : null}
                    </h3>
                  </div>
                  <p className="sponsor-message">{sponsor.message?.trim() || 'Sponsor belum meninggalkan pesan apapun untuk saat ini.'}</p>
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
            );
          })}
        </Swiper>
      </div>
    </div>
  </section>
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
            <Link className="default-btn" to={galacticRoutes.contact}>Gabung Tim Kami <span /></Link>
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
        <h3>Terhubung dengan Tim Kami!</h3>
        <h2>Ikut kami untuk turnamen<br />tarkam yang akan datang!</h2>
        <Link className="default-btn" to={galacticRoutes.contact}>Gabung Tim Kami</Link>
      </div>
    </div>
  </section>
);
const ProductCard = ({ product }: { product: ProductItem }) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await Api.post("/carts", getCartRequestPayload({
        product_id: product.id,
        quantity: 1,
        unit_price: product.price,
        status: "active",
      }));
      navigate(galacticRoutes.cart);
    } catch (error) {
      console.error("Failed to add product to cart", error);
      window.alert("Gagal menambahkan ke keranjang. Silakan coba lagi.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-thumb">
        <img src={getImageSource(product.image, placeholderShop)} alt={product.name} />
        <a href="#" className={`badge ${product.badgeClass}`}>{product.badge}</a>
        <ul className="shop-action">
            <li><a href="#"><i className="lar la-heart"></i></a></li>
            <li><a href="#"><i className="las la-retweet"></i></a></li>
            <li><a href="#"><i className="las la-expand-arrows-alt"></i></a></li>
        </ul>
        <button className="default-btn" type="button" onClick={handleAddToCart} disabled={isAdding}>
          {isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}<span />
        </button>
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
        <h3><Link to={product.path || galacticRoutes.shop}>{product.name}</Link></h3>
      <h4 className="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price)}</h4>
    </div>
  </div>
  );
};
const ProductGrid = ({ items }: { items: ProductItem[] }) => (
  <div className="row">
    {items.map((product) => (
      <div className="col-md-4 padding-15" key={product.sku}>
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
      <img src={getImageSource(post.image, placeholderPost)} alt={post.title} />
      <Link className="post-category" to={post.categoryPath || galacticRoutes.news}>{post.category}</Link>
    </div>
    <div className="post-content-wrap">
      <PostMeta post={post} />
      <div className="post-content">
        <h3><Link to={post.path || galacticRoutes.news}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <Link className="read-more" to={post.path || galacticRoutes.news}>Baca Selengkapnya</Link>
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
const PagePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}) => {
  if (!onPageChange || totalPages <= 1) {
    return (
      <ul className="pagination-wrap mt-40">
        <li><a className="active" href="#">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
        <li><a href="#"><i className="las la-long-arrow-alt-right" /></a></li>
      </ul>
    );
  }

  const page = Math.max(1, Math.min(currentPage, totalPages));

  return (
    <ul className="pagination-wrap mt-40">
      <li>
        <button
          type="button"
          className="pagination-nav swiper-prev"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          aria-label="Previous page"
        >
          <i className="las la-long-arrow-alt-left" />
        </button>
      </li>

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <li key={`page-${pageNumber}`}>
            <button
              type="button"
              className={pageNumber === page ? "active" : ""}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        );
      })}

      <li>
        <button
          type="button"
          className="pagination-nav swiper-next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          aria-label="Next page"
        >
          <i className="las la-long-arrow-alt-right" />
        </button>
      </li>
    </ul>
  );
};
const NewsSidebar = ({
  categories = [],
  recentPosts = [],
  tags = [],
  searchValue,
  selectedTag,
  onSearch,
  onTagSelect,
}: {
  categories?: Array<Pick<NewsCategoryWidgetItem, "title" | "count" | "path">>;
  recentPosts?: PostItem[];
  tags?: NewsTagWidgetItem[];
  searchValue?: string;
  selectedTag?: string;
  onSearch?: (value: string) => void;
  onTagSelect?: (slug?: string) => void;
}) => (
  <>
    <div className="sidebar-widget">
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(searchValue ?? "");
        }}
      >
        <input
          className="form-control"
          id="cari"
          name="cari"
          type="text"
          placeholder="Cari"
          value={searchValue ?? ""}
          onChange={(event) => onSearch?.(event.target.value)}
        />
        <button className="search-btn" type="submit"><i className="las la-search" /></button>
      </form>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Kategori</h3>
      </div>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={`${category.title}-${index + 1}`}>
            <Link to={category.path || "#"}>{category.title}</Link>
            <span>{category.count ?? 0}</span>
          </li>
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
              <img src={getImageSource(post.image, placeholderPost)} alt={post.title} />
            </span>
            <div className="thumb-post-info">
              <h3><Link to={post.path || galacticRoutes.news}>{post.title}</Link></h3>
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
          <li key={tag.slug}>
            <Link
              to={tag.path}
              className={tag.slug === selectedTag ? "active" : ""}
              onClick={() => onTagSelect?.(tag.slug)}
            >
              {tag.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
);
const ClassicNewsSidebar = ({
  categories = [],
  recentPosts = [],
  tags = [],
  searchValue,
  selectedCategory,
  selectedTag,
  onSearch,
  onCategorySelect,
  onTagSelect,
}: {
  categories?: NewsCategoryWidgetItem[];
  recentPosts?: PostItem[];
  tags?: NewsTagWidgetItem[];
  searchValue?: string;
  selectedCategory?: string;
  selectedTag?: string;
  onSearch?: (value: string) => void;
  onCategorySelect?: (slug?: string) => void;
  onTagSelect?: (tag?: string) => void;
}) => (
  <>
    <div className="sidebar-widget">
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(searchValue ?? "");
        }}
      >
        <input
          className="form-control"
          type="text"
          id="cari"
          name="cari"
          placeholder="Cari"
          value={searchValue ?? ""}
          onChange={(event) => onSearch?.(event.target.value)}
        />
        <button className="search-btn" type="submit"><i className="fa fa-search" /></button>
      </form>
    </div>
    <div className="sidebar-widget">
      <div className="widget-title">
        <h3>Kategori</h3>
      </div>
      <ul className="category-list">
        {categories.map((category, index) => {
          const isActive = category.slug ? category.slug === selectedCategory : false;
          return (
            <li key={`${category.title}-${index + 1}`}>
              <a
                href={category.path || "#"}
                className={isActive ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  onCategorySelect?.(category.slug);
                }}
              >
                {category.title}
              </a>
              <span>{category.count ?? 0}</span>
            </li>
          );
        })}
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
              <img src={getImageSource(post.image, placeholderPost)} alt={post.title} />
            </div>
            <div className="thumb-post-info">
              <h3><Link to={post.path || galacticRoutes.news}>{post.title}</Link></h3>
              <Link className="date" to={post.path || galacticRoutes.news}>{post.date}</Link>
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
          <li key={tag.slug}>
            <a
              href={tag.path || buildNewsTagPath(tag.slug)}
              className={tag.slug === selectedTag ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                onTagSelect?.(tag.slug);
              }}
            >
              {tag.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </>
);
const ContactForm = ({ className = "" }: { className?: string }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      const errorMessage = "Semua kolom harus diisi.";
      setStatus({ type: "error", message: errorMessage });
      await Swal.fire({
        icon: "error",
        title: "Form tidak lengkap",
        text: errorMessage,
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      const errorMessage = "Alamat email tidak valid.";
      setStatus({ type: "error", message: errorMessage });
      await Swal.fire({
        icon: "error",
        title: "Email tidak valid",
        text: errorMessage,
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "info", message: "Mengirim pesan..." });

    const contactApiUrl = `${API_BASE_URL.replace(/\/$/, "")}/contact`;

    try {
      const response = await fetch(contactApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        let errorText = await response.text();
        try {
          const json = JSON.parse(errorText);
          errorText = json.message || JSON.stringify(json);
        } catch {
          // ignore parse errors and keep raw text
        }
        throw new Error(`Webhook gagal: ${response.status} - ${errorText}`);
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus({ type: "success", message: "Pesan berhasil dikirim. Terima kasih!" });
      await Swal.fire({
        icon: "success",
        title: "Pesan dikirim",
        text: "Terima kasih, pesan Anda telah berhasil dikirim ke tim kami.",
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengirim pesan. Silakan coba lagi nanti.";
      setStatus({ type: "error", message: errorMessage });
      await Swal.fire({
        icon: "error",
        title: "Gagal mengirim",
        text: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`contact-form ${className}`.trim()}>
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="contact-form-group">
          <div className="form-field">
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              className="form-control"
              placeholder="Nama Anda"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-field message">
            <textarea
              cols={30}
              rows={4}
              id="message"
              name="message"
              className="form-control"
              placeholder="Pesan"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <button className="default-btn" type="submit" disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Pesan"}
              <span />
              <span />
            </button>
          </div>
        </div>
        <div
          id="form-messages"
          className={`alert${status ? ` alert-${status.type}` : ""}`.trim()}
          role="alert"
          aria-live="polite"
        >
          {status?.message}
        </div>
      </form>
    </div>
  );
};

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const message = "Email harus diisi.";
      setStatus({ type: "error", message });
      await Swal.fire({ icon: "error", title: "Email kosong", text: message });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      const message = "Alamat email tidak valid.";
      setStatus({ type: "error", message });
      await Swal.fire({ icon: "error", title: "Email tidak valid", text: message });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "info", message: "Mengirim langganan..." });

    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, is_subscribed: true }),
      });

      if (!response.ok) {
        const apiError = await response.text();
        throw new Error(`Gagal mengirim: ${response.status} ${apiError}`);
      }

      setEmail("");
      setStatus({ type: "success", message: "Berhasil berlangganan." });
      await Swal.fire({
        icon: "success",
        title: "Terima kasih",
        text: "Email Anda berhasil didaftarkan untuk newsletter.",
      });
    } catch (error) {
      console.error(error);
      const message = "Gagal mendaftar. Silakan coba lagi nanti.";
      setStatus({ type: "error", message });
      await Swal.fire({ icon: "error", title: "Gagal", text: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <input
        className="form-control"
        type="email"
        id="subscribe-email"
        name="EMAIL"
        placeholder="Email kamu"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button className="submit" type="submit" disabled={submitting}>
        {submitting ? "Mengirim..." : "Berlangganan Sekarang"}
      </button>
      <div className="clearfix" />
      <div id="subscribe-result">
        <div className="subscription-success" />
        <div className="subscription-error" />
      </div>
      <div
        className={`alert${status ? ` alert-${status.type}` : ""}`.trim()}
        role="alert"
        aria-live="polite"
      >
        {status?.message}
      </div>
    </form>
  );
};

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
              <button className="play-btn galactic-play-trigger" data-video-title={item.title} data-video-url={getNormalizedVideoUrl(item.videoUrl || videoHref)} type="button">
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
  <section className="testimonial-section padding-top padding-bottom">
    <div className="container">
      <div className="section-heading text-center mb-40 wow fade-in-bottom" data-wow-delay="200ms">
        <h3>Pesan dari Sponsor</h3>
        <h2>Dukung dan selalu supoort <span>Players</span> <br /> Agar Lebih Semangat.</h2>
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
  const { loading: contentLoading } = useGalacticContent();
  const liveKey = useLiveUpdate();
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
  const [sponsorMarqueeEntries, setSponsorMarqueeEntries] = useState<SponsorMarqueeEntry[]>([]);
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
    if (loading || contentLoading) {
      document.body.classList.remove("loaded");
    } else {
      document.body.classList.add("loaded");
    }
  }, [loading, contentLoading]);

  const isAppReady = !loading && !contentLoading;

  useEffect(() => {
    if (!isAppReady) {
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
  }, [isAppReady, location.pathname]);

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
    let cancelled = false;

    const loadSponsorMessages = async () => {
      try {
        const response = await Api.get("/penyawer-leaderboards", {
          params: { limit: 10 },
        });
        const payload = response.data as
          | ApiEnvelope<SponsorMarqueeEntry[]>
          | SponsorMarqueeEntry[]
          | undefined;
        const records = Array.isArray(payload) ? payload : payload?.data ?? [];

        if (!cancelled) {
          setSponsorMarqueeEntries(records);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load sponsor marquee messages", error);
          setSponsorMarqueeEntries([]);
        }
      }
    };

    void loadSponsorMessages();

    return () => {
      cancelled = true;
    };
  }, [liveKey]);

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
          url: getNormalizedVideoUrl(videoTrigger.dataset.videoUrl ?? videoHref),
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
  const sponsorMarqueeMessages = sponsorMarqueeEntries
    .map((entry) => {
      const sponsorMessage = resolveSponsorMarqueeMessage(entry);
      if (!sponsorMessage) {
        return null;
      }

      const sponsorName =
        entry.nickname || entry.name || entry.member_nickname || "Sponsor";

      return {
        key: `${sponsorName}-${sponsorMessage}`,
        sponsorName,
        sponsorMessage,
        amount: formatCurrency(Number(entry.total_amount ?? 0)),
      };
    })
    .filter(Boolean) as Array<{
    key: string;
    sponsorName: string;
    sponsorMessage: string;
    amount: string;
  }>;
  const sponsorMarqueeLoop = sponsorMarqueeMessages.length
    ? [...sponsorMarqueeMessages, ...sponsorMarqueeMessages]
    : [];

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

      {sponsorMarqueeLoop.length ? (
        <section className="global-sponsor-marquee-shell">
          <div className="global-sponsor-marquee">
            <div className="global-sponsor-marquee__label">
              <strong>Pesan Sponsor</strong>
            </div>
            <div className="global-sponsor-marquee__viewport">
              <div 
                className="global-sponsor-marquee__track"
                key={sponsorMarqueeMessages.map(item => item.key).join('-')}
              >
                {sponsorMarqueeLoop.map((item, index) => (
                  <div
                    className="global-sponsor-marquee__item"
                    key={`${item.key}-${index}`}
                  >
                    <span className="global-sponsor-marquee__tag">{item.sponsorName}</span>
                    <p>{item.sponsorMessage}</p>
                    <small>{item.amount}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      <main className={`galactic-page-shell${loading ? "" : " is-ready"}${sponsorMarqueeLoop.length ? " has-global-sponsor-marquee" : ""}`}>
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
  VideoStreemButton,
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
  NewsSidebar,
  ClassicNewsSidebar,
  ContactForm,
  PromoSection,
  GameplaySection,
  SponsorTestimonialSection,
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
