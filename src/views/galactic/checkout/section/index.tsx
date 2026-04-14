import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { PageHeader } from "@/galactic/common";
import type { CartRecord } from "../../shared";

type CheckoutContentProps = {
  items: CartRecord[];
  email?: string;
  phone?: string;
};

const PAYMENT_CHANNELS = {
  credit_card: "01",
  bank_transfer: "02",
  indomaret: "09",
  alfamart: "10",
};

const PAYMENT_METHOD_LABELS: Record<keyof typeof PAYMENT_CHANNELS, string> = {
  credit_card: "Kartu Kredit",
  bank_transfer: "Transfer Bank",
  indomaret: "Indomaret",
  alfamart: "Alfamart",
};

const CheckoutContent = ({ items, phone }: CheckoutContentProps) => {
  const [firstName, setFirstName] = useState("Tarkam");
  const [lastName, setLastName] = useState("Community");
  const [city, setCity] = useState("Jakarta");
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<keyof typeof PAYMENT_CHANNELS>("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shipping = 10;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + shipping;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Keranjang kamu kosong. Tambahkan produk terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await Api.post(import.meta.env.VITE_DOKU_PAYMENT_PATH || "/payments/doku", {
        carts: items.map((item) => item.id),
        customer_name: `${firstName} ${lastName}`.trim(),
        customer_phone: phoneNumber,
        customer_city: city,
        payment_method: PAYMENT_CHANNELS[paymentMethod],
        payment_channel: PAYMENT_CHANNELS[paymentMethod],
        shipping_cost: shipping,
        order_note: orderNote,
      });

      const paymentAction = response.data?.payment_action;
      const paymentPayload = response.data?.payment_payload;

      if (!paymentAction || !paymentPayload) {
        throw new Error("Cannot build payment request from Doku response.");
      }

      const paymentWindow = window.open("", "_blank");
      if (!paymentWindow) {
        throw new Error("Pop up diblokir, izinkan jendela baru untuk melanjutkan pembayaran.");
      }

      const form = document.createElement("form");
      form.method = "post";
      form.action = paymentAction;
      form.target = paymentWindow.name;
      form.style.display = "none";

      Object.entries(paymentPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Checkout failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses pembayaran. Coba lagi atau periksa data kamu.";
      setErrorMessage(message);
      void Swal.fire({
        icon: "error",
        title: "Checkout gagal",
        text: message,
        confirmButtonText: "Tutup",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Pembayaran"
        title="Bayar Pesanan"
        description="Lihat detail pembayaran dan ringkasan pesanan Anda. Semua informasi ini diambil langsung dari keranjang belanja aktif."
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 sm-padding">
              <form className="checkout-form-wrap" onSubmit={handleSubmit}>
                <h2>Detail Pembayaran</h2>
                <div className="checkout-form mb-30">
                  <div className="form-field"><input className="form-control" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Nama Depan" required type="text" id="firstName" name="firstName" /></div>
                  <div className="form-field"><input className="form-control" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Nama Belakang" required type="text" id="lastName" name="lastName" /></div>
                  <div className="form-field"><input className="form-control" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Kota" required type="text" id="city" name="city" /></div>
                  <div className="form-field"><input className="form-control" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Telepon" required type="text" id="phoneNumber" name="phoneNumber" /></div>
                </div>
                <div className="additional-info mb-30">
                  <h2>Info Tambahan</h2>
                  <div className="form-field">
                    <textarea className="form-control" cols={30} value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Catatan Pesanan" rows={3} id="orderNote" name="orderNote" />
                  </div>
                </div>
                <div className="payment-method">
                  <h2>Metode Pembayaran</h2>
                  <ul className="mb-20">
                    {Object.entries(PAYMENT_CHANNELS).map(([key]) => (
                      <li key={key}>
                        <label>
                          <input
                            checked={paymentMethod === key}
                            name="selector"
                            onChange={() => setPaymentMethod(key as keyof typeof PAYMENT_CHANNELS)}
                            type="radio"
                          />
                          {PAYMENT_METHOD_LABELS[key as keyof typeof PAYMENT_CHANNELS]}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button className="default-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}<span />
                  </button>
                </div>
                {errorMessage ? <p style={{ color: '#d9534f', marginTop: '1rem' }}>{errorMessage}</p> : null}
              </form>
            </div>
            <div className="col-lg-4 sm-padding">
              <ul className="cart-total">
                <li><span>Subtotal:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(subtotal)}</li>
                <li><span>Perkiraan ongkir:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(shipping)}</li>
                <li><span>Total:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</li>
                <li>
                  <Link to="/shop">Lanjut Belanja</Link>
                  <Link className="default-btn" to="/cart">Lihat Keranjang<span /></Link>
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
