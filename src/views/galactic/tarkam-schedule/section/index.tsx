import { CtaSection, LatestMatchesList, PageHeader, WatchLiveGrid } from "@/galactic/common";
import type { MatchItem, StreamItem } from "@/galactic/data";

const TarkamScheduleContent = ({ matches, streams }: { matches: MatchItem[]; streams: StreamItem[] }) => (
  <>
    <PageHeader
      eyebrow="Tarkam Mendatang"
      title="Jadwal Streaming Live"
      description="Stream pilihan sekarang tarik data dari endpoint `streamings` dan tetap jaga layout galactic."
    />
    <section className="latest-matches padding-top">
      <div className="container">
        <LatestMatchesList items={matches} />
        <WatchLiveGrid items={streams} />
        <CtaSection />
      </div>
    </section>
  </>
);

export { TarkamScheduleContent };
