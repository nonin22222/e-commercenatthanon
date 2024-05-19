const Customer = require('../../models/customer/customer.schema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//สร้างข้อมูลลูกค้า
exports.create = async (req, res) => {
    try {
        //เช็คว่ามี username ซ้ำกันหรือไม่
        const check = await Customer.findOne({username:req.body.username});
        if(check){
            return res.status(409).send({status:false,message:"มีชื่อผู้ใช้งานนี้แล้ว"});
        }
        const customer = new Customer({
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password, 8),
            name:req.body.name,
            addressdelivery:req.body.addressdelivery
        });
        const add = await customer.save();
        if (add) {
            return res.status(201).send({status:true,message:"สร้างข้อมูลลูกค้าสำเร็จ",data:add});
        }else{
            return res.status(400).send({status:false,message:"สร้างข้อมูลลูกค้าไม่สำเร็จ"});
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
//ดึงข้อมูลลูกค้าทั้งหมด
exports.getall = async (req, res) => {
    try {
        const customer = await Customer.find();
        if (!customer) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
        }
        return res.status(200).send({ status: true, data: customer });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ดึงข้อมูลลูกค้าตาม id
exports.getbyid = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
        }
        return res.status(200).send({ status: true, data: customer });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


//แก้ไขข้อมูลลูกค้า
exports.edit = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
        }
        if(customer.username != req.body.username)
        {
            const check = await Customer.findOne({username:req.body.username});
            if(check){
                return res.status(409).send({status:false,message:"มีชื่อผู้ใช้งานนี้แล้ว"});
            }
        }
        const edit = await Customer.findByIdAndUpdate(req.params.id, {
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password, 8),
            name:req.body.name,
            addressdelivery:req.body.addressdelivery
        }, { new: true });
        if (edit) {
            return res.status(200).send({ status: true, message: "แก้ไขข้อมูลลูกค้าสำเร็จ", data: edit });
        } else {
            return res.status(400).send({ status: false, message: "แก้ไขข้อมูลลูกค้าไม่สำเร็จ" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ลบข้อมูลลูกค้า
exports.delete = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
        }
        const del = await Customer.findByIdAndDelete(req.params.id);
        if (del) {
            return res.status(200).send({ status: true, message: "ลบข้อมูลลูกค้าสำเร็จ", data: del });
        } else {
            return res.status(400).send({ status: false, message: "ลบข้อมูลลูกค้าไม่สำเร็จ" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
