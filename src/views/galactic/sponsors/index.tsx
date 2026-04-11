import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { SponsorsContent } from "./section";

const SponsorsPage = () => {
  const { sponsors } = useGalacticContent();

  return (
    <PageShell title="Sponsor">
      <SponsorsContent sponsors={sponsors} />
    </PageShell>
  );
};

export default SponsorsPage;
