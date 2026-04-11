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
      title="Jelajah Gear Keren"
      description="Stok shop di bawah nyambung ke endpoint `products`, lengkap sama kategori, harga, tag, dan gambar."
    />
    <section className="shop-section padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-9 sm-padding">
            <div className="product-shorting">
              <div>Showing 1-{products.length} of {products.length} results</div>
              <div>
                <select aria-label="Shop order" className="orderby" defaultValue="date" name="orderby">
                  <option value="popularity">Sort by popularity</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="date">Sort by latest</option>
                  <option value="price">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
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
