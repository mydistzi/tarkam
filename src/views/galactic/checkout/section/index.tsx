import { Link } from "react-router-dom";
import { PageHeader, preventSubmit } from "@/galactic/common";
import type { CartRecord } from "../../shared";

type CheckoutContentProps = {
  items: CartRecord[];
  email?: string;
  phone?: string;
};

const CheckoutContent = ({ items, email, phone }: CheckoutContentProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + 10;

  return (
    <>
      <PageHeader
        eyebrow="Pembayaran"
        title="Bayar Pesanan"
        description="Ringkasan tagihan dan pesanan sekarang tersambung ke data keranjang, jadi halaman ini bukan lagi template mati."
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 sm-padding">
              <form className="checkout-form-wrap" onSubmit={preventSubmit}>
                <h2>Detail Pembayaran</h2>
                <div className="checkout-form mb-30">
                  <div className="form-field"><input className="form-control" defaultValue="Tarkam" placeholder="Nama Depan" required type="text" /></div>
                  <div className="form-field"><input className="form-control" defaultValue="Community" placeholder="Nama Belakang" required type="text" /></div>
                  <div className="form-field"><input className="form-control" placeholder="Nama Perusahaan" type="text" /></div>
                  <div className="form-field"><input className="form-control" defaultValue="Indonesia" placeholder="Negara" required type="text" /></div>
                  <div className="form-field"><input className="form-control" defaultValue="Jakarta" placeholder="Kota" required type="text" /></div>
                  <div className="form-field"><input className="form-control" placeholder="Provinsi" required type="text" /></div>
                  <div className="form-field"><input className="form-control" placeholder="Jalan" required type="text" /></div>
                  <div className="form-field"><input className="form-control" placeholder="Kode Pos" required type="text" /></div>
                  <div className="form-field"><input className="form-control" defaultValue={phone} placeholder="Telepon" required type="text" /></div>
                  <div className="form-field"><input className="form-control" defaultValue={email} placeholder="Email" required type="text" /></div>
                </div>
                <div className="additional-info mb-30">
                  <h2>Info Tambahan</h2>
                  <div className="form-field">
                    <textarea className="form-control" cols={30} placeholder="Catatan Pesanan" rows={3} />
                  </div>
                </div>
                <div className="payment-method">
                  <h2>Metode Pembayaran</h2>
                  <ul className="mb-20">
                    <li><input defaultChecked id="option-1" name="selector" type="radio" /><label htmlFor="option-1">Transfer Bank</label></li>
                    <li><input id="option-2" name="selector" type="radio" /><label htmlFor="option-2">Bayar dengan Cek</label></li>
                    <li><input id="option-3" name="selector" type="radio" /><label htmlFor="option-3">Bayar di Tempat</label></li>
                  </ul>
                  <Link className="default-btn" to="/shop">Bayar Sekarang <span /></Link>
                </div>
              </form>
            </div>
            <div className="col-lg-4 sm-padding">
              <ul className="cart-total">
                <li><span>Subtotal:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(subtotal)}</li>
                <li><span>Perkiraan ongkir:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(10)}</li>
                <li><span>Total:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</li>
                <li>
                  <Link to="/shop">Lanjut Belanja</Link>
                  <a className="default-btn" href="#">Selesaikan Pembayaran<span /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { CheckoutContent };
