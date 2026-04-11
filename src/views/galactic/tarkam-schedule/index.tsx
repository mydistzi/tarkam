import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TarkamScheduleContent } from "./section";

const TarkamSchedulePage = () => {
  const { streams } = useGalacticContent();

  return (
    <PageShell title="Jadwal Tarkam">
      <TarkamScheduleContent items={streams} />
    </PageShell>
  );
};

export default TarkamSchedulePage;
