import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
 tripId:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'trip',
  required:true
 },
 seatNumber:{
  type: String,
  required:true
 },
 status:{
  type: String,
  enum: ["available", "held", "confirmed"],
  default: "available"
 },
 holdBy:{type:String, default:null},
 holdAt:{type:Date, default:null },
 confirmedBy:{type:String, default:null}
},{
 timestamps:true,
})

seatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

const seatModel = new mongoose.model('seat',seatSchema);
export default seatModel