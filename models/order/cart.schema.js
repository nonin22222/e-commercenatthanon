const mongoose = require("mongoose");
const Joi = require("joi");
// Define the schema for the HotelUser entity
const CartSchema = new mongoose.Schema(
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
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',default:null},
  },
  {timestamps: true}
);

const Cart = mongoose.model("cart", CartSchema);






module.exports = Cart;