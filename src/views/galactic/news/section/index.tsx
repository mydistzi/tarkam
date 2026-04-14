import { ClassicNewsSidebar, PageHeader, PagePagination, PostCard } from "@/galactic/common";
import type { NewsCategoryWidgetItem, NewsTagWidgetItem, PostItem } from "@/galactic/data";

type NewsContentProps = {
  posts: PostItem[];
  categories: NewsCategoryWidgetItem[];
  recentPosts: PostItem[];
  tags: NewsTagWidgetItem[];
  currentPage: number;
  totalPages: number;
  searchValue?: string;
  selectedCategory?: string;
  selectedTag?: string;
  onSearch: (value: string) => void;
  onCategorySelect: (slug?: string) => void;
  onTagSelect: (tag?: string) => void;
  onPageChange: (value: number) => void;
};

const NewsContent = ({
  posts,
  categories,
  recentPosts,
  tags,
  currentPage,
  totalPages,
  searchValue,
  selectedCategory,
  selectedTag,
  onSearch,
  onCategorySelect,
  onTagSelect,
  onPageChange,
}: NewsContentProps) => (
  <>
    <PageHeader
      eyebrow="News Tarkam"
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
            <ClassicNewsSidebar
              categories={categories}
              recentPosts={recentPosts}
              tags={tags}
              searchValue={searchValue}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              onSearch={onSearch}
              onCategorySelect={onCategorySelect}
              onTagSelect={onTagSelect}
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { NewsContent };
