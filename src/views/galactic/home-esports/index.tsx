import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import {
  HomeEsportsBlogSection,
  HomeEsportsGameplaySection,
  HomeEsportsHeroSection,
  HomeEsportsJoinSection,
  HomeEsportsMatchesSection,
  HomeEsportsPlayersSection,
  HomeEsportsPromoSection,
  HomeEsportsSponsorsSection,
  HomeEsportsTestimonialSection,
} from "./section";

const HomeEsportsPage = () => {
  const { heroes, matches, players, posts, sponsors, streams } = useGalacticContent();
  const promoItems = matches.slice(0, 3).map((match) => ({
    image: match.leftLogo || match.rightLogo || "",
    title: `${match.leftTeam} vs ${match.rightTeam}`,
  }));
  const testimonialItems = players.slice(0, 5).map((player) => ({
    image: player.image,
    name: player.name,
    date: player.game,
  }));

  return (
    <PageShell title="Beranda eSports" image={heroes[1]?.image || streams[0]?.image || ""}>
      <>
        <HomeEsportsHeroSection hero={heroes[1] || heroes[0]} streams={streams} />
        <HomeEsportsPromoSection items={promoItems} />
        <HomeEsportsMatchesSection items={matches} />
        <HomeEsportsSponsorsSection items={sponsors} />
        <HomeEsportsPlayersSection items={players} />
        <HomeEsportsJoinSection />
        <HomeEsportsGameplaySection items={streams.slice(0, 3)} />
        <HomeEsportsTestimonialSection items={testimonialItems} />
        <HomeEsportsBlogSection items={posts} />
      </>
    </PageShell>
  );
};

export default HomeEsportsPage;
