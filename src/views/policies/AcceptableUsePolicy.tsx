import "@/assets/css/blog.css";
import SEO from "@/components/SEO";
import { placeholderDiscord, placeholderWhatsapp } from "@/galactic/placeholders";

function AcceptableUsePolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Penggunaan yang Diterima – Bot Discord Tarkam"
        description="Kebijakan Penggunaan Bot Discord Tarkam. Baca aturan pakai bot kami."
        keywords={["kebijakan penggunaan", "aturan", "bot discord", "tarkam"]}
        type="website"
      />
      <section className="page-header match-details">
        <div className="page-header-shape">
          <div className="shape" />
          <div className="shape center" />
          <div className="shape center back" />
          <div className="shape right" />
        </div>
        <div className="container">
          <div className="match-details-header">
            <img
              className="left"
              src={placeholderDiscord}
              alt="Discord"
            />
            <h3 className="left-team">Discord</h3>
            <div className="vs">
              <h2>vs</h2>
            </div>
            <h3 className="right-team">WhatsApp</h3>
            <img
              className="right"
              src={placeholderWhatsapp}
              alt="WhatsApp"
            />
          </div>
        </div>
      </section>
      <section className="match-details-section padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="match-details">
              <ul className="post-meta">
                <li>
                  <i className="las la-calendar" />
                  Last Updated: March 16, 2026
                </li>
              </ul>
              <h2>Kebijakan Penggunaan yang Diterima</h2>
              <p>
                Pengguna Bot Tarkam di Discord dan WhatsApp harus mengikuti
                aturan berikut.
              </p>
              <h3 className="comment-title">1. Kegiatan yang Dilarang</h3>
              <p>Pengguna tidak boleh:</p>
              <ul className="tags mb-30">
                <li>Menggunakan bot untuk spam atau raid server</li>
                <li>Memanfaatkan celah keamanan</li>
                <li>Mencoba membebani atau mengganggu layanan</li>
                <li>
                  Menggunakan otomatisasi untuk menyalahgunakan perintah
                </li>
                <li>Menggunakan bot untuk menyebarkan malware</li>
                <li>
                  Melakukan pelecehan atau ancaman terhadap pengguna lain
                </li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Pelanggaran dapat mengakibatkan tindakan penegakan oleh
                developer.
              </blockquote>
              <h3 className="comment-title">2. Penegakan</h3>
              <p>Pelanggaran dapat mengakibatkan:</p>
              <ul className="tags mb-30">
                <li>Pembatasan perintah</li>
                <li>Pemblokiran pengguna</li>
                <li>Pemblokiran server</li>
                <li>Pencabutan akses secara permanen</li>
              </ul>
              <h3 className="comment-title">3. Tanggung Jawab Pengguna</h3>
              <p>
                Pengguna bertanggung jawab atas tindakan mereka sendiri dalam
                menggunakan bot.
              </p>
              <p>
                Pastikan semua aktivitas mematuhi hukum, aturan Discord, dan
                pedoman komunitas.
              </p>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Developer berhak menangguhkan atau mencabut akses jika aturan
                ini dilanggar.
              </blockquote>
              <ul className="tags mb-30">
                <li><a href="https://discord.com">Discord</a></li>
                <li><a href="https://web.whatsapp.com">Whatsapp</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AcceptableUsePolicy;
