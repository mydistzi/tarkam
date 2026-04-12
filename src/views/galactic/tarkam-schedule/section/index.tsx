import { LatestMatchesList, PageHeader } from "@/galactic/common";
import type { MatchItem } from "@/galactic/data";
import { useState } from "react";

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
  leftTeam: tarkam.title || `Tarkam`,
  leftLogo:
    tarkam.image || tarkam.thumbnail || "/assets/images/video-thumb.jpg",
  rightTeam: tarkam.week ? `Week ke ${tarkam.week}` : "Tarkam Schedule",
  rightLogo: "/assets/images/video-thumb.jpg",
  group: tarkam.status || "Upcoming",
  time: tarkam.male_time || tarkam.female_time || "TBA",
  date: formatDateLabel(tarkam.male_date || tarkam.female_date) || "TBA",
  path: `/detail-tarkam/${tarkam.id}`,
  malePath: `/detail-tarkam/${tarkam.id}?gender=male`,
  femalePath: `/detail-tarkam/${tarkam.id}?gender=female`,
});

const TarkamScheduleContent = ({ tarkams }: { tarkams: ScheduleTarkam[] }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const scheduleItems = tarkams.map(mapTarkamToMatchItem);
  const visibleItems = scheduleItems.slice(0, visibleCount);
  const hasMore = visibleCount < scheduleItems.length;

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + 3, scheduleItems.length));
  };

  return (
    <>
      <PageHeader
        eyebrow="Tarkam Mendatang"
        title="Jadwal Tarkam & Streaming Live"
        description="Jadwal tarkam dan streaming live yang sudah berlangsung dan yang akan datang."
      />
      <section className="latest-matches padding-top">
        <div className="container">
          <LatestMatchesList items={visibleItems} animated />
          {hasMore && (
            <div className="text-center mt-50">
              <a className="default-btn" role="button" onClick={handleLoadMore}>
                Muat Lagi Pertandingan
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export { TarkamScheduleContent };
