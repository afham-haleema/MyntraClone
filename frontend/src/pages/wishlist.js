import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist, deleteFromWishlist, loading } = useContext(WishlistContext);
  const navigate = useNavigate();
  if (loading) return <p>Loading cart...</p>;


  return (
    <div className="cart-container">
      <h2 className="cart-heading">My Wishlist({wishlist.length})</h2>

      {wishlist.length === 0 ? (
        <p className="empty-cart">Your wishlist is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {wishlist.map((item) => {
              const product = item.product
              const discount = Math.round(
                ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
              );
              return (
                <div key={product._id} className="cart-item-card" onClick={() => navigate(`/${product._id}`)} style={{cursor:"pointer"}}>
                  <img src={product.image} alt={product.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3>{product.title}</h3>
                    <p className="cart-description">{product.description}</p>
                    <div className="cart-price">
                      <span className="new-price">₹{product.newPrice}</span>
                      <span className="old-price">₹{product.oldPrice}</span>
                      <span className="discount">{discount}% OFF</span>
                    </div>
                    <button className="remove-btn" onClick={() => deleteFromWishlist(product)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
export default Wishlist;