import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { BlogClassicContent } from "./section";

const BlogClassicPage = () => {
  const { blogCategories, posts } = useGalacticContent();

  return (
    <PageShell title="Blog Klasik">
      <BlogClassicContent posts={posts} categories={blogCategories} />
    </PageShell>
  );
};

export default BlogClassicPage;
