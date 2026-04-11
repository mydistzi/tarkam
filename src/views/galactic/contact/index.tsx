import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ContactContent } from "./section";

const ContactPage = () => {
  const { meta } = useGalacticContent();

  return (
    <PageShell title="Kontak">
      <ContactContent address={meta.address} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default ContactPage;
