import SEO from '@/components/SEO';

function AcceptableUsePolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Kebijakan Penggunaan yang Diterima – Bot Discord Tarkam"
        description="Kebijakan Penggunaan Bot Discord Tarkam. Baca aturan pakai bot kami."
        keywords={["kebijakan penggunaan", "aturan", "bot discord", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Kebijakan Penggunaan yang Diterima</h1>

          <p>Pengguna Bot Tarkam di Discord harus mengikuti aturan berikut.</p>

          <h2>Kegiatan yang Dilarang</h2>
          <p>Pengguna tidak boleh:</p>
          <ul>
            <li>Menggunakan bot untuk spam atau raid server</li>
            <li>Memanfaatkan celah keamanan</li>
            <li>Mencoba membebani atau mengganggu layanan</li>
            <li>Menggunakan otomatisasi untuk menyalahgunakan perintah</li>
            <li>Menggunakan bot untuk menyebarkan malware</li>
            <li>Melakukan pelecehan atau ancaman terhadap pengguna lain</li>
          </ul>

          <h2>Penegakan</h2>
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
  );
}

export default AcceptableUsePolicy;