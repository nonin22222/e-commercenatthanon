const mongoose = require("mongoose");
const Joi = require("joi");
// Define the schema for the HotelUser entity
const EmployeeSchema = new mongoose.Schema(
  {
    username:{type:String,require:true,unique: true},
    password: {type: String, required: true},
    name:{type:String,required:true},
    position:{type:String,required:true},
  },
  {timestamps: true}
);

const Employee = mongoose.model("employee", EmployeeSchema);






module.exports = Employee;