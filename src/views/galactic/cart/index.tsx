import { useEffect, useState } from "react";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { useGalacticCommerceContent } from "../shared";
import { getCartQueryString } from "@/galactic/session";
import { CartContent } from "./section";
import type { CartRecord } from "../shared";

const CartPage = () => {
  const liveKey = useLiveUpdate(
    ["carts", "products"],
    { fallbackIntervalMs: 30000 },
  );
  const { cartItems } = useGalacticCommerceContent();
  const [items, setItems] = useState<CartRecord[]>(cartItems);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    let active = true;

    const loadCarts = async () => {
      try {
        const response = await Api.get(`/carts${getCartQueryString()}`);
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
  }, [liveKey]);

  return (
    <PageShell title="Keranjang">
      <CartContent items={items} />
    </PageShell>
  );
};

export default CartPage;
