import { PageHeader, SponsorGrid } from "@/galactic/common";
import { type SponsorItem } from "@/galactic/data";

type SponsorsContentProps = {
  sponsors: SponsorItem[];
};

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
      </div>
    </div>
  </>
);

export { SponsorsContent };
