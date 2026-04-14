import { MatchList, PageHeader } from "@/galactic/common";
import type { MatchItem } from "@/galactic/data";

const UpcomingMatchesContent = ({ items }: { items: MatchItem[] }) => (
  <>
    <PageHeader
      eyebrow="Daftar Pertandingan"
      title="Pertandingan Mendatang"
      description="Lihat jadwal, skor, dan hasil resmi dari turnamen Tarkam yang akan datang."
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
