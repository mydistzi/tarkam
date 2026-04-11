import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TarkamScheduleContent } from "./section";

const TarkamSchedulePage = () => {
  const { tarkams } = useGalacticContent();

  return (
    <PageShell title="Jadwal Tarkam">
      <TarkamScheduleContent tarkams={tarkams} />
    </PageShell>
  );
};

export default TarkamSchedulePage;
