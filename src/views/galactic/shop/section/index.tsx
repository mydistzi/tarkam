import { PageHeader, PagePagination, ProductGrid } from "@/galactic/common";
import { placeholderShop } from "@/galactic/placeholders";
import type { ProductItem } from "@/galactic/data";

type CatprodWidgetItem = {
  id?: number;
  title: string;
  products_count?: number;
};

type ShopGridContentProps = {
  products: ProductItem[];
  categories: CatprodWidgetItem[];
  recentItems: ProductItem[];
  tags: string[];
  resultText: string;
  currentPage: number;
  totalPages: number;
  selectedCategoryId?: number;
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
  onCategorySelect: (id?: number) => void;
  onPageChange: (page: number) => void;
  searchValue: string;
  orderBy: string;
};

const ShopSidebar = ({
  categories,
  recentItems,
  tags,
  selectedCategoryId,
  onSearch,
  onCategorySelect,
  searchValue,
}: {
  categories: CatprodWidgetItem[];
  recentItems: ProductItem[];
  tags: string[];
  selectedCategoryId?: number;
  onSearch: (value: string) => void;
  onCategorySelect: (id?: number) => void;
  searchValue: string;
}) => (
  <>
    <div className="shop-sidebar-widget">
      <form className="search-form" onSubmit={(event) => event.preventDefault()}>
        <input
          className="form-control"
          id="cari"
          name="cari"
          type="text"
          value={searchValue}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Cari"
        />
        <button className="search-btn" type="submit"><i className="las la-search" /></button>
      </form>
    </div>
    <div className="shop-sidebar-widget">
      <div className="shop-widget-title">
        <h3><span>||</span> Kategori</h3>
      </div>
      <ul className="category-list">
        <li>
          <a
            type="button"
            className={selectedCategoryId == null ? "active" : ""}
            onClick={() => onCategorySelect(undefined)}
          >
            Semua Kategori
          </a>
            <span>{categories.reduce((total, item) => total + (item.products_count || 0), 0)}</span>
        </li>
        {categories.map((category) => (
          <li key={category.id ?? category.title}>
            <a
              type="button"
              className={selectedCategoryId === category.id ? "active" : ""}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.title}
            </a>
            <span>{category.products_count ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="shop-sidebar-widget">
      <div className="shop-widget-title">
        <h3><span>||</span> Tag Populer</h3>
      </div>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}><a href="#">{tag}</a></li>
        ))}
      </ul>
    </div>
    <div className="shop-sidebar-widget">
      <div className="shop-widget-title">
        <h3><span>||</span> Item Terbaru</h3>
      </div>
      <ul className="category-list">
        {recentItems.map((item) => (
          <li key={`sidebar-${item.sku || item.name}`}>
            <span className="thumb">
              <img src={item.image || placeholderShop} alt={item.name} />
            </span>
            <div className="thumb-post-info">
              <h3><a href={item.path || "/shop-details"}>{item.name}</a></h3>
              <span className="date"><i className="las la-tag" />{item.category}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const ShopGridContent = ({
  products,
  categories,
  recentItems,
  tags,
  resultText,
  currentPage,
  totalPages,
  selectedCategoryId,
  onSearch,
  onSort,
  onCategorySelect,
  onPageChange,
  searchValue,
  orderBy,
}: ShopGridContentProps) => (
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
            <div className="row">
            <div className="product-shorting">
              <div>{resultText}</div>
              <div>
                <select
                  aria-label="Urutkan toko"
                  className="orderby"
                  name="orderby"
                  value={orderBy}
                  onChange={(event) => onSort(event.target.value)}
                >
                  <option value="date">Urutkan berdasarkan terbaru</option>
                  <option value="price">Urutkan berdasarkan harga: rendah ke tinggi</option>
                  <option value="price-desc">Urutkan berdasarkan harga: tinggi ke rendah</option>
                </select>
              </div>
            </div>
            <ProductGrid items={products} />
            </div>
            <PagePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
          <div className="col-lg-3 sm-padding">
            <div className="shop-sidebar">
              <ShopSidebar
              categories={categories}
              recentItems={recentItems}
              tags={tags}
              selectedCategoryId={selectedCategoryId}
              onSearch={onSearch}
              onCategorySelect={onCategorySelect}
              searchValue={searchValue}
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const mapApiProductToProductItem = (product: any): ProductItem => ({
  id: product.id,
  name: product.title || product.subject || `Produk ${product.id}`,
  category: product.catprod?.title || "Produk",
  image: product.thumbnails?.[0]?.product_thumbnail_path || product.image || placeholderShop,
  price: Number(product.price || 0),
  oldPrice: undefined,
  badge: product.status || "",
  badgeClass: product.status === "Sold Out" ? "sold-out" : "in-stock",
  description: product.description || product.subject || "",
  sku: product.sku || "",
  tags: Array.from(
    new Set(
      (product.tags || [])
        .map((tag: any) => tag.name || tag.title || tag.slug || "")
        .filter(Boolean)
    )
  ),
  path: product.slug ? `/shop-details/${product.slug}` : `/shop-details/${product.id}`,
  gallery: product.thumbnails?.map((item: any) => item.product_thumbnail_path).filter(Boolean),
});

export { ShopGridContent, mapApiProductToProductItem };
