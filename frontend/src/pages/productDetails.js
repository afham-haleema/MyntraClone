
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useParams } from "react-router-dom";
import { useContext,useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function ProductDetails() {
        const { id } = useParams();
        const { addToCart } = useContext(CartContext);
        const { user } = useContext(AuthContext);
        const { addToWishlist } = useContext(WishlistContext);
        const [selectedSize, setSelectedSize] = useState(null);
        const [product, setProduct] = useState(null);
    
        useEffect(()=>{
            const FetchProducts=async()=>{
                try{
                    const res=await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
                    setProduct(res.data)
                }catch(err){
                    console.error('Failed to fetch',err)
                }
            }
            FetchProducts();
        },[id])

    if(!product){
        return (<p>Loading..</p>)
    }
    const discount = Math.round(
      ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
    );

    
    const handleAddToCart = async () => {
        try {
          const token = localStorage.getItem('token');
          if(!token){
            console.log('No token found')
            return;
          }
          console.log(product,selectedSize) 

          if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
          }
    
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart`, {
            productId: product._id, 
            quantity: 1,
            size:selectedSize
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          console.log("Added to cart:", response.data);
          addToCart(product, selectedSize);
        } catch (error) {
          console.error("Failed to add to cart:", error.response?.data || error.message);
        }
      };

      const handleAddToWishlist = async () => {
        try {
          const token = localStorage.getItem('token');
          if(!token){
            console.log('No token found')
            return;
          }
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/wishlist`, {
            productId: product._id, 
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          addToWishlist(product);
        } catch (error) {
          console.error("Failed to add to wishlist:", error.response?.data || error.message);
        }
      };


  
    return (
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-info-section">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            <span className="new-price">₹{product.newPrice}</span>
            <span className="old-price">₹{product.oldPrice}</span>
            <span className="discount">({discount}% OFF)</span>
          </div>
          <h4 className="select-size-label">SELECT SIZE</h4>
          <div className="size-options">
          {product.size?.map((size, index) => (
            <button
              key={index}
              className={`size-btn ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>
          <button className="wishlist-btn" onClick={handleAddToWishlist}  >
            <i className="fa-solid fa-heart"></i> Wishlist
          </button>
        </div>
        </div>
      </div>
    );
  }

export default ProductDetails;