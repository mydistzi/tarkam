import { PageShell } from "@/galactic/common";
import { useGalacticSiteContent } from "../shared";
import { FaqContent } from "./section";

const FaqPage = () => {
  const { meta } = useGalacticSiteContent();

  return (
    <PageShell title="Pusat Bantuan Tarkam">
      <FaqContent location={meta.address} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default FaqPage;
