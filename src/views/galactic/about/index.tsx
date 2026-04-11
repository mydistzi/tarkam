import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { AboutContent } from "./section";

const AboutPage = () => {
  const { matches, meta, players, sponsors } = useGalacticContent();

  return (
    <PageShell title="Tentang Kami" image={meta.aboutImage}>
      <AboutContent
        aboutDescription={meta.aboutDescription}
        aboutImage={meta.aboutImage}
        aboutImageAlt={meta.aboutImageAlt}
        matches={matches}
        players={players}
        sponsors={sponsors}
      />
    </PageShell>
  );
};

export default AboutPage;
