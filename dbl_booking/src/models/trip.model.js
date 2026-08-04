import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
 });

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;