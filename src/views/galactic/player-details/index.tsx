import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { PlayerDetailsContent } from "./section";

const PlayerDetailsPage = () => {
  const { playerId } = useParams();
  const { playerRecords, sponsors, streams } = useGalacticContent();
  const record = playerRecords.find((item) => String(item.id) === playerId) || playerRecords[0];

  return (
    <PageShell title="Detail Pemain" type="profile" image={record?.item.image}>
      <PlayerDetailsContent record={record} sponsors={sponsors} streams={streams.slice(0, 3)} />
    </PageShell>
  );
};

export default PlayerDetailsPage;
