const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if(!product){
        res.status(401).json({message:"Not Found Product"})
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

module.exports = router;
