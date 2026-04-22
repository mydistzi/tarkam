import { PageShell } from "@/galactic/common";
import { useGalacticCompetitionContent, useGalacticSiteContent } from "../shared";
import { AboutContent } from "./section";

const AboutPage = () => {
  const { meta } = useGalacticSiteContent();
  const { matches, players, sponsors } = useGalacticCompetitionContent();

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
