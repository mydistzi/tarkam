import { PageHeader, SponsorGrid } from "@/galactic/common";
import type { SponsorItem } from "@/galactic/data";

type SponsorsContentProps = {
  sponsors: SponsorItem[];
};

const SponsorsContent = ({ sponsors }: SponsorsContentProps) => (
  <>
    <PageHeader
      eyebrow="Our Sponsors"
      title="Tournament Sponsors"
      description="Club logos and useful partner links are blended here to keep the sponsor page alive even when the source system stores them in different tables."
    />
    <div className="sponsor-section padding-top">
      <div className="container">
        <SponsorGrid items={sponsors} />
      </div>
    </div>
  </>
);

export { SponsorsContent };
