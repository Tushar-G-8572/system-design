import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
 userName:{
  type: String,
  required:true
 },
 balance:{
  type:Number,
  default:0,
  required:true
 },
},{
 timestamps:true
})

const accountModel = mongoose.model('account',accountSchema);
export default accountModel;