import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { OurGamersContent } from "./section";

const OurGamersPage = () => {
  const { players, sponsors } = useGalacticContent();

  return (
    <PageShell title="Gamer Kita">
      <OurGamersContent players={players} sponsors={sponsors} />
    </PageShell>
  );
};

export default OurGamersPage;
