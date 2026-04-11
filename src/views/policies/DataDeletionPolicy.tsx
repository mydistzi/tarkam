import SEO from "@/components/SEO";
import { PageHeader } from "@/galactic/common";

function DataDeletionPolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Penghapusan Data – Bot Discord & WhatsApp Tarkam"
        description="Kebijakan Penghapusan Data Bot Discord & WhatsApp Tarkam. Pelajari cara minta data dihapus."
        keywords={[
          "penghapusan data",
          "gdpr",
          "hapus data",
          "bot discord",
          "whatsapp",
          "tarkam",
        ]}
        type="website"
      />

      <PageHeader
        eyebrow="Kebijakan Penghapusan Data"
        title="Kebijakan Penghapusan Data"
        description="Kebijakan Penghapusan Data Bot Discord & WhatsApp Tarkam. Pelajari cara minta data dihapus."
      />

      <section className="about-section padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 sm-padding">
              <div className="about-content">
                <div className="section-heading">
                  <h3>
                    Kebijakan Penghapusan Data - Last Updated: March 16, 2026
                  </h3>
                  <h1>Kebijakan Penghapusan Data</h1>

                  <p>
                    Tarkam memberi opsi bagi pengguna dan admin server untuk
                    minta penghapusan data yang tersimpan.
                  </p>

                  <h3 className="mt-20">1. Jenis Data yang Disimpan</h3>
                  <p>Bot mungkin menyimpan:</p>
                  <ul>
                    <li>Konfigurasi server</li>
                    <li>Log penggunaan perintah</li>
                    <li>Identifier Discord (User ID, Server ID, Channel ID)</li>
                  </ul>

                  <h3 className="mt-20">2. Permintaan Penghapusan Data</h3>
                  <p>Untuk minta penghapusan data yang tersimpan:</p>
                  <ul>
                    <li>
                      Bergabung ke support server{" "}
                      <a
                        href="https://discord.gg/fnRhRkxTyC"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://discord.gg/fnRhRkxTyC
                      </a>
                    </li>
                    <li>Hubungi developer atau buat permintaan dukungan.</li>
                  </ul>

                  <h3 className="mt-20">3. Waktu Proses</h3>
                  <p>
                    Permintaan penghapusan data biasanya diproses dalam waktu 30
                    hari.
                  </p>

                  <h3 className="mt-20">4. Penghapusan Otomatis</h3>
                  <p>
                    Jika bot dihapus dari sebuah server, data konfigurasi server
                    yang terkait bisa dihapus secara otomatis.
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

export default DataDeletionPolicy;
