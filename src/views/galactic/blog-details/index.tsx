import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import BlogDetailsContent from "./section";

const BlogDetailsPage = () => {
  const { blogId } = useParams();
  const { blogRecords } = useGalacticContent();
  const currentIndex = blogRecords.findIndex((item) => String(item.id) === blogId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const record = blogRecords[safeIndex];
  const previousPath = blogRecords[safeIndex - 1]?.item.path;
  const nextPath = blogRecords[safeIndex + 1]?.item.path;

  return (
    <PageShell
      title="Detail Blog"
      description={record?.item.excerpt}
      type="article"
      image={record?.item.image}
      articleTag={record?.item.tags}
    >
      <BlogDetailsContent record={record} previousPath={previousPath} nextPath={nextPath} />
    </PageShell>
  );
};

export default BlogDetailsPage;
