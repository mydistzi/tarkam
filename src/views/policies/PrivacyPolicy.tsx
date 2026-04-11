import SEO from "@/components/SEO";
import { PageHeader } from "@/galactic/common";

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

      <PageHeader
        eyebrow="Kebijakan Privasi"
        title="Kebijakan Privasi"
        description="Kebijakan Privasi – Bot Discord & WhatsApp. Lihat bagaimana kami mengumpulkan dan menggunakan data kamu."
      />

      <section className="about-section padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 sm-padding">
              <div className="about-content">
                <div className="section-heading">
                  <h3>Syarat & Ketentuan - Last Updated: March 16, 2026</h3>
                  <h2>
                    Kebijakan Privasi <span>Discord</span> dan{" "}
                    <span>WhatsApp</span>
                  </h2>

                  <p>
                    Kebijakan Privasi ini ngejelasin gimana Tarkam mengumpulkan
                    dan memproses data saat dipakai di Discord.
                  </p>

                  <h3 className="mt-20">1. Informasi yang Kami Kumpulkan</h3>
                  <p>Untuk menjalankan bot, kami mungkin mengumpulkan:</p>
                  <ul>
                    <li>ID Pengguna Discord</li>
                    <li>ID Server (Guild)</li>
                    <li>ID Channel</li>
                    <li>Data penggunaan perintah</li>
                    <li>Setelan konfigurasi server</li>
                  </ul>
                  <p className="mt-20">
                    Kami tidak mengumpulkan informasi pribadi seperti nama asli,
                    alamat, atau password.
                  </p>

                  <h3 className="mt-20">2. Bagaimana Kami Menggunakan Data</h3>
                  <p>Data yang dikumpulkan dipakai untuk:</p>
                  <ul>
                    <li>Menjalankan perintah</li>
                    <li>Menyimpan setelan server</li>
                    <li>Meningkatkan fungsi bot</li>
                    <li>Debugging error</li>
                  </ul>

                  <h3 className="mt-20">3. Penyimpanan Data</h3>
                  <p>
                    Data bisa disimpan di server yang aman dan dikelola oleh
                    developer.
                  </p>
                  <p className="mt-20">
                    Data hanya disimpan selama perlu untuk menyediakan layanan.
                  </p>

                  <h3 className="mt-20">4. Berbagi Data</h3>
                  <p>Kami tidak menjual atau memperdagangkan data pengguna.</p>
                  <p className="mt-20">Data hanya akan dibagikan jika:</p>
                  <ul>
                    <li>Diwajibkan oleh hukum</li>
                    <li>Perlu untuk menjaga integritas layanan</li>
                  </ul>

                  <h3 className="mt-20">5. Keamanan</h3>
                  <p>
                    Kami menerapkan langkah teknis yang wajar untuk melindungi
                    data yang disimpan.
                  </p>
                  <p className="mt-20">
                    Tetapi, tidak ada sistem online yang bisa menjamin keamanan
                    mutlak.
                  </p>

                  <h3 className="mt-20">6. Hak Kamu</h3>
                  <p>
                    Administrator server bisa meminta penghapusan data yang
                    tersimpan.
                  </p>
                  <p className="mt-20">
                    Permintaan bisa diajukan lewat support server.
                  </p>

                  <h3 className="mt-20">7. Perubahan</h3>
                  <p>Kebijakan Privasi ini bisa diperbarui secara berkala.</p>
                  <p className="mt-20">
                    Penggunaan Bot setelah perubahan dipublikasikan dianggap
                    sebagai penerimaan perubahan tersebut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy;
