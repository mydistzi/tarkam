import { CtaSection, LatestMatchesList, PageHeader, WatchLiveGrid } from "@/galactic/common";
import type { MatchItem, StreamItem } from "@/galactic/data";

type ScheduleTarkam = {
  id: number;
  title?: string;
  week?: string;
  status?: string;
  image?: string;
  thumbnail?: string;
  male_time?: string;
  female_time?: string;
  male_date?: string;
  female_date?: string;
};

const formatDateLabel = (value?: string) => {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const mapTarkamToMatchItem = (tarkam: ScheduleTarkam): MatchItem => ({
  leftTeam: tarkam.title || `Tarkam ${tarkam.id}`,
  leftLogo: tarkam.image || tarkam.thumbnail || "/assets/images/placeholder-team.png",
  rightTeam: tarkam.week ? `Week ${tarkam.week}` : "Tarkam Schedule",
  rightLogo: "/assets/images/placeholder-team.png",
  group: tarkam.status || "Upcoming",
  time: tarkam.male_time || tarkam.female_time || "TBA",
  date: formatDateLabel(tarkam.male_date || tarkam.female_date) || "TBA",
  path: `/tarkam-schedule#tarkam-${tarkam.id}`,
});

const TarkamScheduleContent = ({ tarkams, streams }: { tarkams: ScheduleTarkam[]; streams: StreamItem[] }) => {
  const scheduleItems = tarkams.map(mapTarkamToMatchItem);

  return (
    <>
      <PageHeader
        eyebrow="Tarkam Mendatang"
        title="Jadwal Streaming Live"
        description="Stream pilihan sekarang tarik data dari endpoint `streamings` dan daftar jadwal dari tabel `tarkams`."
      />
      <section className="latest-matches padding-top">
        <div className="container">
          <LatestMatchesList items={scheduleItems} />
          <WatchLiveGrid items={streams} />
          <CtaSection />
        </div>
      </section>
    </>
  );
};

export { TarkamScheduleContent };
