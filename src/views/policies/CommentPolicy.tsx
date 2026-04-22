import "@/assets/css/blog.css";
import SEO from "@/components/SEO";
import { PageHeader } from "@/galactic/common";

function CommentPolicy() {
  return (
    <>
      <SEO
        title="Kebijakan Komentar"
        description="Kebijakan Komentar untuk tiap halaman di situs Tarkam. Lihat aturan dan pedoman komentar."
        keywords={["kebijakan komentar", "aturan", "tarkam"]}
        type="website"
      />
      <PageHeader
        eyebrow="Detail Tarkam"
        title="Kebijakan Komentar"
        description="Kebijakan Komentar untuk tiap halaman di situs Tarkam. Lihat aturan dan pedoman komentar."
      />
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
              <h2>Kebijakan Komentar</h2>
              <p>Kami ingin mendengar pendapat Anda! Namun, mohon patuhi aturan berikut:</p>
              <ul className="tags mb-30">
                <li><strong>Sportivitas:</strong> Tidak ada ruang untuk hate speech atau pelecehan.</li>
                <li><strong>Relevansi:</strong> Pastikan komentar sesuai dengan topik yang relevan.</li>
                <li><strong>Moderasi:</strong> Komentar spam akan dihapus secara otomatis.</li>
                </ul>
              <ul className="tags mb-30">
                <li><a href="https://tarkam.fun">Tarkam</a></li>
                <li><a href="https://disqus.com/tarkam">Disqus</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CommentPolicy;
