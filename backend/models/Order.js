const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      size:{type:String,required:true}
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  paymentMethod: { type: String, required: true },
  address:{type:String,required:true},
  createdAt: { type: Date, default: Date.now },
  deliveryDate: {
    type: Date,
    default: function () {
      const deliveryDays = 7;
      const delivery = new Date(this.createdAt || Date.now());
      delivery.setDate(delivery.getDate() + deliveryDays);
      return delivery;
    }},
    deliveryStatus: { type: String, default: 'Shipped' },
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
