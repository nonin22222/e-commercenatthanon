const Cart = require('../../models/order/cart.schema');
const Customer = require('../../models/customer/customer.schema');
const Product = require('../../models/product/product.schema');

//เพิ่มสินค้าในตะกร้า
exports.addCart = async (req, res) => {
    try{
        const {product_id,quantity,customer_id} = req.body;
        const product = await Product.findById(product_id);
        if(!product){
            return res.status(404).send({status:false,message:"ไม่พบสินค้า"});
        }
        // เช็คสินค้าพอสั่งไหม
        if(product.product_qty<quantity){
            return res.status(404).send({status:false,message:"สินค้าไม่พอ"});
        }
        const customer = await Customer.findById(customer_id);
        if(!customer){
            return res.status(404).send({status:false,message:"ไม่พบลูกค้า"});
        }
        //ถ้ามีตะกร้าอยู่แล้วให้เพิ่มที่เดิม ถ้าไม่มีให้สร้างใหม่
        const check = await Cart.findOne({customer_id:customer_id});
        if(check){
            //ใน check มี product นี้อยู่หรือเปล่า
            const productCheck = check.product.find((item)=>item.product_id==product_id);
            if(productCheck){
                // มีสินค้านี้อยู่แล้ว คำนวณราคารวม ของ totalproduct ใหม่

                const edit = await Cart.findOneAndUpdate({customer_id:customer_id,"product.product_id":product_id},{
                    $set:{
                        "product.$.product_qty":productCheck.product_qty+quantity,
                        "product.$.product_total":(productCheck.product_qty+quantity)*product.product_price
                    },$inc:{totalproduct:quantity*product.product_price}
                },{new:true});
                if(edit){
                    return res.status(200).send({status:true,data:edit,message:"เพิ่มสินค้าในตะกร้าสำเร็จ"});
                }else{
                    return res.status(200).send({status:false,data:edit,message:"เพิ่มสินค้าในตะกร้าไม่สำเร็จ"});
                }
            }else{
                // ไม่มีสินค้านี้อยู่
                const add = await Cart.findOneAndUpdate({customer_id:customer_id},{
                    $push:{
                        product:{
                            product_id:product_id,
                            product_name:product.product_name,
                            product_image:product.product_image,
                            product_price:product.product_price,
                            product_qty:quantity,
                            product_total:quantity*product.product_price
                        }
                    },$inc:{totalproduct:quantity*product.product_price}
                },{new:true});
                if(add){
                    return res.status(200).send({status:true,data:add,message:"เพิ่มสินค้าในตะกร้าสำเร็จ"});
                }
                else{
                    return res.status(200).send({status:false,data:add,message:"เพิ่มสินค้าในตะกร้าไม่สำเร็จ"});
                }

            }
            
        }else{
            //สร้างตะกร้าใหม่
            const newCart = new Cart({
                product:[{
                    product_id:product_id,
                    product_name:product.product_name,
                    product_image:product?.product_image,
                    product_price:product.product_price,
                    product_qty:quantity,
                    product_total:quantity*product.product_price
                }],
                totalproduct:quantity*product.product_price,
                customer_id:customer_id
            });
            const save = await newCart.save();
            if(save){
                return res.status(200).send({status:true,data:save,message:"เพิ่มสินค้าในตะกร้าสำเร็จ"});
            }else{
                return res.status(200).send({status:false,data:save,message:"เพิ่มสินค้าในตะกร้าไม่สำเร็จ"});
            }
        }
    }catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// ลดจำนวนสินค้าในตะกร้า
exports.reduceCart = async (req, res) => {
    try{
        const {product_id,quantity,customer_id} = req.body;
        const product = await Product.findById(product_id);
        if(!product){
            return res.status(404).send({status:false,message:"ไม่พบสินค้า"});
        }
        const customer = await Customer.findById(customer_id);
        if(!customer){
            return res.status(404).send({status:false,message:"ไม่พบลูกค้า"});
        }
        //ถ้ามีตะกร้าอยู่แล้วให้เพิ่มที่เดิม ถ้าไม่มีให้สร้างใหม่
        const check = await Cart.findOne({customer_id:customer_id});
        if(check){
            //ใน check มี product นี้อยู่หรือเปล่า
            const productCheck = check.product.find((item)=>item.product_id==product_id);
            if(productCheck){
                // มีสินค้านี้อยู่แล้ว คำนวณราคารวม ของ totalproduct ใหม่
                if(productCheck.product_qty-quantity >0){
                    const edit = await Cart.findOneAndUpdate({customer_id:customer_id,"product.product_id":product_id},{
                        $set:{
                            "product.$.product_qty":productCheck.product_qty-quantity,
                            "product.$.product_total":(productCheck.product_qty-quantity)*product.product_price
                        },$inc:{totalproduct:-quantity*product.product_price}
                    },{new:true});
                    if(edit){
                        return res.status(200).send({status:true,data:edit,message:"ลดจำนวนสินค้าในตะกร้าสำเร็จ"});
                    }else{
                        return res.status(200).send({status:false,data:edit,message:"ลดจำนวนสินค้าในตะกร้าไม่สำเร็จ"});
                    }
                }else{
                    //ถ้าจำนวนสินค้าเหลือ 0 ให้ลบสินค้าออก
                    const remove = await Cart.findOneAndUpdate({customer_id:customer_id},{
                        $pull:{product:{product_id:product_id}},
                        $inc:{totalproduct:-(productCheck.product_qty*product.product_price)}
                    },{new:true});
                    if(remove){
                        return res.status(200).send({status:true,data:remove,message:"ลดจำนวนสินค้าในตะกร้าสำเร็จ"});
                    }else{
                        return res.status(200).send({status:false,data:remove,message:"ลดจำนวนสินค้าในตะกร้าไม่สำเร็จ"});
                    }
                }
            }else{
                return res.status(404).send({status:false,message:"ไม่พบสินค้า"});
            }
        }
    }catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
// ลบสินค้าในตะกร้า
exports.deleteCart = async (req, res) => {
    try{
        const {product_id,customer_id} = req.body;
        const product = await Product.findById(product_id);
        if(!product){
            return res.status(404).send({status:false,message:"ไม่พบสินค้า"});
        }
        const customer = await Customer.findById(customer_id);
        if(!customer){
            return res.status(404).send({status:false,message:"ไม่พบลูกค้า"});
        }
        //ถ้ามีตะกร้าอยู่แล้วให้เพิ่มที่เดิม ถ้าไม่มีให้สร้างใหม่
        const check = await Cart.findOne({customer_id:customer_id});
        if(check){
            //ใน check มี product นี้อยู่หรือเปล่า
            const productCheck = check.product.find((item)=>item.product_id==product_id);
            if(productCheck){
                // มีสินค้านี้อยู่แล้ว คำนวณราคารวม ของ totalproduct ใหม่
               
                const remove = await Cart.findOneAndUpdate({customer_id:customer_id},{
                    $pull:{product:{product_id:product_id}},
                    $inc:{totalproduct:-(productCheck.product_qty*productCheck.product_price)}
                },{new:true});
                if(remove){
                    return res.status(200).send({status:true,data:remove,message:"ลบสินค้าในตะกร้าสำเร็จ"});
                }else{
                    return res.status(200).send({status:false,data:remove,message:"ลบสินค้าในตะกร้าไม่สำเร็จ"});
                }
            }else{
                return res.status(404).send({status:false,message:"ไม่พบสินค้า"});
            }
        }
    }catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}