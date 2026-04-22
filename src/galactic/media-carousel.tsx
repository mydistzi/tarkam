import { type ComponentType } from "react";
import { Link } from "react-router-dom";
import CarouselLib, { type ButtonGroupProps } from "react-multi-carousel";
import "@/assets/css/react-multi-carousel-lite.css";
import {
  getImageSource,
  placeholderPlayer,
  placeholderSponsor,
} from "@/galactic/media-helpers";
import {
  type PlayerItem,
  type SponsorItem,
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

export {
  Carousel,
  CarouselButtonGroup,
  PlayerCarousel,
  PlayerGrid,
  smoothCarouselTransition,
  SponsorCarousel,
  SponsorGrid,
};
