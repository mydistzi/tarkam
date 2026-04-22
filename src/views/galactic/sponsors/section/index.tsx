import { PageHeader } from "@/galactic/common";
import { SponsorGrid } from "@/galactic/media-carousel";
import { SponsorTestimonialSection } from "@/galactic/media-swiper";
import { type SponsorItem } from "@/galactic/data";

type SponsorsContentProps = {
  sponsors: SponsorItem[];
};

const SponsorsContent = ({ sponsors }: SponsorsContentProps) => (
  <>
    <PageHeader
      eyebrow="Sponsor Kami"
      title="Sponsor Turnamen"
      description="Lihat mitra resmi yang mendukung event, kompetisi, \n dan komunitas Tarkam secara penuh."
    />
    <div className="sponsor-section padding-top">
      <div className="container">
        <SponsorGrid items={sponsors} />
      </div>
    </div>
    <SponsorTestimonialSection items={sponsors} />
  </>
);

export { SponsorsContent };
