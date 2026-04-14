import { ClassicBlogSidebar, PageHeader, PostCard } from "@/galactic/common";
import type { PostItem } from "@/galactic/data";

type BlogClassicContentProps = {
  posts: PostItem[];
  categories: string[];
};

const BlogClassicContent = ({ posts, categories }: BlogClassicContentProps) => (
  <>
    <PageHeader
      eyebrow="Blog Klasik"
      title={<>Berita Gaming &amp; Wawasan</>}
      description="Temukan publikasi resmi Tarkam dengan format klasik yang fokus pada konten dan kenyamanan membaca."
    />
    <section className="blog-section blog-page padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 sm-padding">
            <div className="classic-post">
              {posts.map((post, index) => (
                <div className="wow fade-in-bottom" data-wow-delay={`${200 + index * 100}ms`} key={`classic-${post.title}-${index + 1}`}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4 sm-padding">
            <ClassicBlogSidebar categories={categories} recentPosts={posts.slice(0, 3)} tags={Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8)} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { BlogClassicContent };
