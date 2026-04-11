import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { CheckoutContent } from "./section";

const CheckoutPage = () => {
  const { cartItems, meta } = useGalacticContent();

  return (
    <PageShell title="Checkout">
      <CheckoutContent items={cartItems} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default CheckoutPage;
