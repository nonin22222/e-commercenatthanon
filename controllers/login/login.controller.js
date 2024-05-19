const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Employee = require("../../models/employee/employee.schema")
const Customer = require("../../models/customer/customer.schema")
////ล็อค หลังบ้าน (admin,partner,partner)
module.exports.login = async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.username ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอกusername" })
        }
        if(req.body.password === undefined || req.body.password ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก password" })
        }
        const username = req.body.username
        const password = req.body.password
        
        //เช็คว่า user นี้มีในระบบไหม
        const employee = await Employee.findOne({username:username})
        const customer = await Customer.findOne({username:username})
        let bcryptpassword
       
        if(employee)
        {
            bcryptpassword = await bcrypt.compare(password,employee.password)
            if(bcryptpassword)
            {
                const payload = {
                    _id:employee._id,
                    username:employee.username,
                    name : employee.name,
                    row:"employee",
                    position:employee.position
                }
                const secretKey = process.env.SECRET_KEY
                const token = jwt.sign(payload,secretKey,{expiresIn:"10D"})
                return res.status(200).send({ status: true, data: payload, token: token})
            }else{
                return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
            }
        }else if (customer)
        {
            bcryptpassword = await bcrypt.compare(password,customer.password)
            if(bcryptpassword)
            {
                const payload = {
                    _id:customer._id,
                    username:customer.username,
                    name : customer.name,
                    row:"customer",
                }
                const secretKey = process.env.SECRET_KEY
                const token = jwt.sign(payload,secretKey,{expiresIn:"10D"})
                return res.status(200).send({ status: true, data: payload, token: token})
            }else{
                return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
            }
        }else{
            return res.status(404).send({ status: false, message: "ไม่มีไอดีนี้อยู่ในระบบ" })
        }


      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      } 
}
// get me
module.exports.getme = async (req,res) =>{
    try {  

        let token = req.headers['token'];
        if(!token){
            return res.status(403).send({status:false,message:'Not authorized'});
        }
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค if ว่า 6ตัวแรก มีคำว่า Bearer ไหม
        if (token.startsWith("Bearer ")) {
            token = token.replace(/^Bearer\s+/, "");
            // ทำการยืนยันสิทธิ์ token
            const decodded =jwt.verify(token,secretKey)
            const dataResponse ={
            _id:decodded._id,
            username:decodded.username,
            name:decodded.name,
            row:decodded.row,
            position:decodded.position
            }
            return res.status(200).send({status:true,data:dataResponse});
        }else{
            return res.status(403).send({status:false,message:'token ไม่ถูกต้องตามรบบ '})
        }
    } catch (error) {
          
          return res.status(500).send({status:false,error:error.message});
    }
}


//logout
module.exports.logout = async (req,res) =>{
    try {
        
        
        return res.status(200).send({status:true,message:"logout success"})
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

