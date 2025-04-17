const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); 
const {getUserWishlist,updateUserWishlist}=require('../controllers/wishlistController')

// GET: Fetch the logged-in user's cart
router.get("/", requireAuth,getUserWishlist );

// POST: Add item to cart
router.post('/', requireAuth, updateUserWishlist);

module.exports = router;
