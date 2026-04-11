import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { UpcomingMatchesContent } from "./section";

const UpcomingMatchesPage = () => {
  const { matches } = useGalacticContent();

  return (
    <PageShell title="Pertandingan Mendatang">
      <UpcomingMatchesContent items={matches} />
    </PageShell>
  );
};

export default UpcomingMatchesPage;
