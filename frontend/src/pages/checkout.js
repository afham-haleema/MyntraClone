import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Checkout from "../components/checkout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
    const { cartItems ,clearCart} = useContext(CartContext);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate=useNavigate()

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.product.newPrice * item.quantity,
        0
      );
      const shipping = totalAmount > 1000 ? 0 : 50;

      const handlePlaceOrder = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
      
        if (!token) {
          alert("You must be logged in to place an order.");
          return;
        }
      
      
        if (!address) {
          return alert("Please enter a shipping address.");
        }
      
        const orderPayload = {
          products: cartItems,
          paymentMethod,
          totalAmount: totalAmount + shipping,
          address,
          
        };
      
        if (paymentMethod === "Stripe") {
          setShowCheckout(true); // this triggers Checkout component which handles redirect
          
        } else {
          try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/orders`,
                orderPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
      
              if (res.status === 201 || res.status === 200) {
                alert("Order placed successfully!");
                await clearCart();
                navigate("/profile");
              } else {
                alert(res.data.message || "Order placement failed.");
              }
          } catch (err) {
            console.error(err);
            alert("Something went wrong.");
          }
        }
      };

    return (
        <div className="checkout-page-container">
            <h2>Checkout</h2>

            <div className="checkout-section">
                <h3>Shipping Address</h3>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your shipping address"
                />
            </div>

            <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Cash on Delivery
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="Stripe"
                            checked={paymentMethod === "Stripe"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Stripe
                    </label>
                </div>
            </div>

            <div className="checkout-section">
                <h3>Order Summary</h3>
                {cartItems.map((item) => {
                    const product=item.product
                    return(
                    <div key={item.id || item._id} className="checkout-item">
                        <img src={product.image} alt={product.title} className="checkout-item-img" />
                        <div className="checkout-item-details">
                            <h4>{product.title}</h4>
                            <p>₹{product.newPrice} x {item.quantity}</p>
                            <p>Total: ₹{product.newPrice * item.quantity}</p>
                        </div>
                    </div>)
                })}
            </div>

            <div className="checkout-summary">
                <p>Total Price: ₹{(totalAmount + shipping).toFixed(2)}</p>
                <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>

                {showCheckout && (
                    <div className="checkoutContainer">
                        <Checkout cartItems={cartItems} totalAmount={totalAmount} address={address} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;
