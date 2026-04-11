import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { RouteErrorContent } from "./section";

const RouteErrorPage = () => {
  const error = useRouteError();
  const description = isRouteErrorResponse(error)
    ? `Permintaan gagal dengan status ${error.status}. Halaman yang kamu cari nggak bisa ditemukan.`
    : error instanceof Error
      ? "Ada yang error waktu load halaman ini. Coba refresh atau kembali ke beranda."
      : "Halaman yang kamu cari nggak bisa ditemukan.";

  return (
    <PageShell title="404 - Halaman Tidak Ditemukan">
      <RouteErrorContent description={description} />
    </PageShell>
  );
};

export default RouteErrorPage;
