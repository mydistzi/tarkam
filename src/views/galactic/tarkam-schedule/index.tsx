import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TarkamScheduleContent } from "./section";

const TarkamSchedulePage = () => {
  const { streams, tarkams } = useGalacticContent();

  return (
    <PageShell title="Jadwal Tarkam">
      <TarkamScheduleContent streams={streams} tarkams={tarkams} />
    </PageShell>
  );
};

export default TarkamSchedulePage;
