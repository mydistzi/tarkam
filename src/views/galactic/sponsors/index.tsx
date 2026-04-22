import { PageShell } from "@/galactic/common";
import { useGalacticCompetitionContent } from "../shared";
import { SponsorsContent } from "./section";

const SponsorsPage = () => {
  const { sponsors } = useGalacticCompetitionContent();

  return (
    <PageShell title="Sponsor">
      <SponsorsContent sponsors={sponsors} />
    </PageShell>
  );
};

export default SponsorsPage;
