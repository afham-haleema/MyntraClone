

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// import banners from "../banners.js";
import { SearchContext } from "../context/SearchContext.js";

function Home() {
    const { search } = useContext(SearchContext);
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/banners`);
                setBanners(res.data);
            } catch (error) {
                console.error("Failed to fetch banners", error);
            }
        };

        fetchProducts();
        fetchBanners();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) && product.trending === true
    );

    return (
        <div className="home-container">

            <div className="custom-carousel">
                <button className="carousel-btn left" onClick={prevSlide}>&#10094;</button>

                <div className="carousel-track-container">
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {banners.map((banner, index) => (
                            <div className="carousel-slide" key={index}>
                                <Link to={`/${banner.category.toLowerCase()}`}>
                                    <img src={banner.image} alt={banner.category} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="carousel-btn right" onClick={nextSlide}>&#10095;</button>
            </div>

            <h2 style={{ textAlign: "center", fontWeight: "400", margin: "2rem" }}>TRENDING PRODUCTS</h2>
            <div className="home">
                {filteredProducts.map((product) => {
                    const discount = Math.round(
                        ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
                    );
                    return (
                        <Link to={`/${product._id}`} style={{ textDecoration: "none", color: "inherit" }} key={product._id}>
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
        </div>
    );
}

export default Home;
