
const Wishlist=require('../models/Wishlist')

const getUserWishlist = async (req, res) => {
  try {
    const userId=req.user._id
    const wishlist = await Wishlist.findOne({ userId }).populate("items.product");
    if (!wishlist) return res.status(404).json({ message: "wishlist not found" });
    res.json({ items: wishlist.items });
  } catch {
    console.error("Error fetching wishlist:", err); 
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};


const updateUserWishlist = async (req, res) => {
  try {
    const userId=req.user._id
    const { items } = req.body;
    console.log(userId)
    console.log("Items to update:", req.body.items); 
    let wishlist = await Wishlist.findOne({userId});

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items });
    } else {
      wishlist.items = items; 
    }
    await wishlist.save()
    console.log("Wishlist after saving:", wishlist);
    res.status(200).json({ message: "wishlist updated successfully", wishlist }); 
  } catch(err) {
    console.error("Error updating wishlist:", err); 
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};

module.exports={getUserWishlist,updateUserWishlist}