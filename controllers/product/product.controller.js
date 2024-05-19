const Product = require('../../models/product/product.schema');

const multer = require("multer");
const {uploadFileCreate,deleteFile} = require("../../functions/uploadfilecreate");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
      //console.log(file.originalname);
    },
});

//เพิ่มสินค้า
 exports.addProduct = async (req, res) => {
    try{
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                    result.push(src);
                    //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }
                image = reqFiles[0]
            }
            // เพิ่มข้อมูลสินค้า
            const product = new Product({
                ...req.body,
                product_image: image,
            });
            const add = await product.save();
            if(add){
                return res.status(200).send({status:true,message:"เพิ่มสินค้าสำเร็จ"})
            }else{
                return res.status(200).send({status:false,message:"เพิ่มสินค้าไม่สำเร็จ"})
            }
             
        });

    }catch(err){
        return res.status(500).send({status:false,error:error.message});
    }
 }   
//ดึงข้อมูลสินค้าทั้งหมด
exports.getProduct = async (req, res) => {
    try{
        const product = await Product.find().populate('employee_id');
        return res.status(200).send({status:true,data:product})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

//ดึงข้อมูลสินค้าตาม id
exports.getProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate('employee_id');
        return res.status(200).send({status:true,data:product})
    }catch(err){
        return res.status(500).send({status:false,error:error.message});
    }
}

//แก้ไขข้อมูลสินค้า
exports.editProduct = async (req, res) => {
    try{
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
            const product = await Product.findById(req.params.id);
            if(!product){
                return res.status(404).send({status:false,message:"ไม่พบข้อมูล"})
            }
          
            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                if(product.product_image != '')
                {
                    await deleteFile(product.product_image)
                }
            
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                    result.push(src);
                    //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }
                image = reqFiles[0]
            }
            // เพิ่มข้อมูลสินค้า
            const edit = await Product.findByIdAndUpdate(req.params.id,{
                ...req.body,
                product_image: image !="" ? image : product.product_image,
            });
            if(product){
                return res.status(200).send({status:true,message:"แก้ไขสินค้าสำเร็จ"})
            }else{
                return res.status(200).send({status:false,message:"แก้ไขสินค้าไม่สำเร็จ"})
            }
             
        });

    }catch(err){
        return res.status(500).send({status:false,error:error.message});
    }
}

//ลบข้อมูลสินค้า

exports.deleteProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).send({status:false,message:"ไม่พบข้อมูล"})
        }
        if(product.product_image != ''){
           await deleteFile(product.product_image)
        }
        const del = await Product.findByIdAndDelete(req.params.id);
        if(del){
            return res.status(200).send({status:true,message:"ลบสินค้าสำเร็จ"})
        }else{
            return res.status(200).send({status:false,message:"ลบสินค้าไม่สำเร็จ"})
        }
    }catch(err){
        return res.status(500).send({status:false,error:error.message});
    }
}

//เปิดปิด สถานะสินค้า
exports.statusProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).send({status:false,message:"ไม่พบข้อมูล"})
        }
        const status = await Product.findByIdAndUpdate(req.params.id,{
            product_status: product.product_status
        });
        if(status){
            return res.status(200).send({status:true,message:"แก้ไขสถานะสินค้าสำเร็จ"})
        }else{
            return res.status(200).send({status:false,message:"แก้ไขสถานะสินค้าไม่สำเร็จ"})
        }

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}