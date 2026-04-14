import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ClubsContent } from "./section";

const ClubDetailsPage = () => {
  const { slug } = useParams();
  const { clubs, playerRecords } = useGalacticContent();
  const record = clubs.find(
    (item) =>
      String(item.slug) === slug ||
      String(item.code) === slug ||
      String(item.id) === slug,
  ) || clubs[0];
  const clubMembers = record
    ? playerRecords.filter((player) => player.club?.id === record.id)
    : [];

  const members = clubMembers.map((player) => player.item);
  const clubWins = clubMembers.reduce((sum, player) => sum + player.wins, 0);
  const clubLosses = clubMembers.reduce((sum, player) => sum + player.losses, 0);
  const clubPoints = clubMembers.reduce((sum, player) => sum + player.points, 0);

  return (
    <PageShell title={record?.name || "Detail Klub"} image={record?.logo}>
      <ClubsContent
        record={record}
        members={members}
        clubWins={clubWins}
        clubLosses={clubLosses}
        clubPoints={clubPoints}
      />
    </PageShell>
  );
};

export default ClubDetailsPage;
