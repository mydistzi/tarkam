import { PageShell } from "@/galactic/common";
import { useParams } from "react-router-dom";
import { TarkamDetailsContent } from "./section";

const TarkamDetailsPage = () => {
  const { tarkamId } = useParams<{ tarkamId?: string }>();
  const selectedId = Number(tarkamId?.replace(/^week-/, ""));
  const pageTitle = Number.isNaN(selectedId)
    ? "Detail Tarkam"
    : `Detail Tarkam Week ${selectedId}`;
  const pageDescription = Number.isNaN(selectedId)
    ? "Detail Tarkam lengkap dengan jadwal, tim, dan hasil pertandingan."
    : `Detail Tarkam Week ${selectedId} lengkap dengan jadwal, tim, dan update terbaru.`;

  return (
    <PageShell title={pageTitle} description={pageDescription}>
      <TarkamDetailsContent tarkamId={Number.isNaN(selectedId) ? undefined : selectedId} />
    </PageShell>
  );
};

export default TarkamDetailsPage;
