import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TeamDetailsContent } from "./section";

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const { teams } = useGalacticContent();
  const record = teams.find((item) => String(item.id) === teamId) || teams[0];
  const pageTitle = record?.name ? `${record.name} | Detail Tim` : "Detail Tim";
  const pageDescription = record?.name
    ? `Profil tim ${record.name}, statistik terbaru, dan roster lengkap.`
    : "Detail tim Tarkam dengan informasi roster dan hasil pertandingan.";

  return (
    <PageShell title={pageTitle} description={pageDescription} image={record?.logo}>
      <TeamDetailsContent record={record} />
    </PageShell>
  );
};

export default TeamDetailsPage;
