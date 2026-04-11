import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ShopDetailsContent } from "./section";

const ShopDetailsPage = () => {
  const { productId } = useParams();
  const { productRecords } = useGalacticContent();
  const record = productRecords.find((item) => String(item.id) === productId) || productRecords[0];

  return (
    <PageShell title="Detail Toko" image={record?.item.image}>
      <ShopDetailsContent record={record} />
    </PageShell>
  );
};

export default ShopDetailsPage;
