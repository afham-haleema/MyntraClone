import { createContext, useState ,useEffect} from "react";
import axios from "axios";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const[loading,setLoading]=useState(false)
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    useEffect(() => {
        const fetchWishlist = async () => {
          if (!token) return;
          setLoading(true);
          try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/wishlist`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setWishlist(res.data.items || []) 
          } catch (err) {
            console.error("Failed to load wishlist:", err);
          }finally{
            setLoading(false)
          }
        };
      
        fetchWishlist();
      }, [token]);

      const updateWishlistOnServer = async (updatedWishlist) => {
          if (!token) return;
          try {
            console.log("Sending cart to server:", updatedWishlist);
            await axios.post(
              `${process.env.REACT_APP_API_URL}/api/wishlist`,
              { items: updatedWishlist },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
          } catch (err) {
            console.error("Failed to update wishlist", err);
          }
        };

        const deleteFromWishlist = (product) => {
            const updatedWishlist = wishlist.filter(
              (item) => !(item.product._id === product._id)
            );
          
            setWishlist(updatedWishlist);
            updateWishlistOnServer(updatedWishlist);
          };

    

          const addToWishlist = (product) => {
            let updatedWishlist = [...wishlist, { product}];
            setWishlist(updatedWishlist);
            updateWishlistOnServer(updatedWishlist);
          };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, deleteFromWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}
