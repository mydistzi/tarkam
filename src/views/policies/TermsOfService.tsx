import "@/assets/css/blog.css";
import SEO from "@/components/SEO";
import { placeholderDiscord, placeholderWhatsapp } from "@/galactic/placeholders";

function TermsOfService() {
  return (
    <>
      <SEO
        title="Syarat Penggunaan – Bot Discord Tarkam"
        description="Aturan dan ketentuan pakai Bot Discord Tarkam. Baca dulu sebelum pakai."
        keywords={[
          "syarat penggunaan",
          "bot discord",
          "tarkam",
          "ketentuan",
          "legal",
        ]}
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
              <h2>
                Syarat dan Ketentuan penggunaan bot <span>Discord</span> dan{" "}
                <span>WhatsApp</span>
              </h2>
              <p>
                Halaman ini ngejelasin aturan main dan ketentuan pakai Bot
                Discord Tarkam ("Bot", "Layanan") yang dijalankan oleh Dist
                ("Developer", "kami").
              </p>
              <p>
                Dengan mengundang, mengakses, atau memakai Bot lewat
                Discord/WhatsApp, kamu setuju sama syarat ini. Kalau nggak
                setuju, berhenti pakai Bot sekarang juga.
              </p>
              <h3 className="comment-title">1. Deskripsi Layanan</h3>
              <p>
                Tarkam adalah bot Discord yang dirancang untuk bantu server
                dengan fitur-fitur seperti:
              </p>
              <ul>
                <li>Alat moderasi server</li>
                <li>Perintah otomatis dan utility</li>
                <li>Fitur engagement komunitas</li>
                <li>Fungsi hiburan atau game-related</li>
                <li>Integrasi dengan layanan atau API eksternal</li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Fitur bisa diubah, ditambah, atau dihapus kapan saja tanpa
                pemberitahuan terlebih dahulu.
                <span>
                  Untuk info lebih lanjut tentang Bot, kunjungi:{" "}
                  <a
                    href="https://tarkam.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://tarkam.fun
                  </a>
                </span>
              </blockquote>
              <h3 className="comment-title">2. Kelayakan</h3>
              <p>Untuk pakai Bot, kamu harus:</p>
              <ul className="tags mb-30">
                <li>
                  Berusia minimal 13 tahun atau sesuai ketentuan umur Discord.
                </li>
                <li>Mematuhi semua hukum dan aturan yang berlaku.</li>
                <li>
                  Ikut Discord Terms of Service dan Discord Community
                  Guidelines.
                </li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Kalau nggak taat, akses kamu bisa dibatasi atau Bot bisa dicabut
                dari server.
              </blockquote>

              <h3 className="comment-title">3. Penggunaan Wajar</h3>
              <p>
                Pengguna setuju untuk tidak menyalahgunakan Bot, termasuk tapi
                tidak terbatas pada:
              </p>
              <ul className="tags mb-30">
                <li>Melanggar aturan Discord atau ketentuan ini</li>
                <li>Mengganggu, mengancam, atau menyakiti pengguna lain</li>
                <li>Mengirim spam atau perintah jahat</li>
                <li>Eksploit bug atau mencoba akses tidak sah</li>
                <li>Menggunakan Bot untuk aktivitas ilegal</li>
                <li>Mengganggu fungsi normal Bot</li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Developer berhak suspend, blokir, atau banned user atau server
                yang melanggar aturan.
              </blockquote>

              <h3 className="comment-title">4. Pengumpulan Data</h3>
              <p>
                Agar layanan berjalan, Bot bisa mengumpulkan dan memproses data
                teknis terbatas seperti:
              </p>
              <ul className="tags mb-30">
                <li>ID pengguna Discord</li>
                <li>ID server (Guild)</li>
                <li>ID channel</li>
                <li>Log penggunaan perintah</li>
                <li>Setelan konfigurasi server</li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Data ini hanya dipakai untuk operasional, debugging, dan
                ningkatin layanan.
                <span>Kami tidak menjual atau membagikan data pribadi ke pihak ketiga
                kecuali jika diwajibkan oleh hukum.</span>
              </blockquote>

              <h3 className="comment-title">5. Penyimpanan Data & Retensi</h3>
              <p>
                Beberapa data bisa disimpan sementara atau dipertahankan sesuai
                fitur yang aktif di server.
              </p>
              <p>
                Administrator server atau pengguna bisa minta data dihapus lewat
                support server:
              </p>
              <p>
                Support Server:{" "}
                <a
                  href="https://discord.gg/fnRhRkxTyC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://discord.gg/fnRhRkxTyC
                </a>
              </p>

              <h3 className="comment-title">6. Ketersediaan Layanan</h3>
              <p>
                Bot disediakan apa adanya dan tidak selalu terjamin tersedia.
              </p>
              <p>Kami tidak menjamin bahwa layanan akan:</p>
              <ul className="tags mb-30">
                <li>Selalu tersedia tanpa gangguan</li>
                <li>Bebas dari bug atau error</li>
                <li>Memenuhi harapan semua pengguna</li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Developer berhak mengubah, menangguhkan, atau menghentikan
                layanan kapan saja tanpa pemberitahuan.
              </blockquote>

              <h3 className="comment-title">7. Batas Tanggung Jawab</h3>
              <p>Sejauh diizinkan hukum, Dist tidak bertanggung jawab atas:</p>
              <ul className="tags mb-30">
                <li>Hilangnya atau rusaknya data</li>
                <li>Salah konfigurasi server</li>
                <li>Gangguan atau jeda layanan</li>
                <li>
                  Kerugian tidak langsung yang muncul akibat penggunaan Bot
                </li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Penggunaan Bot adalah risiko kamu sendiri.
              </blockquote>

              <h3 className="comment-title">8. Penghentian</h3>
              <p>Kami berhak:</p>
              <ul className="tags mb-30">
                <li>Membatasi akses untuk pengguna atau server tertentu</li>
                <li>Mengeluarkan Bot dari server mana pun</li>
                <li>Menangguhkan atau menghentikan layanan sepenuhnya</li>
              </ul>
              <blockquote className="mt-20">
                <i className="las la-quote-right" />
                Pengguna bisa berhenti pakai Bot kapan saja dengan menghapusnya
                dari server Discord.
              </blockquote>

              <h3 className="comment-title">9. Perubahan Syarat</h3>
              <p>Kami bisa memperbarui syarat ini secara berkala.</p>
              <p>
                Penggunaan Bot setelah perubahan dipublikasi dianggap sebagai
                penerimaan syarat yang direvisi.
              </p>
              <p>Update bisa diumumkan di:</p>
              <ul className="tags mb-30">
                <li>
                  <a
                    href="https://tarkam.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://tarkam.fun
                  </a>
                </li>
                <li>Support server resmi</li>
              </ul>

              <h3 className="comment-title">10. Kontak & Dukungan</h3>
              <p>
                Kalau ada pertanyaan tentang syarat ini, hubungi kami lewat:
              </p>
              <ul className="tags mb-30">
                <li>Website:{" "}
                <a
                  href="https://tarkam.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://tarkam.fun
                </a></li>
                <li>Support Server:{" "}
                <a
                  href="https://discord.gg/fnRhRkxTyC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    https://discord.gg/fnRhRkxTyC
                </a></li>
                <li>Developer: <a
                  href="https://instagram.com/mydistzi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dist
                </a></li>
              </ul>

              <h3 className="comment-title">11. Hukum yang Berlaku</h3>
              <p>
                Syarat ini diatur oleh hukum Indonesia dan yurisdiksi Jakarta.
              </p>
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

export default TermsOfService;
