import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { CartContent } from "./section";

const CartPage = () => {
  const { cartItems } = useGalacticContent();

  return (
    <PageShell title="Keranjang">
      <CartContent items={cartItems} />
    </PageShell>
  );
};

export default CartPage;
