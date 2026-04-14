import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { useGalacticContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { slug } = useParams();
  const normalizedSlug = slug?.trim().toLowerCase();
  const { productRecords } = useGalacticContent();
  const record = productRecords.find((item) => {
    const productSlug = item.product.slug?.trim().toLowerCase();
    return (
      String(item.id) === normalizedSlug ||
      (productSlug ? productSlug === normalizedSlug : false)
    );
  }) || productRecords[0];

  return (
    <PageShell title="Detail Toko" image={record?.item.image?.trim() || placeholderShop}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
