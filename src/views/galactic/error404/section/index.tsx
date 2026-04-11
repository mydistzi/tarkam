import { Link } from "react-router-dom";
import { PageHeader } from "@/galactic/common";

const Error404Content = ({ description }: { description?: string }) => (
  <PageHeader
    eyebrow="Waduh, kemana nih?"
    title="404 Halaman Tidak Ditemukan"
    description={description || "Halaman yang kamu cari nggak ketemu, mungkin dipindah, dihapus, atau memang nggak pernah ada."}
    className="error404"
    meta={<Link className="default-btn mt-30" to="/">Kembali ke Beranda<span /></Link>}
  />
);

export { Error404Content };
