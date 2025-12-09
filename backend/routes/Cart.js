const express = require("express");
const router = express.Router();
//const { protect } = require("../middleware/auth");
const cartController = require("../controller/CartController");

router.get("/",  cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/remove/:foodId", cartController.removeFromCart);

module.exports = router;
