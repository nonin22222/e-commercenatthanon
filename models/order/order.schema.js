const mongoose = require("mongoose");
const Joi = require("joi");
// Define the schema for the HotelUser entity
const OrderSchema = new mongoose.Schema(
  {
    product:{type:[{
        product_id:{type: mongoose.Schema.Types.ObjectId,ref:'product',default:null},
        product_name: {type: String, required: true},
        product_image:{type:String,default:""},
        product_price:{type:Number,required:true},
        product_qty:{type:Number,required:true},
        product_total:{type:Number,required:true},
    }],default:[]},
    totalproduct:{type:Number,required:true},
    shippcost:{type:Number,required:true},
    total:{type:Number,required:true},
    tracking:{type:String,default:""},
    sendaddress:{type:[{
        namedelivery:{type:String,required:true},
        telephone:{type:String,required:true},
        address:{type:String,required:true},
        tambon:{type:String,required:true},
        amphure:{type:String,required:true},
        province:{type:String,required:true},
        zipcode:{type:String,required:true},
    }],required:true},
    sendaddress:{type:[{
        namedelivery:{type:String,required:true},
        telephone:{type:String,required:true},
        address:{type:String,required:true},
        tambon:{type:String,required:true},
        amphure:{type:String,required:true},
        province:{type:String,required:true},
        zipcode:{type:String,required:true},
    }],required:true},
    orderstatus:{type:String,required:true},
    employee_id:{type: mongoose.Schema.Types.ObjectId,ref:'employee',default:null},
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',default:null},
  },
  {timestamps: true}
);

const Order = mongoose.model("order", OrderSchema);






module.exports =Order;