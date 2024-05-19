const express = require('express');
const router = express.Router();
const Order = require("../../controllers/order/order.controller");
const Auth = require("../../authentication/userAuth");

//สั่งออเดอร์
router.post('/',Auth.customer,Order.addOrder)

//ดูออเดอร์ทั้งหมด
router.get('/',Auth.employee,Order.getOrder)

//ดูออเดอร์ตาม id
router.get('/byid/:id',Auth.all,Order.getOrderById)
//ดูออเดอร์ตาม ลูกค้า
router.get('/bycustomer/:id',Auth.customer,Order.getOrderByCustomer)

//ใส่เลข tracking
router.put('/tracking/:id',Auth.employee,Order.addTracking)

// ลบ ออเดอร์
router.delete('/:id',Auth.employee,Order.deleteOrder)

module.exports = router;