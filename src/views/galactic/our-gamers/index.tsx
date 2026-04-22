import { PageShell } from "@/galactic/common";
import { useGalacticCompetitionContent } from "../shared";
import { OurGamersContent } from "./section";

const OurGamersPage = () => {
  const { players, sponsors } = useGalacticCompetitionContent();

  return (
    <PageShell title="Gamer Kita">
      <OurGamersContent players={players} sponsors={sponsors} />
    </PageShell>
  );
};

export default OurGamersPage;
