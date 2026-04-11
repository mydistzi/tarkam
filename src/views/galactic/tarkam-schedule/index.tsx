import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TarkamScheduleContent } from "./section";

const TarkamSchedulePage = () => {
  const { streams, matches } = useGalacticContent();

  return (
    <PageShell title="Jadwal Tarkam">
      <TarkamScheduleContent matches={matches} streams={streams} />
    </PageShell>
  );
};

export default TarkamSchedulePage;
