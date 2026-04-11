import SEO from '@/components/SEO';

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <SEO
        title="Kebijakan Privasi – Bot Discord Tarkam"
        description="Kebijakan Privasi Bot Discord Tarkam. Lihat bagaimana kami mengumpulkan dan menggunakan data kamu."
        keywords={["kebijakan privasi", "perlindungan data", "bot discord", "tarkam"]}
        type="website"
      />

      <div className="container">
        <div className="policy-content">
          <h1>Kebijakan Privasi</h1>
          <p className="last-updated">Last Updated: March 16, 2026</p>

          <p>Kebijakan Privasi ini ngejelasin gimana Tarkam mengumpulkan dan memproses data saat dipakai di Discord.</p>

          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>Untuk menjalankan bot, kami mungkin mengumpulkan:</p>
          <ul>
            <li>ID Pengguna Discord</li>
            <li>ID Server (Guild)</li>
            <li>ID Channel</li>
            <li>Data penggunaan perintah</li>
            <li>Setelan konfigurasi server</li>
          </ul>
          <p>Kami tidak mengumpulkan informasi pribadi seperti nama asli, alamat, atau password.</p>

          <h2>2. Bagaimana Kami Menggunakan Data</h2>
          <p>Data yang dikumpulkan dipakai untuk:</p>
          <ul>
            <li>Menjalankan perintah</li>
            <li>Menyimpan setelan server</li>
            <li>Meningkatkan fungsi bot</li>
            <li>Debugging error</li>
          </ul>

          <h2>3. Penyimpanan Data</h2>
          <p>Data bisa disimpan di server yang aman dan dikelola oleh developer.</p>
          <p>Data hanya disimpan selama perlu untuk menyediakan layanan.</p>

          <h2>4. Berbagi Data</h2>
          <p>Kami tidak menjual atau memperdagangkan data pengguna.</p>
          <p>Data hanya akan dibagikan jika:</p>
          <ul>
            <li>Diwajibkan oleh hukum</li>
            <li>Perlu untuk menjaga integritas layanan</li>
          </ul>

          <h2>5. Keamanan</h2>
          <p>Kami menerapkan langkah teknis yang wajar untuk melindungi data yang disimpan.</p>
          <p>Tetapi, tidak ada sistem online yang bisa menjamin keamanan mutlak.</p>

          <h2>6. Hak Kamu</h2>
          <p>Administrator server bisa meminta penghapusan data yang tersimpan.</p>
          <p>Permintaan bisa diajukan lewat support server.</p>

          <h2>7. Perubahan</h2>
          <p>Kebijakan Privasi ini bisa diperbarui secara berkala.</p>
          <p>Penggunaan Bot setelah perubahan dipublikasikan dianggap sebagai penerimaan perubahan tersebut.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;