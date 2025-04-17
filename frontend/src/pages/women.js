import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Women() {
  const { search } = useContext(SearchContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) &&
      product.category === "Women"
  );

  return (
    <div className="home">
      {filteredProducts.map((product) => {
        const discount = Math.round(
          ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
        );
        return (
          <Link
            to={`/${product._id}`}
            key={product._id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="product-card">
              <img src={product.image} alt={product.title} />
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <div className="price-section">
                <span className="new-price">₹{product.newPrice}</span>
                <span className="old-price">₹{product.oldPrice}</span>
                <span className="discount">{discount}% OFF</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Women;
