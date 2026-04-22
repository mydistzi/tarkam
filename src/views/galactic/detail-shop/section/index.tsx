import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/api";
import { DisqusThread } from "@/galactic/common";
import { galacticRoutes } from "@/galactic/data";
import { placeholderShop } from "@/galactic/placeholders";
import { getCartRequestPayload } from "@/galactic/session";
import type { ProductRecord } from "../../shared";

const getImageSource = (src?: string) => {
  const normalized = src?.trim();
  if (!normalized) {
    return placeholderShop;
  }

  const isPlaceholderAsset = /\/assets\/images\/placeholder-[\w-]+\.(png|jpe?g|webp)$/i.test(normalized);
  return isPlaceholderAsset ? placeholderShop : normalized;
};

const normalizeSocialUrl = (value?: string | null) => {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized.replace(/^\/+/, "")}`;
};

const ShopDetailsContent = ({ record }: { record?: ProductRecord }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"description" | "additional">("description");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const product = record?.item;

  if (!product) {
    return (
      <section className="shop-section single padding">
        <div className="container">
          <h2>Data produk belum tersedia.</h2>
        </div>
      </section>
    );
  }

  const handleAddToCart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAdding) {
      return;
    }

    setIsAdding(true);
    setFeedback(null);

    try {
      await Api.post('/carts', getCartRequestPayload({
        product_id: product.id,
        quantity: Math.max(1, quantity),
        unit_price: product.price,
        status: 'active',
      }));

      navigate(galacticRoutes.cart);
    } catch (error) {
      console.error('Failed to add product to cart', error);
      setFeedback('Gagal menambahkan produk ke keranjang. Coba lagi.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setQuantity(Number.isNaN(value) || value < 1 ? 1 : value);
  };

  const galleryImages = Array.isArray(product.gallery)
    ? product.gallery.map((image) => String(image || "").trim()).filter(Boolean)
    : [];
  const images = galleryImages.length > 0
    ? galleryImages
    : [product.image?.trim() || placeholderShop];
  const hasAdditionalInfo = Boolean(product.additionalInfo?.trim());
  const member = record?.product.user?.user;
  const socialLinks = [
    { icon: "fab fa-facebook-f", label: "Facebook", href: normalizeSocialUrl(member?.facebook) },
    { icon: "fab fa-instagram", label: "Instagram", href: normalizeSocialUrl(member?.instagram) },
    { icon: "fab fa-tiktok", label: "TikTok", href: normalizeSocialUrl(member?.tiktok) },
  ].filter((item): item is { icon: string; label: string; href: string } => Boolean(item.href));

  return (
    <>
      <section className="shop-section single padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6 sm-padding product-details-wrap">
              <div className="row">
                {images.map((image, index) => (
                  <div className="col-6 padding-15" key={`${product.sku}-gallery-${index + 1}`}>
                    <img src={getImageSource(image)} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6 sm-padding">
              <div className="product-details">
                <div className="product-info">
                  <div className="product-inner">
                    <ul className="category">
                      <li><a href="#">{product.category}</a></li>
                    </ul>
                    <ul className="rating">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <li key={`detail-star-${product.sku}-${index + 1}`}><i className="las la-star" /></li>
                      ))}
                    </ul>
                  </div>
                  <h3>{product.name}</h3>
                  <h4 className="price">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price)} <span>({product.badge})</span></h4>
                  <p>{product.description}</p>
                  <div className="product-btn">
                    <form onSubmit={handleAddToCart}>
                      <input
                        value={quantity}
                        max={100}
                        min={1}
                        step={1}
                        id="number"
                        name="number"
                        type="number"
                        onChange={handleQuantityChange}
                      />
                      <button className="purchase-btn" type="submit" disabled={isAdding}>
                        {isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}<span />
                      </button>
                    </form>
                    {feedback ? <p className="checkout-message">{feedback}</p> : null}
                  </div>
                  <ul className="product-meta">
                    <li>SKU:<a href="#">{product.sku}</a></li>
                    <li>Kategori:<a href="#">{product.category}</a></li>
                    <li>Tag:<a href="#">{product.tags.join(", ")}</a></li>
                  </ul>
                  {socialLinks.length ? (
                    <ul className="social-list">
                      {socialLinks.map((item) => (
                        <li key={item.label}>
                          <a href={item.href} target="_blank" rel="noreferrer noopener" aria-label={item.label}>
                            <i className={item.icon} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description padding-top">
        <div className="container">
          <ul className="nav tab-navigation" role="tablist">
            <li role="presentation">
              <button
                className={activeTab === "description" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={activeTab === "description"}
                aria-controls="shop-tab-description"
                id="shop-tab-trigger-description"
                onClick={() => setActiveTab("description")}
              >
                Deskripsi
              </button>
            </li>
            <li role="presentation">
              <button
                className={activeTab === "additional" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={activeTab === "additional"}
                aria-controls="shop-tab-additional"
                id="shop-tab-trigger-additional"
                onClick={() => setActiveTab("additional")}
              >
                Info tambahan
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className={`tab-pane${activeTab === "description" ? " active" : ""}`}
              id="shop-tab-description"
              role="tabpanel"
              aria-labelledby="shop-tab-trigger-description"
              hidden={activeTab !== "description"}
            >
              <div className="description">
                <p>{product.description}</p>
                <ul className="description-meta">
                  <li><span>Ketersediaan:</span> {product.badge}</li>
                  <li><span>Kategori:</span> {product.category}</li>
                  <li><span>Tag:</span> {product.tags.join(", ")}</li>
                </ul>
              </div>
            </div>
            <div
              className={`tab-pane${activeTab === "additional" ? " active" : ""}`}
              id="shop-tab-additional"
              role="tabpanel"
              aria-labelledby="shop-tab-trigger-additional"
              hidden={activeTab !== "additional"}
            >
              <div className="description">
                <p>{hasAdditionalInfo ? product.additionalInfo : "Belum ada info tambahan untuk produk ini."}</p>
                <ul className="description-meta">
                  <li><span>SKU:</span> {product.sku}</li>
                  <li><span>Ketersediaan:</span> {product.badge}</li>
                  <li><span>Kategori:</span> {product.category}</li>
                  <li><span>Tag:</span> {product.tags.length ? product.tags.join(", ") : "-"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description padding-top padding-bottom">
        <div className="container">
          <div className="description">
            <h3 className="comment-title">Komentar Produk</h3>
            <DisqusThread
              identifier={product.path || product.sku || String(product.id || product.name)}
              title={product.name || "Detail Produk"}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export { ShopDetailsContent };
