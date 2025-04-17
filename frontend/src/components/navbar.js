import { Link } from "react-router-dom";
import myntralogo from '../assets/myntralogo.png';
import { useContext ,useState} from "react";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const {cartItems}=useContext(CartContext)
  const {wishlist}=useContext(WishlistContext)
  const {search,setSearch}=useContext(SearchContext)
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlist.length;

  return (
    <nav className="navbar">
      <div className="ham-logo">
      <div className="navbar-section logo">
        <Link to="/"><img src={myntralogo} width="40px" alt="logo" /></Link>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="fa-solid fa-bars"></i>
      </div>
      </div>

      <div className={`navbar-section navlinks ${menuOpen ? "active" : ""}`}>
        <Link to="/men" className="navlink">MEN</Link>
        <Link to="/women" className="navlink">WOMEN</Link>
        <Link to="/kids" className="navlink">KIDS</Link>
        <Link to="/home-products" className="navlink">HOME</Link>
        <Link to="/beauty" className="navlink">BEAUTY</Link>
      </div>

      <div className="navbar-section search">
        <div className="search-icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <input placeholder="Search for products" type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
      </div>

      <div className="navbar-section userlinks">
        <Link to="/profile"><i className="fa-solid fa-user navlink"></i></Link>
        <Link to="/wishlist"><i className="fa-solid fa-heart navlink"></i>{totalWishlist>0 && <span className="badge">{totalWishlist}</span>}</Link>
        <Link to="/cart"><i className="fa-solid fa-cart-shopping navlink cart-nav"></i>{totalItems>0 && <span className="badge">{totalItems}</span>}</Link>
      </div>
    </nav>
  );
}

export default Navbar;
