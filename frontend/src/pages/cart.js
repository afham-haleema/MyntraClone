
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, loading, addToCart, removeFromCart, deleteFromCart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()

  if (loading) return <p>Loading cart...</p>;

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.newPrice * item.quantity,
    0
  );
  const shipping = totalAmount > 1000 ? 0 : 50;

  return (
    <div className="cart-container">
      <h2 className="cart-heading">My Shopping Bag ({cartItems.length})</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product
              const discount = Math.round(
                ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
              );
              return (
                <div key={product.productId} className="cart-item-card">
                  <img src={product.image} alt={product.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3>{product.title}</h3>
                    <p className="cart-description">{product.description}</p>
                    <div className="cart-price">
                      <span className="new-price">₹{product.newPrice}</span>
                      <span className="old-price">₹{product.oldPrice}</span>
                      <span className="discount">{discount}% OFF</span>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => removeFromCart(product, item.size)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(product, item.size)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => deleteFromCart(product, item.size)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>PRICE DETAILS</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="summary-line total">
              <span>Total Amount</span>
              <span>₹{(totalAmount + shipping).toFixed(2)}</span>
            </div>

            <button className="place-order-btn" style={{ textDecoration: "none" }} onClick={() => {
              if (!user?.token) {
                alert("Please login to place your order.");
                return;
              }
              navigate("/checkout");
            }}>Place Order</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
