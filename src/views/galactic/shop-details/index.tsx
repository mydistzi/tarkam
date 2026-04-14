import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { useGalacticContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { slug } = useParams();
  const { productRecords } = useGalacticContent();
  const record = productRecords.find(
    (item) =>
      String(item.id) === slug ||
      (item.product.slug ? String(item.product.slug) === slug : false),
  ) || productRecords[0];

  return (
    <PageShell title="Detail Toko" image={record?.item.image?.trim() || placeholderShop}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
