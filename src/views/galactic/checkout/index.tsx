import { useEffect, useState } from "react";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { useGalacticCommerceContent, useGalacticSiteContent } from "../shared";
import { getCartQueryString } from "@/galactic/session";
import { CheckoutContent } from "./section";
import type { CartRecord } from "../shared";

const CheckoutPage = () => {
  const liveKey = useLiveUpdate(
    ["carts", "products", "web-setting"],
    { fallbackIntervalMs: 30000 },
  );
  const { cartItems } = useGalacticCommerceContent();
  const { meta } = useGalacticSiteContent();
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
  }, [liveKey]);

  return (
    <PageShell title="Pembayaran">
      <CheckoutContent items={items} email={meta.email} phone={meta.phone} />
    </PageShell>
  );
};

export default CheckoutPage;
