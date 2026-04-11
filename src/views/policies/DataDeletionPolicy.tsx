import SEO from '@/components/SEO';

function DataDeletionPolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Kebijakan Penghapusan Data – Bot Discord Tarkam"
        description="Kebijakan Penghapusan Data Bot Discord Tarkam. Pelajari cara minta data dihapus."
        keywords={["penghapusan data", "gdpr", "hapus data", "bot discord", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Kebijakan Penghapusan Data</h1>
          <p className="last-updated">Last Updated: March 16, 2026</p>

          <p>Tarkam memberi opsi bagi pengguna dan admin server untuk minta penghapusan data yang tersimpan.</p>

          <h2>1. Jenis Data yang Disimpan</h2>
          <p>Bot mungkin menyimpan:</p>
          <ul>
            <li>Konfigurasi server</li>
            <li>Log penggunaan perintah</li>
            <li>Identifier Discord (User ID, Server ID, Channel ID)</li>
          </ul>

          <h2>2. Permintaan Penghapusan Data</h2>
          <p>Untuk minta penghapusan data yang tersimpan:</p>
          <ul>
            <li>Bergabung ke support server <a href="https://discord.gg/fnRhRkxTyC" target="_blank" rel="noopener noreferrer">https://discord.gg/fnRhRkxTyC</a></li>
            <li>Hubungi developer atau buat permintaan dukungan.</li>
          </ul>

          <h2>3. Waktu Proses</h2>
          <p>Permintaan penghapusan data biasanya diproses dalam waktu 30 hari.</p>

          <h2>4. Penghapusan Otomatis</h2>
          <p>Jika bot dihapus dari sebuah server, data konfigurasi server yang terkait bisa dihapus secara otomatis.</p>
        </div>
      </div>
    </div>
  );
}

export default DataDeletionPolicy;