export type QrisInvoicePayload = {
  title: string;
  description?: string;
  amount: number;
  transactionCode: string;
  payerName?: string | null;
  payerNickname?: string | null;
  qrisContent: string;
  qrisInvoiceId?: string | null;
  requestDate?: string | null;
  expiresAt?: string | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

let qrcodeLoader: Promise<(typeof import("qrcode"))["default"]> | null = null;

const getQrCode = async () => {
  if (!qrcodeLoader) {
    qrcodeLoader = import("qrcode").then((module) => module.default);
  }

  return qrcodeLoader;
};

export const prepareQrisPrintWindow = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.open("", "_blank", "noopener,noreferrer,width=920,height=960");
};

export async function printQrisInvoice(
  payload: QrisInvoicePayload,
  printWindow: Window | null = prepareQrisPrintWindow(),
) {
  if (!printWindow) {
    throw new Error("Pop-up diblokir. Izinkan jendela baru untuk mencetak QRIS.");
  }

  const QRCode = await getQrCode();
  const qrisImage = await QRCode.toDataURL(payload.qrisContent, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 920,
    color: {
      dark: "#081226",
      light: "#ffffff",
    },
  });

  const payerLabel = payload.payerNickname || payload.payerName || "Member Tarkam";

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${payload.title}</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        background: #eef3fb;
        color: #081226;
      }
      .sheet {
        max-width: 760px;
        margin: 0 auto;
        padding: 32px 24px 40px;
      }
      .card {
        background: #fff;
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 18px 60px rgba(8, 18, 38, 0.12);
      }
      .eyebrow {
        letter-spacing: 0.12em;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #0f62fe;
      }
      h1 {
        margin: 12px 0 8px;
        font-size: 28px;
      }
      p {
        margin: 0;
        line-height: 1.7;
        color: #4d5b78;
      }
      .qr-wrap {
        margin: 28px 0;
        padding: 24px;
        border-radius: 20px;
        background: linear-gradient(180deg, #f8fbff 0%, #edf4ff 100%);
        text-align: center;
      }
      .qr-wrap img {
        width: min(100%, 380px);
        height: auto;
        display: block;
        margin: 0 auto 16px;
        background: #fff;
        padding: 14px;
        border-radius: 18px;
        box-shadow: inset 0 0 0 1px rgba(8, 18, 38, 0.08);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 24px;
      }
      .meta {
        border: 1px solid rgba(8, 18, 38, 0.08);
        border-radius: 16px;
        padding: 16px;
        background: #fff;
      }
      .meta-label {
        display: block;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #71819f;
        margin-bottom: 6px;
      }
      .meta-value {
        font-weight: 700;
        font-size: 16px;
        color: #081226;
        word-break: break-word;
      }
      .note {
        margin-top: 20px;
        padding: 16px 18px;
        border-radius: 16px;
        background: #fff7e9;
        color: #755301;
        font-size: 14px;
      }
      .actions {
        display: flex;
        gap: 12px;
        margin-top: 28px;
      }
      .button {
        appearance: none;
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        cursor: pointer;
        font-weight: 700;
      }
      .button-primary {
        background: #0f62fe;
        color: #fff;
      }
      .button-secondary {
        background: #eef3fb;
        color: #081226;
      }
      @media print {
        body {
          background: #fff;
        }
        .sheet {
          padding: 0;
          max-width: none;
        }
        .card {
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        .actions {
          display: none;
        }
      }
      @media (max-width: 640px) {
        .card {
          padding: 24px;
        }
        .grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="card">
        <div class="eyebrow">Interactive QRIS</div>
        <h1>${payload.title}</h1>
        <p>${payload.description || "Gunakan QRIS berikut untuk menyelesaikan pembayaran. Setelah transaksi terkonfirmasi, status pembayaran akan diperbarui otomatis oleh sistem."}</p>

        <div class="qr-wrap">
          <img src="${qrisImage}" alt="QRIS ${payload.title}" />
          <strong>Scan QRIS untuk membayar ${formatCurrency(payload.amount)}</strong>
        </div>

        <div class="grid">
          <div class="meta">
            <span class="meta-label">Nominal</span>
            <div class="meta-value">${formatCurrency(payload.amount)}</div>
          </div>
          <div class="meta">
            <span class="meta-label">Atas Nama</span>
            <div class="meta-value">${payerLabel}</div>
          </div>
          <div class="meta">
            <span class="meta-label">Kode Transaksi</span>
            <div class="meta-value">${payload.transactionCode}</div>
          </div>
          <div class="meta">
            <span class="meta-label">Invoice QRIS</span>
            <div class="meta-value">${payload.qrisInvoiceId || "-"}</div>
          </div>
          <div class="meta">
            <span class="meta-label">Dibuat</span>
            <div class="meta-value">${formatDateTime(payload.requestDate)}</div>
          </div>
          <div class="meta">
            <span class="meta-label">Berlaku Sampai</span>
            <div class="meta-value">${formatDateTime(payload.expiresAt)}</div>
          </div>
        </div>

        <div class="note">
          QRIS Interactive biasanya berlaku sekitar 30 menit sejak invoice dibuat. Jika QRIS kedaluwarsa, buat ulang invoice dari halaman Tarkam atau checkout.
        </div>

        <div class="actions">
          <button class="button button-primary" onclick="window.print()">Cetak QRIS</button>
          <button class="button button-secondary" onclick="window.close()">Tutup</button>
        </div>
      </div>
    </div>
    <script>
      window.onload = function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 250);
      };
    </script>
  </body>
</html>`);
  printWindow.document.close();
}
