import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
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
  // const { heroes, matches, streams, players, products, posts, sponsors } = useGalacticContent();
  const { heroes, matches, streams, players, sponsors } = useGalacticContent();

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
