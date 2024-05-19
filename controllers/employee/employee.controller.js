const Employee = require('../../models/employee/employee.schema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//สร้างข้อมูลผู้ใช้งาน
exports.create = async (req, res) => {
    try {
        //เช็คว่ามี username ซ้ำกันหรือไม่
        const check = await Employee.findOne({username:req.body.username});
        if(check){
            return res.status(409).send({status:false,message:"มีชื่อผู้ใช้งานนี้แล้ว"});
        }

        const employee = new Employee({
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password, 8),
            name:req.body.name,
            position:req.body.position
        
        });
        const add = await employee.save();
        if (add) {
            return res.status(201).send({status:true,message:"สร้างข้อมูลผู้ใช้งานสำเร็จ",data:add});
        }else{
            return res.status(400).send({status:false,message:"สร้างข้อมูลผู้ใช้งานไม่สำเร็จ"});
        }
        
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

//ดึงข้อมูลผู้ใช้งานทั้งหมด
exports.getall = async (req, res) => {
    try {
        const employee = await Employee.find();
        if (!employee) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลผู้ใช้งาน" });
        }
        return res.status(200).send({ status: true, data: employee });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

//ดึงข้อมูลผู้ใช้งานตาม id
exports.getbyid = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลผู้ใช้งาน" });
        }
        return res.status(200).send({ status: true, data: employee });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

//แก้ไขข้อมูลผู้ใช้งาน
exports.edit = async (req, res) => {
    try {
        
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลผู้ใช้งาน" });
        }
        //เช็คว่ามี username ซ้ำกันหรือไม่
        if(employee.username != req.body.username){
            const check = await Employee.findOne({username:req.body.username});
            if(check){
                return res.status(400).send({status:false,message:"มีชื่อผู้ใช้งานนี้แล้ว"});
            }
        }
        const data ={
            username:req.body.username,
            password: req.body.password != undefined && req.body.password != ""? bcrypt.hashSync(req.body.password, 10): employee.password,
            name:req.body.name,
            position:req.body.position
        }
        const edit = await Employee.findByIdAndUpdate(req.params.id,data,{new:true});
        if(!edit){
            return res.status(400).send({status:false,message:"แก้ไขข้อมูลผู้ใช้งานไม่สำเร็จ"});
        }
        return res.status(201).send({ status: true, message: "แก้ไขข้อมูลผู้ใช้งานสำเร็จ", data: edit });
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ลบข้อมูลผู้ใช้งาน
exports.delete = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลผู้ใช้งาน" });
        }
        return res.status(200).send({ status: true, message: "ลบข้อมูลผู้ใช้งานสำเร็จ" });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}