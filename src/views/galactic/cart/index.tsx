import { useEffect, useState } from "react";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { CartContent } from "./section";
import type { CartRecord } from "../shared";

const CartPage = () => {
  const { cartItems } = useGalacticContent();
  const [items, setItems] = useState<CartRecord[]>(cartItems);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    let active = true;

    const loadCarts = async () => {
      try {
        const response = await Api.get('/carts');
        if (!active) {
          return;
        }

        setItems(response.data?.data ?? []);
      } catch (error) {
        console.error('Failed to load carts', error);
      }
    };

    void loadCarts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell title="Keranjang">
      <CartContent items={items} />
    </PageShell>
  );
};

export default CartPage;
