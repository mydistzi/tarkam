import SEO from "@/components/SEO";

function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Privasi – Bot Discord Tarkam"
        description="Kebijakan Privasi Bot Discord Tarkam. Lihat bagaimana kami mengumpulkan dan menggunakan data kamu."
        keywords={[
          "kebijakan privasi",
          "perlindungan data",
          "bot discord",
          "tarkam",
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
              src="/assets/images/placeholder-discord.png"
              alt="Discord"
            />
            <h3 className="left-team">Discord</h3>
            <div className="vs">
              <h2>vs</h2>
            </div>
            <h3 className="right-team">WhatsApp</h3>
            <img
              className="right"
              src="/assets/images/placeholder-whatsapp.png"
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
                Kebijakan Privasi <span>Discord</span> dan <span>WhatsApp</span>
              </h2>
              <p>
                Kebijakan Privasi ini ngejelasin gimana Tarkam mengumpulkan dan
                memproses data saat dipakai di Discord dan WhatsApp.
              </p>
              <p>
                Kami menghormati privasi kamu dan berkomitmen untuk menjaga data
                yang diperlukan agar layanan berjalan dengan baik.
              </p>
              <h3 className="comment-title">1. Informasi yang Kami Kumpulkan</h3>
              <p>Untuk menjalankan bot, kami mungkin mengumpulkan data seperti:</p>
              <ul className="tags mb-30">
                <li>ID pengguna Discord</li>
                <li>ID server (Guild)</li>
                <li>ID channel</li>
                <li>Data penggunaan perintah</li>
                <li>Setelan konfigurasi server</li>
              </ul>
              <blockquote className="mt-20">
                <i className="fas fa-quote-right" />
                Kami tidak mengumpulkan informasi pribadi seperti nama asli,
                alamat, atau password.
              </blockquote>
              <h3 className="comment-title">2. Bagaimana Kami Menggunakan Data</h3>
              <p>Data tersebut digunakan untuk:</p>
              <ul className="tags mb-30">
                <li>Menjalankan perintah</li>
                <li>Menyimpan setelan server</li>
                <li>Meningkatkan fungsi bot</li>
                <li>Debugging error</li>
              </ul>
              <blockquote className="mt-20">
                <i className="fas fa-quote-right" />
                Data hanya dipakai untuk operasional dan peningkatan layanan.
              </blockquote>
              <h3 className="comment-title">3. Penyimpanan Data</h3>
              <p>
                Data disimpan di server yang aman dan hanya dipertahankan selama
                diperlukan untuk menyediakan layanan.
              </p>
              <p>
                Jika tidak lagi diperlukan, data akan dihapus sesuai kebutuhan
                operasional.
              </p>
              <h3 className="comment-title">4. Berbagi Data</h3>
              <p>
                Kami tidak menjual atau memperdagangkan data pengguna kepada pihak
                ketiga.
              </p>
              <p>Data hanya bisa dibagikan jika:</p>
              <ul className="tags mb-30">
                <li>Diwajibkan oleh hukum</li>
                <li>Perlu untuk menjaga integritas layanan</li>
              </ul>
              <h3 className="comment-title">5. Keamanan</h3>
              <p>
                Kami menerapkan langkah teknis wajar untuk melindungi data yang
                disimpan.
              </p>
              <p>
                Namun, tidak ada sistem online yang dapat menjamin keamanan
                mutlak.
              </p>
              <h3 className="comment-title">6. Hak Kamu</h3>
              <p>
                Administrator server atau pengguna bisa mengajukan permintaan
                penghapusan data melalui support server.
              </p>
              <p>
                Silakan ajukan permintaan secara resmi jika kamu ingin data yang
                tersimpan dihapus.
              </p>
              <h3 className="comment-title">7. Perubahan Kebijakan</h3>
              <p>Kebijakan Privasi ini bisa diperbarui secara berkala.</p>
              <p>
                Penggunaan Bot setelah perubahan dipublikasikan dianggap sebagai
                penerimaan atas kebijakan versi terbaru.
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

export default PrivacyPolicy;
