const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  category:{type:String,required:true},
  trending: { type: Boolean,default:false },
  size: [{ type: String,required:true }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
