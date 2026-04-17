import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import MatchDetailsContent from "./section";

const MatchDetailsPage = () => {
  const { contestId } = useParams();
  const { matchRecords } = useGalacticContent();
  const record = matchRecords.find((item) => String(item.id) === contestId) || matchRecords[0];
  const relatedRecords = record
    ? matchRecords.filter(
        (item) =>
          String(item.contest?.tarkam_fk ?? "") === String(record.contest?.tarkam_fk ?? "") &&
          String(item.contest?.gender ?? "").toLowerCase() ===
            String(record.contest?.gender ?? "").toLowerCase(),
      )
    : [];

  return (
    <PageShell
      title="Detail Pertandingan"
      description={record ? `${record.item.leftTeam} vs ${record.item.rightTeam} detail pertandingan.` : "Detail pertandingan"}
      image={record?.item.leftLogo}
    >
      <MatchDetailsContent record={record} relatedRecords={relatedRecords} />
    </PageShell>
  );
};

export default MatchDetailsPage;
