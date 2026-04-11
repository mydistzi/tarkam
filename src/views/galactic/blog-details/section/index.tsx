import { Link } from "react-router-dom";
import { comment1, DisqusThread, PageHeader } from "@/galactic/common";
import type { BlogRecord } from "../../shared";

type BlogDetailsContentProps = {
  record?: BlogRecord;
  previousPath?: string;
  nextPath?: string;
};

const BlogDetailsContent = ({ record, previousPath, nextPath }: BlogDetailsContentProps) => {
  if (!record) {
    return (
      <section className="blog-section blog-page padding-top">
        <div className="container">
          <h2>Belum ada artikel blog.</h2>
        </div>
      </section>
    );
  }

  const post = record.item;

  return (
    <>
      <PageHeader
        eyebrow="Detail Blog"
        title={post.title}
        className="single"
        description="Halaman artikel ini sekarang terisi dari API blog publik, sambil tetap jaga layout baca panjang galactic."
        meta={
          <ul className="post-meta">
            <li><i className="las la-user" />{post.author}</li>
            <li><i className="las la-calendar" />{post.date}</li>
            <li><i className="las la-comments" />Komentar 0</li>
          </ul>
        }
      />
      <section className="blog-section blog-page padding-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="post-details">
                <div className="post-thumb">
                  <img src={post.image} alt={post.title} />
                </div>
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <blockquote>
                  <i className="fas fa-quote-right" />
                  Konten, routing, dan metadata halaman ini sekarang dikendalikan oleh feed blog live.
                  <span>- Frontend Galactic</span>
                </blockquote>
                <ul className="tags">
                  {post.tags.map((tag) => (
                    <li key={tag}><a href="#">{tag}</a></li>
                  ))}
                </ul>
                <ul className="post-navigation">
                  <li>
                    <Link to={previousPath || post.path || "/blog-grid"}>
                      <span><i className="las la-angle-left" />Sebelumnya</span>
                      Lihat artikel sebelumnya
                    </Link>
                  </li>
                  <li>
                    <Link to={nextPath || post.path || "/blog-grid"}>
                      <span>Selanjutnya<i className="las la-angle-right" /></span>
                      Lihat artikel selanjutnya
                    </Link>
                  </li>
                </ul>
                <div className="author-box">
                  <div className="author-thumb">
                    <img src={comment1} alt={post.author} />
                  </div>
                  <div className="author-info">
                    <h3>{post.author}</h3>
                    <p>Field author ini fallback ke pengaturan situs kalau API ngembaliin artikel tanpa profil user publik.</p>
                    <ul className="social-icon">
                      <li><a href="#"><i className="lab la-facebook-f" /></a></li>
                      <li><a href="#"><i className="lab la-twitter" /></a></li>
                      <li><a href="#"><i className="lab la-instagram" /></a></li>
                      <li><a href="#"><i className="lab la-behance" /></a></li>
                    </ul>
                  </div>
                </div>
                <h3 className="comment-title">Komentar Artikel</h3>
                <DisqusThread identifier={post.path || post.title || `blog-${post.date}`} title={post.title || "Artikel Blog"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsContent;