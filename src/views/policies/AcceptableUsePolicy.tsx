import SEO from "@/components/SEO";
import { PageHeader } from "@/galactic/common";

function AcceptableUsePolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Penggunaan yang Diterima – Bot Discord Tarkam"
        description="Kebijakan Penggunaan Bot Discord Tarkam. Baca aturan pakai bot kami."
        keywords={["kebijakan penggunaan", "aturan", "bot discord", "tarkam"]}
        type="website"
      />

      <PageHeader
        eyebrow="Kebijakan Penggunaan yang Diterima"
        title="Kebijakan Penggunaan yang Diterima"
        description="Kebijakan Penggunaan Bot Discord & WhatsApp yang Diterima – Baca aturan pakai bot kami."
      />
      
      <section className="about-section padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 sm-padding">
              <div className="about-content">
                <div className="section-heading">
                  <h3>Kebijakan Penggunaan - Last Updated: March 16, 2026</h3>
                  <h1>Kebijakan Penggunaan yang Diterima</h1>

                  <p>
                    Pengguna Bot Tarkam di Discord harus mengikuti aturan
                    berikut.
                  </p>

                  <h3 className="mt-20">Kegiatan yang Dilarang</h3>
                  <p>Pengguna tidak boleh:</p>
                  <ul>
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

                  <h3 className="mt-20">Penegakan</h3>
                  <p>Pelanggaran dapat mengakibatkan:</p>
                  <ul>
                    <li>Pembatasan perintah</li>
                    <li>Pemblokiran pengguna</li>
                    <li>Pemblokiran server</li>
                    <li>Pencabutan akses secara permanen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AcceptableUsePolicy;
