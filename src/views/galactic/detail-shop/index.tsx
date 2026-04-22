import "@/assets/css/shop.css";
import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { useGalacticCommerceContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { slug } = useParams();
  const normalizedSlug = slug?.trim().toLowerCase();
  const { loading, productRecords } = useGalacticCommerceContent();

  const record = productRecords.find((item) => {
    if (!normalizedSlug) {
      return false;
    }

    const productSlug = item.product.slug?.trim().toLowerCase();
    const pathSlug = item.item.path?.split("/").pop()?.toLowerCase();

    return (
      String(item.id) === normalizedSlug ||
      productSlug === normalizedSlug ||
      pathSlug === normalizedSlug
    );
  });

  if (loading) {
    return (
      <PageShell title="Detail Toko" image={placeholderShop}>
        <section className="shop-section single padding">
          <div className="container">
            <h2>Memuat detail produk...</h2>
          </div>
        </section>
      </PageShell>
    );
  }

  const pageTitle = record?.item.name
    ? `${record.item.name} | Detail Toko`
    : "Detail Toko";
  const pageDescription = record?.item.description
    ? record.item.description
    : "Detail produk Tarkam lengkap dengan harga, spesifikasi, dan informasi toko.";

  return (
    <PageShell title={pageTitle} description={pageDescription} image={record?.item.image?.trim() || placeholderShop}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
