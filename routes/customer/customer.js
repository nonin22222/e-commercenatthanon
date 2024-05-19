const express = require('express');
const router = express.Router();
const Customer = require("../../controllers/customer/customer.controller")
const Auth = require("../../authentication/userAuth")
//สมัครข้อมูลลูกค้า
router.post('/',Customer.create)

//ดึงข้อมูลลูกค้าทั้งหมด
router.get('/',Auth.employee,Customer.getall)

//ดึงข้อมูลลูกค้าตาม id
router.get('/byid/:id',Auth.all,Customer.getbyid)

//แก้ไขข้อมูลลูกค้า
router.put('/:id',Auth.all,Customer.edit)
//ลบข้อมูลลูกค้า
router.delete('/:id',Auth.employee,Customer.delete)



module.exports = router;