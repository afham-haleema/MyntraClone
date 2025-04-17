const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// GET all products
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch banners' });
  }
});

module.exports=router;