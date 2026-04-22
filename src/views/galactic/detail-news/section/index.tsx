import { Link } from "react-router-dom";
import { DisqusThread, PageHeader } from "@/galactic/common";
import { buildNewsTagPath, galacticRoutes } from "@/galactic/data";
import { placeholderPost } from "@/galactic/placeholders";
import type { NewsRecord } from "../../shared";

type NewsDetailsContentProps = {
  record?: NewsRecord;
  previousPath?: string;
  nextPath?: string;
};

const slugifyTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const NewsDetailsContent = ({ record, previousPath, nextPath }: NewsDetailsContentProps) => {
  if (!record) {
    return (
      <section className="blog-section blog-page padding-top">
        <div className="container">
          <h2>Belum ada artikel news.</h2>
        </div>
      </section>
    );
  }

  const post = record.item;

  return (
    <>
      <PageHeader
        eyebrow="Detail Artikel"
        title={post.title}
        className="single"
        description="Baca artikel lengkap dengan informasi terbaru, komentar, dan metadata resmi Tarkam."
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
                  <img src={post.image || placeholderPost} alt={post.title} />
                </div>
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <blockquote>
                  <i className="las la-quote-right" />
                  Artikel ini disajikan dengan konten resmi dan metadata terkini dari arsip berita Tarkam.
                  <span>- Tim Redaksi Tarkam</span>
                </blockquote>
                <ul className="tags">
                  {post.tags.map((tag) => {
                    const tagSlug = slugifyTag(tag);
                    return (
                      <li key={tag}>
                        <Link to={buildNewsTagPath(tagSlug)}>{tag}</Link>
                      </li>
                    );
                  })}
                </ul>
                <ul className="post-navigation">
                  <li>
                    <Link to={previousPath || post.path || galacticRoutes.news}>
                      <span><i className="las la-angle-left" />Sebelumnya</span>
                      Lihat artikel sebelumnya
                    </Link>
                  </li>
                  <li>
                    <Link to={nextPath || post.path || galacticRoutes.news}>
                      <span>Selanjutnya<i className="las la-angle-right" /></span>
                      Lihat artikel selanjutnya
                    </Link>
                  </li>
                </ul>
                <div className="author-box">
                  <div className="author-thumb">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&color=FCFCFC&background=0c0c35`} alt={post.author} />
                  </div>
                  <div className="author-info">
                    <h3>{post.author}</h3>
                    <p>Informasi penulis ditampilkan untuk memberi konteks dan kredibilitas pada setiap artikel Tarkam.</p>
                    <ul className="social-icon">
                      <li><a href="#"><i className="lab la-facebook-f" /></a></li>
                      <li><a href="#"><i className="lab la-twitter" /></a></li>
                      <li><a href="#"><i className="lab la-instagram" /></a></li>
                      <li><a href="#"><i className="lab la-behance" /></a></li>
                    </ul>
                  </div>
                </div>
                <h3 className="comment-title">Komentar Artikel</h3>
                <DisqusThread identifier={post.path || post.title || `news-${post.date}`} title={post.title || "Artikel News"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetailsContent;
