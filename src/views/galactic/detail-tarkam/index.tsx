import { PageShell } from "@/galactic/common";
import { useParams } from "react-router-dom";
import { TarkamDetailsContent } from "./section";

const TarkamDetailsPage = () => {
  const { tarkamId } = useParams<{ tarkamId?: string }>();
  const selectedId = Number(tarkamId);

  return (
    <PageShell title="Detail Tarkam">
      <TarkamDetailsContent tarkamId={Number.isNaN(selectedId) ? undefined : selectedId} />
    </PageShell>
  );
};

export default TarkamDetailsPage;
