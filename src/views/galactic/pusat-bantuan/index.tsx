import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { FaqContent } from "./section";

const FaqPage = () => {
  const { meta } = useGalacticContent();

  return (
    <PageShell title="Bantuan & FAQ">
      <FaqContent location={meta.address} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default FaqPage;
