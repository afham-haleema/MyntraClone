
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/navbar';
import Home from './pages/home';
import Cart from './pages/cart';
import Order from './pages/order';
import ProductDetails from './pages/productDetails';
import Wishlist from './pages/wishlist';
import CheckoutPage from './pages/checkout';
import Men from './pages/men';
import Women from './pages/women';
import Beauty from './pages/beauty';
import Kids from './pages/kids';
import HomeProducts from './pages/homeProducts';
import Footer from './components/footer';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/:id' element={<ProductDetails/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/checkout' element={<CheckoutPage/>}/>
        <Route path='/men' element={<Men/>}/>
        <Route path='/women' element={<Women/>}/>
        <Route path='/beauty' element={<Beauty/>}/>
        <Route path='/kids' element={<Kids/>}/>
        <Route path='/home-products' element={<HomeProducts/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      <Footer/>
    </div>
    </Router>

  );
}

export default App;
