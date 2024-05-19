const express = require('express');
const router = express.Router();
const Product = require("../../controllers/product/product.controller")
const Auth = require("../../authentication/userAuth")

//สร้างข้อมูลสินค้า
router.post('/',Auth.employee,Product.addProduct)

//ดึงข้อมูลสินค้าทั้งหมด
router.get('/',Product.getProduct)

//ดึงข้อมูลสินค้าตาม id
router.get('/byid/:id',Product.getProductById)

//แก้ไขข้อมูลสินค้า
router.put('/:id',Auth.employee,Product.editProduct)

//ลบข้อมูลสินค้า
router.delete('/:id',Auth.employee,Product.deleteProduct)

//เปิด-ปิด สถานะสินค้า
router.put('/status/:id',Auth.employee,Product.statusProduct)


module.exports = router;