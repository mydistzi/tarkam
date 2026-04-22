import { PageShell } from "@/galactic/common";
import { useGalacticSiteContent } from "../shared";
import { ContactContent } from "./section";

const ContactPage = () => {
  const { meta } = useGalacticSiteContent();

  return (
    <PageShell title="Kontak">
      <ContactContent address={meta.address} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default ContactPage;
