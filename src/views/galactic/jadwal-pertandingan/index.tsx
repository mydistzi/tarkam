import { PageShell } from "@/galactic/common";
import { useGalacticCompetitionContent } from "../shared";
import { UpcomingMatchesContent } from "./section";

const UpcomingMatchesPage = () => {
  const { matches } = useGalacticCompetitionContent();

  return (
    <PageShell title="Pertandingan Mendatang">
      <UpcomingMatchesContent items={matches} />
    </PageShell>
  );
};

export default UpcomingMatchesPage;
