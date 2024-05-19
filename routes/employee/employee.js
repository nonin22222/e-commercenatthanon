const express = require('express');
const router = express.Router();
const Employee = require("../../controllers/employee/employee.controller")
const Auth = require("../../authentication/userAuth")
//สร้างข้อมูลผู้ใช้งาน
router.post('/',Employee.create)

//ดึงข้อมูลผู้ใช้งานทั้งหมด
router.get('/',Auth.employee,Employee.getall)

//ดึงข้อมูลผู้ใช้งานตาม id
router.get('/byid/:id',Auth.employee,Employee.getbyid)

//แก้ไขข้อมูลผู้ใช้งาน
router.put('/:id',Auth.employee,Employee.edit)

//ลบข้อมูลผู้ใช้งาน
router.delete('/:id',Auth.employee,Employee.delete)


module.exports = router;