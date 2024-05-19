const Order = require('../../models/order/order.schema');
const Cart = require('../../models/order/cart.schema');
const Product = require('../../models/product/product.schema');
const Customer = require('../../models/customer/customer.schema');

//สั่งออเดอร์
exports.addOrder = async (req, res) => {
    try{
        // ดึงข้อมูลมาจาก ตะกร้า ตัวเอง
        const {customer_id,sendaddress} = req.body;
        //เช็คข้อมูลลูกค้า
        const customer = await Customer.findOne({_id:customer_id});
        if(!customer){
            return res.status(400).send({status:false,message:"ไม่พบข้อมูลลูกค้า"});
        }
        //เช็คข้อมูลตะกร้าสินค้า
        const cart = await Cart.findOne({customer_id:customer_id});
        if(!cart){
            return res.status(400).send({status:false,message:"ไม่พบตะกร้าสินค้า"});
        }
        // ถ้ามีข้อมูลตะกร้าสินค้า ให้เช็คว่า สินค้ามีเพียงพอสั่งไหม
        cart.product.forEach(async (element) => {
            const product = await Product.findById(element.product_id);
            if(!product){
                return res.status(400).send({status:false,message:"ไม่พบสินค้า"});
            }
            if(product.product_qty<element.product_qty){
                return res.status(400).send({status:false,message:"สินค้าไม่พอ"});
            }
        });
        // ถ้าสินค้าพอให้สร้าง order 
        const shippcost = 0
        const order = new Order({
            product:cart.product,
            totalproduct:cart.totalproduct,
            shippcost:shippcost,
            total:cart.totalproduct+shippcost,
            sendaddress:sendaddress,
            orderstatus:"จัดเตรียมออเดอร์",
            employee_id:null,
            customer_id:customer_id
        });    
        const result = await order.save();
        //ให้ทำการตะกร้าทิ้ง
        const resultCart = await Cart.findByIdAndDelete(cart._id);
        if(result){
            return res.status(200).send({status:true,data:result,message:"สั่งออเดอร์สำเร็จ"});
        }else{
            return res.status(200).send({status:false,data:result,message:"สั่งออเดอร์ไม่สำเร็จ"});
        }

    }catch(error){
       return  res.status(500).send({status:false,message:error.message});
    }
}

//ดูออเดอร์ทั้งหมด
exports.getOrder = async (req, res) => {
    try{
        const order = await Order.find().populate('employee_id').populate('customer_id');
        if(order){
            return res.status(200).send({status:true,data:order});
        }else{
            return res.status(200).send({status:false,data:order,message:"ไม่พบข้อมูล"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }

}

 //ดูออเดอร์ตาม id
exports.getOrderById = async (req, res) => {
    try{
        
        const order = await Order.findById(req.params.id).populate('employee_id').populate('customer_id');
        if(order){
            return res.status(200).send({status:true,data:order});
        }
        else{
            return res.status(200).send({status:false,data:order,message:"ไม่พบข้อมูล"});
        }
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

//ดูออเดอร์ตาม ลูกค้า
exports.getOrderByCustomer = async (req, res) => {
    try{
      
        const order = await Order.find({customer_id:req.params.id}).populate('employee_id').populate('customer_id');
        if(order){
            return res.status(200).send({status:true,data:order});
        }else{
            return res.status(200).send({status:false,data:order,message:"ไม่พบข้อมูล"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

//ใส่เลข tracking
exports.addTracking = async (req, res) => {
    try{
        const order_id = req.params.id
        const {tracking} = req.body;
        
       
        const order = await Order.findByIdAndUpdate(order_id,{tracking:tracking,orderstatus:"จัดส่งออเดอร์แล้ว",},{new:true});
        if(order){
            return res.status(200).send({status:true,data:order,message:"เพิ่มเลข tracking สำเร็จ"});
        }else{
            return res.status(200).send({status:false,data:order,message:"เพิ่มเลข tracking ไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

// ลบ ออเดอร์
exports.deleteOrder = async (req, res) => {
    try{
        const {order_id} = req.params.id;
        const order = await Order.findByIdAndDelete(order_id);
        if(order){
            return res.status(200).send({status:true,data:order,message:"ลบข้อมูลสำเร็จ"});
        }else{
            return res.status(200).send({status:false,data:order,message:"ลบข้อมูลไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}