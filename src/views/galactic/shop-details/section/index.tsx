import { Link } from "react-router-dom";
import { formatCurrency } from "@/galactic/common";
import type { ProductRecord } from "../../shared";

const ShopDetailsContent = ({ record }: { record?: ProductRecord }) => {
  if (!record) {
    return (
      <section className="shop-section single padding">
        <div className="container">
          <h2>No product data available.</h2>
        </div>
      </section>
    );
  }

  const product = record.item;

  return (
    <>
      <section className="shop-section single padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6 sm-padding product-details-wrap">
              <div className="row">
                {(product.gallery || [product.image]).map((image, index) => (
                  <div className="col-6 padding-15" key={`${product.sku}-gallery-${index + 1}`}>
                    <img src={image} alt={`${product.name} ${index + 1}`} />
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
                  <h4 className="price">{formatCurrency(product.price)} <span>({product.badge})</span></h4>
                  <p>{product.description}</p>
                  <div className="product-btn">
                    <form>
                      <input defaultValue="1" max="100" min="1" step="1" type="number" />
                    </form>
                    <div><Link className="purchase-btn" to="/cart">Add To Cart</Link></div>
                  </div>
                  <ul className="product-meta">
                    <li>SKU:<a href="#">{product.sku}</a></li>
                    <li>Categories:<a href="#">{product.category}</a></li>
                    <li>Tags:<a href="#">{product.tags.join(", ")}</a></li>
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
            <li role="presentation"><button className="active" type="button">Description</button></li>
            <li role="presentation"><button type="button">Additional information</button></li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active">
              <div className="description">
                <p>{product.description}</p>
                <ul className="description-meta">
                  <li><span>Availability:</span> {product.badge}</li>
                  <li><span>Category:</span> {product.category}</li>
                  <li><span>Tags:</span> {product.tags.join(", ")}</li>
                  <li><span>Extra Info:</span> {product.additionalInfo || "No additional info yet."}</li>
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
