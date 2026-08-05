import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
 userId:{
  type:String,
  required:true
 },
 totalSeats:{
  type:Number,
  required: true
 }
})

const tripModel = mongoose.model('trip',tripSchema);

export default tripModel;