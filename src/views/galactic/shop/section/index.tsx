import { BlogSidebar, PageHeader, PagePagination, ProductGrid } from "@/galactic/common";
import type { PostItem, ProductItem } from "@/galactic/data";

type ShopGridContentProps = {
  products: ProductItem[];
  recentPosts: PostItem[];
  categories: string[];
};

const ShopGridContent = ({ products, recentPosts, categories }: ShopGridContentProps) => (
  <>
    <PageHeader
      eyebrow="Toko Gaming Online"
      title="Jelajah Item &amp; Perlengkapan in-game"
      description="Cari item yang kamu butuhkan in-game? Jelajahi koleksi favorit mu disini!"
    />
    <section className="shop-section padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-9 sm-padding">
            <div className="product-shorting">
              <div>Menampilkan 1-{products.length} dari {products.length} hasil</div>
              <div>
                <select aria-label="Urutkan toko" className="orderby" defaultValue="date" name="orderby">
                  <option value="popularity">Urutkan berdasarkan popularitas</option>
                  <option value="rating">Urutkan berdasarkan rating rata-rata</option>
                  <option value="date">Urutkan berdasarkan terbaru</option>
                  <option value="price">Urutkan berdasarkan harga: rendah ke tinggi</option>
                  <option value="price-desc">Urutkan berdasarkan harga: tinggi ke rendah</option>
                </select>
              </div>
            </div>
            <ProductGrid items={products} />
            <PagePagination />
          </div>
          <div className="col-lg-3 sm-padding">
            <BlogSidebar categories={categories} recentPosts={recentPosts} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export { ShopGridContent };
