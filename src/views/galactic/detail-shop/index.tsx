import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { useGalacticContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { slug } = useParams();
  const normalizedSlug = slug?.trim().toLowerCase();
  const { loading, productRecords } = useGalacticContent();

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

  return (
    <PageShell title="Detail Toko" image={record?.item.image?.trim() || placeholderShop}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
