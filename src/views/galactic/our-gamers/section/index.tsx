import { CtaSection, PageHeader, PlayerGrid, SponsorCarousel } from "@/galactic/common";
import type { PlayerItem, SponsorItem } from "@/galactic/data";

const OurGamersContent = ({ players, sponsors }: { players: PlayerItem[]; sponsors: SponsorItem[] }) => (
  <>
    <PageHeader
      eyebrow="Gamer Kita"
      title="Kenalan Sama Gamer"
      description="Temui roster pemain dan tim resmi yang berkompetisi di event dan liga Tarkam."
    />
    <section className="gamers-section padding">
      <div className="container">
        <PlayerGrid items={players} />
      </div>
    </section>
    <div className="sponsor-section padding-bottom">
      <div className="container">
        <div className="outside-spacing">
          <SponsorCarousel items={sponsors} />
        </div>
      </div>
    </div>
    <CtaSection />
  </>
);

export { OurGamersContent };
