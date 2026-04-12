import { PageHeader, SponsorGrid, TestimonialSection } from "@/galactic/common";
import { players, type SponsorItem } from "@/galactic/data";

type SponsorsContentProps = {
  sponsors: SponsorItem[];
};

const testimonialItems = players.slice(0, 5).map((player) => ({
  image: player.image,
  name: player.name,
  date: player.game,
}));

const SponsorsContent = ({ sponsors }: SponsorsContentProps) => (
  <>
    <PageHeader
      eyebrow="Sponsor Kami"
      title="Sponsor Turnamen"
      description="Logo sponsor dan link partner disajikan di sini agar halaman sponsor tetap hidup meski sumber data disimpan di tabel yang beda."
    />
    <div className="sponsor-section padding-top">
      <div className="container">
        <SponsorGrid items={sponsors} />
        <TestimonialSection items={testimonialItems} />
      </div>
    </div>
  </>
);

export { SponsorsContent };
