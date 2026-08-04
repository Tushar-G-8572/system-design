import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
 tripId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Trip",
   required: true,
 },
 seatNumber: {
   type: String,
   required: true,
 },
 status: {
   type: String,
   enum: ["available", "held", "confirmed"],
   default: "available",
 },
 heldBy: { type: String, default: null },
 heldAt: { type: Date, default: null },
});

seatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;