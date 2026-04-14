import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "@/api";
import { PageHeader } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import { getCartRequestPayload } from "@/galactic/session";
import type { CartRecord } from "../../shared";

const CartContent = ({ items }: { items: CartRecord[] }) => {
  const [cartItems, setCartItems] = useState<CartRecord[]>(items);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const updateQuantity = async (itemId: number, quantity: number) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const normalizedQuantity = Math.max(1, quantity);
      const item = cartItems.find((cart) => cart.id === itemId);
      if (!item) {
        throw new Error('Item tidak ditemukan');
      }

      await Api.patch(`/carts/${itemId}`, getCartRequestPayload({
        quantity: normalizedQuantity,
        unit_price: item.product.price,
      }));

      setCartItems((current) =>
        current.map((cart) =>
          cart.id === itemId ? { ...cart, quantity: normalizedQuantity } : cart
        )
      );
    } catch (error) {
      console.error('Failed to update cart quantity', error);
      setErrorMessage('Gagal memperbarui jumlah item. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await Api.delete(`/carts/${itemId}`, {
        data: getCartRequestPayload({}),
      });
      setCartItems((current) => current.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove cart item', error);
      setErrorMessage('Gagal menghapus item dari keranjang. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + 10;

  return (
    <>
      <PageHeader
        eyebrow="Keranjang"
        title="Keranjang Produk"
        description="Tinjau barang yang dipilih sebelum melanjutkan ke pembayaran. Semua item ini berasal dari keranjang belanja resmi Anda."
      />
      <section className="cart-section padding-top">
        <div className="container">
          <div className="row cart-header">
            <div className="col-lg-6">Produk</div>
            <div className="col-lg-3">Jumlah</div>
            <div className="col-lg-1">Harga</div>
            <div className="col-lg-1">Total</div>
            <div className="col-lg-1" />
          </div>
          {cartItems.length === 0 ? (
            <div className="row cart-body pb-30">
              <div className="col-12">
                <p>Keranjang kamu masih kosong.</p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="row cart-body pb-30" key={item.id}>
                <div className="col-lg-6">
                  <div className="cart-item">
                    <img src={item.product.image?.trim() || placeholderShop} alt={item.product.name} />
                    <div className="cart-content">
                      <h3><Link to={item.product.path || "/shop-details"}>{item.product.name}</Link></h3>
                      <p>{item.product.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-4 col-lg-3">
                  <div className="cart-item">
                    <input
                      max={10}
                      min={1}
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="col-3 col-lg-1"><div className="cart-item"><p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.product.price)}</p></div></div>
                <div className="col-3 col-lg-1"><div className="cart-item"><p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.product.price * item.quantity)}</p></div></div>
                <div className="col-2 col-lg-1">
                  <div className="cart-item">
                    <button className="remove" type="button" onClick={() => removeItem(item.id)} disabled={isSaving}>
                      <i className="las la-times" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {errorMessage ? (
            <div className="row cart-body pb-30">
              <div className="col-12">
                <p style={{ color: '#d9534f' }}>{errorMessage}</p>
              </div>
            </div>
          ) : null}
          <div className="row">
            <div className="col-lg-6 offset-lg-6">
              <ul className="cart-total mt-30">
                <li><span>Subtotal:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(subtotal)}</li>
                <li><span>Estimasi ongkir:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(10)}</li>
                <li><span>Total:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</li>
                <li>
                  <Link to="/shop">Lanjut Belanja</Link>
                  <Link className="default-btn" to="/checkout">Bayar Sekarang<span /></Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { CartContent };
