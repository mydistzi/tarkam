import { useParams } from "react-router-dom";
import { PageShell } from "@/galactic/common";
import { useGalacticNewsContent } from "../shared";
import NewsDetailsContent from "./section";

const NewsDetailsPage = () => {
  const { slug } = useParams();
  const normalizedSlug = slug?.trim().toLowerCase();
  const { newsRecords } = useGalacticNewsContent();
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

  const pageTitle = record?.item.title
    ? `${record.item.title} | Artikel Tarkam`
    : "Detail Artikel";
  const pageDescription = record?.item.excerpt || "Baca artikel terbaru tentang Tarkam, event, dan berita community.";

  return (
    <PageShell
      title={pageTitle}
      description={pageDescription}
      type="article"
      image={record?.item.image}
      author={record?.item.author}
      publishedTime={record?.news.created_at}
      modifiedTime={record?.news.updated_at}
      articleSection={record?.item.category}
      keywords={record?.item.tags}
      articleTag={record?.item.tags}
    >
      <NewsDetailsContent record={record} previousPath={previousPath} nextPath={nextPath} />
    </PageShell>
  );
};

export default NewsDetailsPage;
