import SEO from "@/components/SEO";

function DataDeletionPolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Penghapusan Data – Bot Discord Tarkam"
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
              <h2>Kebijakan Penghapusan Data</h2>
              <p>
                Tarkam memberi opsi bagi pengguna dan admin server untuk meminta
                penghapusan data yang tersimpan.
              </p>
              <h3 className="comment-title">1. Jenis Data yang Disimpan</h3>
              <p>Bot mungkin menyimpan data seperti:</p>
              <ul className="tags mb-30">
                <li>Konfigurasi server</li>
                <li>Log penggunaan perintah</li>
                <li>Identifier Discord (User ID, Server ID, Channel ID)</li>
              </ul>
              <h3 className="comment-title">2. Permintaan Penghapusan Data</h3>
              <p>Untuk meminta penghapusan data yang tersimpan:</p>
              <ul className="tags mb-30">
                <li>
                  Bergabung ke support server resmi:{" "}
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
              <h3 className="comment-title">3. Waktu Proses</h3>
              <p>
                Permintaan penghapusan data biasanya diproses dalam waktu 30
                hari.
              </p>
              <h3 className="comment-title">4. Penghapusan Otomatis</h3>
              <p>
                Jika bot dihapus dari sebuah server, data konfigurasi yang terkait
                bisa dihapus secara otomatis.
              </p>
              <h3 className="comment-title">5. Kontak & Dukungan</h3>
              <p>
                Untuk informasi lebih lanjut, silakan hubungi support server atau
                developer melalui Discord.
              </p>
              <blockquote className="mt-20">
                <i className="fas fa-quote-right" />
                Data akan dihapus sesuai permintaan selama permintaan tersebut
                sah dan sesuai dengan kapasitas operasional.
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

export default DataDeletionPolicy;
