import { BlogSidebar, PageHeader, PagePagination, PostCard } from "@/galactic/common";
import type { PostItem } from "@/galactic/data";

type BlogGridContentProps = {
  posts: PostItem[];
  categories: string[];
};

const BlogGridContent = ({ posts, categories }: BlogGridContentProps) => (
  <>
    <PageHeader
      eyebrow="Blog"
      title={<>Berita Gaming &amp; Wawasan</>}
      description="Jelajahi berita resmi, pengumuman turnamen, dan wawasan komunitas langsung dari sumber resmi Tarkam."
    />
    <section className="blog-section blog-page padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 sm-padding">
            <div className="row grid-post">
              {posts.map((post, index) => (
                <div className="col-lg-6 col-md-6 padding-15" key={`grid-${post.title}-${index + 1}`}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
            <PagePagination />
          </div>
          <div className="col-lg-4 sm-padding">
            <BlogSidebar categories={categories} recentPosts={posts.slice(0, 3)} tags={Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8)} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { BlogGridContent };
