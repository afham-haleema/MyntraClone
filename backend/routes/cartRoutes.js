const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware'); 
const {getUserCart,updateUserCart}=require('../controllers/cartController')

// GET: Fetch the logged-in user's cart
router.get("/", requireAuth,getUserCart );

// POST: Add item to cart
router.post('/', requireAuth, updateUserCart);

module.exports = router;
