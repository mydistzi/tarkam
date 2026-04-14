import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import NewsDetailsContent from "./section";

const NewsDetailsPage = () => {
  const { slug } = useParams();
  const normalizedSlug = slug?.trim().toLowerCase();
  const { newsRecords } = useGalacticContent();
  const currentIndex = newsRecords.findIndex((item) => {
    if (!normalizedSlug) {
      return false;
    }
    const recordSlug = item.item.path?.split("/").pop()?.toLowerCase();
    return String(item.id) === normalizedSlug || recordSlug === normalizedSlug;
  });
  const record = currentIndex >= 0 ? newsRecords[currentIndex] : undefined;
  const previousPath = currentIndex > 0 ? newsRecords[currentIndex - 1]?.item.path : undefined;
  const nextPath = currentIndex >= 0 && currentIndex < newsRecords.length - 1 ? newsRecords[currentIndex + 1]?.item.path : undefined;

  return (
    <PageShell
      title="Detail Artikel"
      description={record?.item.excerpt}
      type="article"
      image={record?.item.image}
      articleTag={record?.item.tags}
    >
      <NewsDetailsContent record={record} previousPath={previousPath} nextPath={nextPath} />
    </PageShell>
  );
};

export default NewsDetailsPage;
