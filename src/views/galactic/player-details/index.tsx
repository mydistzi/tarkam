import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { PlayerDetailsContent } from "./section";
import type { PlayerRecord } from "../shared";

const PlayerDetailsPage = () => {
  const { playerId } = useParams();
  const { playerRecords } = useGalacticContent();
  const record = playerRecords.find((item: PlayerRecord) => String(item.id) === playerId) || playerRecords[0];

  return (
    <PageShell title="Detail Pemain" type="profile" image={record?.item.image}>
      <PlayerDetailsContent record={record} />
    </PageShell>
  );
};

export default PlayerDetailsPage;
