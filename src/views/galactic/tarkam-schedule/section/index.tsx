import { PageHeader, WatchLiveGrid } from "@/galactic/common";
import type { StreamItem } from "@/galactic/data";

const TarkamScheduleContent = ({ items }: { items: StreamItem[] }) => (
  <>
    <PageHeader
      eyebrow="Tarkam Mendatang"
      title="Jadwal Streaming Live"
      description="Stream pilihan sekarang tarik data dari endpoint `streamings` dan tetap jaga layout galactic."
    />
    <section className="latest-matches padding-top">
      <div className="container">
        <WatchLiveGrid items={items} />
      </div>
    </section>
  </>
);

export { TarkamScheduleContent };
