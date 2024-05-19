const jwt = require('jsonwebtoken');



const employee = async(req, res, next)=>{
    try{
        let token = req.headers["token"]
        //เช็ค token
        if(token == "" || token == null || token == undefined){
            return res.status(403).send({status:false,message:'กรุณากรอก token'});
        }
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค if ว่า 6ตัวแรก มีคำว่า Bearer ไหม
        if (token.startsWith("Bearer ")) {
            token = token.replace(/^Bearer\s+/, "");
            // ทำการยืนยันสิทธิ์ token
            const decoded =  jwt.verify(token,secretKey)
            
            if(decoded.row ==="employee"){

                req.users = decoded.data
                next();
            }else{
                return res.status(403).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
            }
        }else{
            return res.status(403).send({status:false,message:'token ไม่ถูกต้องตามรบบ '})
        }
        
    }catch (err){
        return res.status(500).send({error:err.message})
    }
}

const customer = async(req, res, next)=>{ 
    try{

        let token = req.headers["token"]
        //เช็ค token
        if(token == "" || token == null || token == undefined){
            return res.status(403).send({status:false,message:'กรุณากรอก token'});
        }
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค if ว่า 6ตัวแรก มีคำว่า Bearer ไหม
        if (token.startsWith("Bearer ")) {
            token = token.replace(/^Bearer\s+/, "");
            // ทำการยืนยันสิทธิ์ token
            const decoded =  jwt.verify(token,secretKey)
            if(decoded.row ==="customer"){
                req.users = decoded.data
                next();
            }else{
                return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
            }
        }else{
            return res.status(403).send({status:false,message:'token ไม่ถูกต้องตามรบบ '})
        }
        
    }catch (err){
        return res.status(500).send({error:err.message})
    }
}


const all = async (req,res,next) => {
    try{
        let token = req.headers["token"]
        //เช็ค token
         if(token == "" || token == null || token == undefined){
            return res.status(403).send({status:false,message:'กรุณากรอก token'});
        }
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค if ว่า 6ตัวแรก มีคำว่า Bearer ไหม
        if (token.startsWith("Bearer ")) {
            token = token.replace(/^Bearer\s+/, "");
            // ทำการยืนยันสิทธิ์ token
                const decoded =  jwt.verify(token,secretKey)
                req.users = decoded.data
                next()    
        }else{
            return res.status(403).send({status:false,message:'token ไม่ถูกต้องตามระบบ '})
        }     
    }catch (err){
        return res.status(500).send({error:err.message})
    }
}

const authuser = {
    employee,
    customer,
    all
};

module.exports = authuser;