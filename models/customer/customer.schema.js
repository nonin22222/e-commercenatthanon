const mongoose = require("mongoose");
const Joi = require("joi");
// Define the schema for the HotelUser entity
const CustomerSchema = new mongoose.Schema(
  {
    username:{type:String,require:true,unique: true},
    password: {type: String, required: true},
    name:{type:String,required:true},
    addressdelivery:{type:[{
        name:{type:String,required:true},
        namedelivery:{type:String,required:true},
        telephone:{type:String,required:true},
        address:{type:String,required:true},
        tambon:{type:String,required:true},
        amphure:{type:String,required:true},
        province:{type:String,required:true},
        zipcode:{type:String,required:true},
    }],default:[]},
    
  },
  {timestamps: true}
);

const Customer = mongoose.model("customer", CustomerSchema);






module.exports = Customer;