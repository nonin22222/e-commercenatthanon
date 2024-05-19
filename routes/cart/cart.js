const express = require('express');
const router = express.Router();
const Cart = require("../../controllers/cart/cart.controller")
const Auth = require("../../authentication/userAuth")

//เพิ่มสินค้าในตะกร้า
router.post('/',Cart.addCart)
// ลดจำนวนสินค้าในตะกร้า
router.put('/decrease/',Cart.reduceCart)

// ลบสินค้าในตะกร้า
router.delete('/',Cart.deleteCart)


module.exports = router;