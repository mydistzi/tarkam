import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { useGalacticContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { productId } = useParams();
  const { productRecords } = useGalacticContent();
  const record = productRecords.find(
    (item) =>
      String(item.id) === productId ||
      (item.product.slug ? String(item.product.slug) === productId : false),
  ) || productRecords[0];

  return (
    <PageShell title="Detail Toko" image={record?.item.image?.trim() || placeholderShop}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
