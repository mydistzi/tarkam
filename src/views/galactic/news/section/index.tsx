import { ClassicBlogSidebar, PageHeader, PagePagination, PostCard } from "@/galactic/common";
import type { PostItem } from "@/galactic/data";

type CategoryWidgetItem = {
  id?: number;
  title: string;
  slug?: string;
  count?: number;
  path?: string;
};

type BlogClassicContentProps = {
  posts: PostItem[];
  categories: CategoryWidgetItem[];
  recentPosts: PostItem[];
  tags: string[];
  currentPage: number;
  totalPages: number;
  searchValue?: string;
  onSearch: (value: string) => void;
  onPageChange: (value: number) => void;
};

const BlogClassicContent = ({
  posts,
  categories,
  recentPosts,
  tags,
  currentPage,
  totalPages,
  searchValue,
  onSearch,
  onPageChange,
}: BlogClassicContentProps) => (
  <>
    <PageHeader
      eyebrow="Blog Tarkam"
      title="Berita &amp; Wawasan"
      description="Temukan publikasi resmi Tarkam dengan format klasik \n yang fokus pada konten dan kenyamanan membaca."
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
            <div className="pagination-wrapper">
              <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          </div>
          <div className="col-lg-4 sm-padding">
            <ClassicBlogSidebar
              categories={categories}
              recentPosts={recentPosts}
              tags={tags}
              searchValue={searchValue}
              onSearch={onSearch}
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { BlogClassicContent };
