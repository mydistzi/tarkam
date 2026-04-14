import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/api";
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

const ShopDetailsContent = ({ record }: { record?: ProductRecord }) => {
  if (!record) {
    return (
      <section className="shop-section single padding">
        <div className="container">
          <h2>Data produk belum tersedia.</h2>
        </div>
      </section>
    );
  }

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

      navigate('/cart');
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

  const product = record.item;
  const galleryImages = Array.isArray(product.gallery)
    ? product.gallery.map((image) => String(image || "").trim()).filter(Boolean)
    : [];
  const images = galleryImages.length > 0
    ? galleryImages
    : [product.image?.trim() || placeholderShop];

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
                    </form>
                    <button className="purchase-btn" type="submit" disabled={isAdding}>
                      {isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}<span />
                    </button>
                    {feedback ? <p className="checkout-message">{feedback}</p> : null}
                  </div>
                  <ul className="product-meta">
                    <li>SKU:<a href="#">{product.sku}</a></li>
                    <li>Kategori:<a href="#">{product.category}</a></li>
                    <li>Tag:<a href="#">{product.tags.join(", ")}</a></li>
                  </ul>
                  <ul className="social-list">
                    <li><a href="#"><i className="fab fa-facebook-f" /></a></li>
                    <li><a href="#"><i className="fab fa-twitter" /></a></li>
                    <li><a href="#"><i className="fab fa-instagram" /></a></li>
                    <li><a href="#"><i className="fab fa-youtube" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description padding-top">
        <div className="container">
          <ul className="nav tab-navigation" role="tablist">
            <li role="presentation"><button className="active" type="button">Deskripsi</button></li>
            <li role="presentation"><button type="button">Info tambahan</button></li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active">
              <div className="description">
                <p>{product.description}</p>
                <ul className="description-meta">
                  <li><span>Ketersediaan:</span> {product.badge}</li>
                  <li><span>Kategori:</span> {product.category}</li>
                  <li><span>Tag:</span> {product.tags.join(", ")}</li>
                  <li><span>Info Tambahan:</span> {product.additionalInfo || "Belum ada info tambahan."}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { ShopDetailsContent };
