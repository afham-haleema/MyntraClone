
const Cart=require('../models/Cart')

const getUserCart = async (req, res) => {
  try {
    const userId=req.user._id
    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ items: cart.items });
  } catch(err) {
    console.error("Error fetching cart:", err); 
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


const updateUserCart = async (req, res) => {
  try {
    const userId=req.user._id
    // const { items } = req.body;
    const { productId, quantity, size } = req.body;
    const newItem = {
      product: productId,
      quantity,
      size,
    };

    let cart = await Cart.findOne({userId});

    // if (!cart) {
    //   cart = new Cart({ userId, items });
    // } else {
    //   cart.items = items; 
    // }

    if (!cart) {
      cart = new Cart({ userId, items: [newItem] });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.size === size
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }
    }
    await cart.save()
    console.log("Cart after saving:", cart);
    res.status(200).json({ message: "Cart updated successfully", cart }); 
  } catch(err) {
    console.error("Error updating cart:", err); 
    res.status(500).json({ message: "Failed to update cart" });
  }
};

module.exports={getUserCart,updateUserCart}