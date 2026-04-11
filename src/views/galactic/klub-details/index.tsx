import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ClubsContent } from "./section";

const ClubDetailsPage = () => {
  const { clubCode } = useParams();
  const { clubs, playerRecords } = useGalacticContent();
  const record = clubs.find((item) => String(item.code) === clubCode) || clubs[0];
  const members = record
    ? playerRecords.filter((player) => player.club?.id === record.id).map((player) => player.item)
    : [];

  return (
    <PageShell title={record?.name || "Detail Klub"} image={record?.logo}>
      <ClubsContent record={record} members={members} />
    </PageShell>
  );
};

export default ClubDetailsPage;
