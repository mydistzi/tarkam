import { PageShell } from "@/galactic/common";
import { useGalacticContent } from "../shared";
import { ShopGridContent } from "./section";

const ShopGridPage = () => {
  const { blogCategories, posts, products } = useGalacticContent();

  return (
    <PageShell title="Toko">
      <ShopGridContent
        products={products}
        recentPosts={posts.slice(0, 3)}
        categories={Array.from(new Set(products.map((item) => item.category))).concat(blogCategories).slice(0, 6)}
      />
    </PageShell>
  );
};

export default ShopGridPage;
