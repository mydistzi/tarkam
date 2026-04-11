import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ClubsContent } from "./section";

const ClubPage = () => {
  const { clubs } = useGalacticContent();

  return (
    <PageShell title="Daftar Klub" image={clubs[0]?.logo}>
      <ClubsContent clubs={clubs} />
    </PageShell>
  );
};

export default ClubPage;
