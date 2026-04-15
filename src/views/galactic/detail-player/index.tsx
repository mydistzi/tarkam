import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { PlayerDetailsContent } from "./section";
import type { PlayerRecord } from "../shared";

const PlayerDetailsPage = () => {
  const { playerId } = useParams();
  const { playerRecords } = useGalacticContent();
  const record = playerRecords.find((item: PlayerRecord) => String(item.id) === playerId) || playerRecords[0];
  const title = record?.member?.nickname || record?.member?.username || record?.item.name || "Detail Pemain";

  return (
    <PageShell title={title} type="profile" image={record?.member?.picture_url || record?.item.image}>
      <PlayerDetailsContent record={record} />
    </PageShell>
  );
};

export default PlayerDetailsPage;
