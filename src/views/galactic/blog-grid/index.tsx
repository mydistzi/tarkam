import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { BlogGridContent } from "./section";

const BlogGridPage = () => {
  const { blogCategories, posts } = useGalacticContent();

  return (
    <PageShell title="Blog Grid">
      <BlogGridContent posts={posts} categories={blogCategories} />
    </PageShell>
  );
};

export default BlogGridPage;
