const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware')
const mongoose=require('mongoose')

// POST: Create Order
router.post('/',authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount, paymentToken, address, paymentMethod } = req.body;
    console.log("Decoded user in order route:", req.user);
    // Create order in DB
    const order = new Order({
      userId: req.user._id,
      products,
      totalAmount,
      paymentStatus: paymentMethod === "Stripe" ? "Pending" : "COD",
      paymentMethod,
      address,
    });

    await order.save();

    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
      });

      // Return client secret for frontend Stripe checkout
      return res.json({
        message: 'Stripe Payment Initiated',
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
      });


    }

    res.json({
      message: 'Order placed with Cash on Delivery',
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(req.user._id) }).populate('products.product').sort({ createdAt: -1 });
    const updatedOrders = orders.map(order => {
      if (order.deliveryDate && new Date() > order.deliveryDate) {
        order.deliveryStatus = "Delivered";
      }
      return order;
    });
    console.log("Fetching orders for user ID:", req.user._id);
    console.log("Orders found:", updatedOrders.length);
    res.json(updatedOrders);
  } catch (err) {
    console.error("Fetching orders failed:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { cartItems, totalAmount, address } = req.body;

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.title,
          images: [item.product.image], 
        },
        unit_amount: item.product.newPrice * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          size: item.size || " ", 
        }))),
        address:address
      }
    });
    console.log(session); 
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    res.status(500).json({ message: "Stripe Checkout failed" });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log('Stripe event received:', event);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const items = JSON.parse(session.metadata.items);
  
    const products = items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      size: item.size,
    }));
  
    const newOrder = new Order({
      userId,
      products,
      totalAmount: session.amount_total / 100,
      address: session.metadata.address, 
      paymentStatus: "Paid",
      paymentMethod: "Stripe",
    });
  
    await newOrder.save();
  }

  res.json({ received: true });
});


module.exports = router;
