import { NewsSidebar, PageHeader, PagePagination, PostCard } from "@/galactic/common";
import type { NewsCategoryWidgetItem, NewsTagWidgetItem, PostItem } from "@/galactic/data";

type NewsGridContentProps = {
  posts: PostItem[];
  categories: NewsCategoryWidgetItem[];
  recentPosts: PostItem[];
  tags: NewsTagWidgetItem[];
  currentPage: number;
  totalPages: number;
  searchValue?: string;
  onSearch: (value: string) => void;
  onPageChange: (value: number) => void;
};

const NewsGridContent = ({
  posts,
  categories,
  recentPosts,
  tags,
  currentPage,
  totalPages,
  searchValue,
  onSearch,
  onPageChange,
}: NewsGridContentProps) => (
  <>
    <PageHeader
      eyebrow="News"
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
            <div className="pagination-wrapper">
              <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          </div>
          <div className="col-lg-4 sm-padding">
            <NewsSidebar
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

export { NewsGridContent };
