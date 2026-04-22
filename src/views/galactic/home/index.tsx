import { PageShell } from "@/galactic/common";
import { useGalacticCompetitionContent, useGalacticSiteContent } from "../shared";
import {
  // HomeBlogSection,
  HomeHeroSection,
  HomeJoinSection,
  HomeMatchesSection,
  HomePlayersSection,
  // HomeShopSection,
  HomeSponsorsSection,
  HomeStreamsSection,
} from "./section";

const HomeDefaultPage = () => {
  const { heroes } = useGalacticSiteContent();
  const { matches, streams, players, sponsors } = useGalacticCompetitionContent();

  return (
    <PageShell title="Beranda" image={heroes[0]?.image ?? ""}>
      <>
        <HomeHeroSection hero={heroes[0]} />
        <HomeMatchesSection items={matches} />
        <HomeStreamsSection items={streams} />
        <HomePlayersSection items={players} />
        <HomeJoinSection />
        <HomeSponsorsSection items={sponsors} />
        {/* <HomeShopSection items={products} /> */}
        {/* <HomeBlogSection items={posts} /> */}
      </>
    </PageShell>
  );
};

export default HomeDefaultPage;
