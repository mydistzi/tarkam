import { useState } from "react";
import { Link } from "react-router-dom";
import Api from "@/api";
import { getCartRequestPayload } from "@/galactic/session";
import { PageHeader } from "@/galactic/common";
import { showAlert } from "@/lib/alerts";
import { printQrisInvoice, prepareQrisPrintWindow, type QrisInvoicePayload } from "@/lib/qris";
import { useAuth } from "../../auth/AuthProvider";
import type { CartRecord } from "../../shared";

type CheckoutContentProps = {
  items: CartRecord[];
  email?: string;
  phone?: string;
};

const CheckoutContent = ({ items, phone }: CheckoutContentProps) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shipping = 0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + shipping;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const paymentWindow = prepareQrisPrintWindow();

    try {
      const response = await Api.post("/payments/qris/carts", getCartRequestPayload({
        carts: items.map((item) => item.id),
        phone: phoneNumber,
        order_note: orderNote,
      }));
      const payload = response.data?.data;
      const transaction = payload?.transaction;
      const invoice = payload?.invoice;

      if (!transaction || !invoice?.qris_content) {
        throw new Error("QRIS checkout belum berhasil dibuat.");
      }

      const printPayload: QrisInvoicePayload = {
        title: "QRIS Checkout Tarkam Store",
        description: "Pembayaran produk Tarkam Store akan dikonfirmasi otomatis setelah status QRIS dinyatakan paid.",
        amount: Number(transaction.amount ?? total),
        transactionCode: String(transaction.transaction_code ?? ""),
        payerName: transaction.payer_name ?? user?.name ?? "Member Tarkam",
        payerNickname: transaction.payer_nickname ?? user?.name ?? "Member Tarkam",
        qrisContent: String(invoice.qris_content),
        qrisInvoiceId: invoice.qris_invoiceid ?? null,
        requestDate: invoice.qris_request_date ?? null,
        expiresAt: invoice.expires_at ?? null,
      };

      await printQrisInvoice(printPayload, paymentWindow);

      void showAlert({
        icon: "success",
        title: "Pembayaran siap",
        text: "QRIS checkout berhasil dibuat. Silakan scan atau cetak QRIS untuk menyelesaikan pembayaran pesanan.",
        confirmButtonText: "Tutup",
      });
    } catch (error) {
      console.error("Checkout failed", error);
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses pembayaran. Coba lagi atau periksa data kamu.";
      setErrorMessage(message);
      void showAlert({
        icon: "error",
        title: "Pembayaran gagal",
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
        eyebrow="Halaman Pembayaran"
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
                  <div className="form-field">
                    <input
                      className="form-control"
                      value={user?.name || ""}
                      placeholder="Akun pembayaran"
                      type="text"
                      id="payerName"
                      name="payerName"
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="form-field"><input className="form-control" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Telepon" required type="text" id="phoneNumber" name="phoneNumber" autoComplete="tel" /></div>
                </div>
                <div className="additional-info mb-30">
                  <h2>Info Tambahan</h2>
                  <div className="form-field">
                    <textarea className="form-control" cols={30} value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Catatan Pesanan" rows={3} id="orderNote" name="orderNote" />
                  </div>
                </div>
                <div className="payment-method">
                  <h2>Pembayaran QRIS</h2>
                  <p style={{ marginBottom: "20px", color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
                    QRIS pembayaran akan dibuat atas akun yang sedang login. Setelah QRIS dicetak, status pembayaran akan dicek otomatis oleh sistem setiap 1 menit.
                  </p>
                  <button className="default-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyiapkan QRIS...' : 'Cetak QRIS Pembayaran'}<span />
                  </button>
                </div>
                {errorMessage ? <p style={{ color: '#d9534f', marginTop: '1rem' }}>{errorMessage}</p> : null}
              </form>
            </div>
            <div className="col-lg-4 sm-padding">
              <ul className="cart-total">
                <li><span>Subtotal:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(subtotal)}</li>
                <li><span>Biaya tambahan:</span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(shipping)}</li>
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
