
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";



function Profile() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const { login } = useContext(AuthContext)
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) setUser(storedUser)
    if (storedUser && storedUser.token) {
      fetchOrders(storedUser.token);
    }
  }, [])

  const fetchOrders = async (token) => {
    console.log("Fetching orders with token:", token);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const toggleForm = () => setIsSignIn(!isSignIn);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignIn ? "/api/users/login" : "/api/users/register";

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + endpoint, form);
      login(res.data)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  if (user) {
    return (
      <div className="profile-dashboard">
        <div className="left-panel">
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="right-panel">
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order._id} className="order-card">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Delivery Date:</strong>{new Date(order.deliveryDate).toLocaleDateString()}</p>
                  <p><strong>Order Status:</strong>{order.deliveryStatus}</p>
                  <ul>
                    {order.products.map((item, index) => (
                      <li key={index}>
                        {item.product?.title || "Product Info Unavailable"} (x{item.quantity}) - ₹{item.product?.newPrice || 0}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="form-box">
        <h2>{isSignIn ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignIn ? "Login" : "Create Account"}</button>
        </form>
        <p className="toggle">
          {isSignIn ? "New to Myntra?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>{isSignIn ? "Sign Up" : "Login"}</span>
        </p>
      </div>
    </div>
  );
}

export default Profile;
