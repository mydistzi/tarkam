import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import MatchDetailsContent from "./section";

const MatchDetailsPage = () => {
  const { contestId } = useParams();
  const { matchRecords } = useGalacticContent();
  const record = matchRecords.find((item) => String(item.id) === contestId) || matchRecords[0];

  return (
    <PageShell
      title="Detail Pertandingan"
      description={record ? `${record.item.leftTeam} vs ${record.item.rightTeam} detail pertandingan.` : "Detail pertandingan"}
      image={record?.item.leftLogo}
    >
      <MatchDetailsContent record={record} />
    </PageShell>
  );
};

export default MatchDetailsPage;
