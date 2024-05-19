const mongoose = require("mongoose");
const Joi = require("joi");
// Define the schema for the HotelUser entity
const ProductSchema = new mongoose.Schema(
  {
    employee_id:{type: mongoose.Schema.Types.ObjectId,ref:'employee',default:null},
    product_name: {type: String, required: true},
    product_image:{type:String,default:""},
    product_price:{type:Number,required:true},
    product_stock:{type:Number,required:true},
    product_detail:{type:String,required:true},
    product_status:{type:Boolean,required:true},
    
  },
  {timestamps: true}
);

const Product = mongoose.model("product", ProductSchema);






module.exports = Product;