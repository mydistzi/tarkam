import { useEffect, useState } from "react";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { getCartQueryString } from "@/galactic/session";
import { CheckoutContent } from "./section";
import type { CartRecord } from "../shared";

const CheckoutPage = () => {
  const { cartItems, meta } = useGalacticContent();
  const [items, setItems] = useState<CartRecord[]>(cartItems);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      try {
        const response = await Api.get(`/carts${getCartQueryString()}`);
        if (!active) {
          return;
        }

        setItems(response.data?.data ?? []);
      } catch (error) {
        console.error('Failed to load checkout cart items', error);
      }
    };

    void loadCart();

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell title="Pembayaran">
      <CheckoutContent items={items} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default CheckoutPage;
