import { createContext, useState,useEffect, useContext } from 'react';
import { AuthContext } from './authContext';
import axios from 'axios';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const {user}=useContext(AuthContext)
  const[loading,setLoading]=useState(false)

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      setLoading(true);
      try {
        console.log(token)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(res.data.items || []) 
      } catch (err) {
        console.error("Failed to load cart:", err);
      }finally{
        setLoading(false)
      }
    };
  
    fetchCart();
  }, [token]);

  const updateCartOnServer = async (updatedCart) => {
    if (!token) return;
    try {
      console.log("User ID in cart request:", token);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { items: updatedCart },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  const removeFromCart = (product, size) => {
    const existing = cartItems.find(
      (item) => item.product._id === product._id && item.size === size
    );
  
    if (!existing) return;
  
    let updatedCart;
    if (existing.quantity > 1) {
      updatedCart = cartItems.map((item) =>
        item.product._id === product._id && item.size === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      updatedCart = cartItems.filter(
        (item) => !(item.product._id === product._id && item.size === size)
      );
    }
  
    setCartItems(updatedCart);
    updateCartOnServer(updatedCart);
  };

  const deleteFromCart = (product, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.product._id === product._id && item.size === size)
    );
  
    setCartItems(updatedCart);
    updateCartOnServer(updatedCart);
  };

  const addToCart = (product, size,quantity = 1) => {
    const existing = cartItems.find(
      (item) => item.product._id === product._id && item.size === size
    );
    
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.product._id === product._id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cartItems, { product, quantity, size }];
    }

    setCartItems(updatedCart);
    updateCartOnServer(updatedCart);
  };

  const clearCart = async () => {
    setCartItems([]);
    await updateCartOnServer([]); 
  };



  return (
    <CartContext.Provider   value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      deleteFromCart,
      clearCart
    }}>
    {children}
  </CartContext.Provider>
  );
}
