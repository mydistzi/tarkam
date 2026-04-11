import { MatchList, PageHeader } from "@/galactic/common";
import type { MatchItem } from "@/galactic/data";

const UpcomingMatchesContent = ({ items }: { items: MatchItem[] }) => (
  <>
    <PageHeader
      eyebrow="Daftar Pertandingan"
      title="Pertandingan Mendatang"
      description="Kontes mendatang, skor, dan info pemenang ditampilkan langsung dari data terbaru Tarkam."
    />
    <section className="matches-section padding-top">
      <div className="container">
        <MatchList items={items} />
        <div className="text-center mt-50">
          <a className="default-btn" href="#top">Muat Lagi Pertandingan</a>
        </div>
      </div>
    </section>
  </>
);

export { UpcomingMatchesContent };
