import { Link } from "react-router-dom";
import { PageHeader } from "@/galactic/common";
import type { CartRecord } from "../../shared";

const CartContent = ({ items }: { items: CartRecord[] }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + 10;

  return (
    <>
      <PageHeader
        eyebrow="Keranjang"
        title="Keranjang Produk"
        description="Item keranjang di halaman ini diambil dari endpoint `carts` dan dilengkapi data produk yang terhubung."
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
          {items.length === 0 ? (
            <div className="row cart-body pb-30">
              <div className="col-12">
                <p>Keranjang kamu masih kosong.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div className="row cart-body pb-30" key={item.id}>
                <div className="col-lg-6">
                  <div className="cart-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="cart-content">
                      <h3><Link to={item.product.path || "/shop-details"}>{item.product.name}</Link></h3>
                      <p>{item.product.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-4 col-lg-3">
                  <div className="cart-item">
                    <input max="10" min="1" type="number" defaultValue={item.quantity} />
                  </div>
                </div>
                <div className="col-3 col-lg-1"><div className="cart-item"><p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.product.price)}</p></div></div>
                <div className="col-3 col-lg-1"><div className="cart-item"><p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.product.price * item.quantity)}</p></div></div>
                <div className="col-2 col-lg-1"><div className="cart-item"><a className="remove" href="#"><i className="las la-times" /></a></div></div>
              </div>
            ))
          )}
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
