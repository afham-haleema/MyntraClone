import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-section">
                    <h4>ONLINE SHOPPING</h4>
                    <ul>
                        <li><Link to="/men">Men</Link></li>
                        <li><Link to="/women">Women</Link></li>
                        <li><Link to="/kids">Kids</Link></li>
                        <li><Link to="/home-products">Home & Living</Link></li>
                        <li><Link to="/beauty">Beauty</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>USEFUL LINKS</h4>
                    <ul>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/terms">T&C</Link></li>
                        <li><Link to="/returns">Returns</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>EXPERIENCE OUR APP</h4>
                    <div className="app-links">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                    </div>
                    <div className="social-icons">
                        <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
                        <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
                        <a href="https://youtube.com"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Myntra. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
