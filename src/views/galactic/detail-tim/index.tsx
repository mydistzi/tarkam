import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { TeamDetailsContent } from "./section";

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const { teams } = useGalacticContent();
  const record = teams.find((item) => String(item.id) === teamId) || teams[0];

  return (
    <PageShell title="Team Details" image={record?.logo}>
      <TeamDetailsContent record={record} />
    </PageShell>
  );
};

export default TeamDetailsPage;
