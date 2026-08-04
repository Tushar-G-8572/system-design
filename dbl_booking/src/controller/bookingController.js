import  Seat  from "../models/seat.model.js";
import redisClient from "../config/redis.config.js";

//  Stage -1 
export const bookSeat = async (req, res) => {
  const { seatId } = req.params;
  const { userId } = req.body;

  const seat = await Seat.findById(seatId);
  if (!seat) return res.status(404).json({ message: "Seat not found" });

  if (seat.status !== "available") {
    return res.status(409).json({ message: "Already taken" });
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  seat.status = "held";
  await seat.save();

  res.status(200).json({ message: "Booked", seatId, userId });
};


//  Stage -2
export const bookSeatAutomic = async (req, res) => {
  const { seatId } = req.params;
  const { userId } = req.body;

  try{
   const seat = await Seat.findOneAndUpdate(
    { _id: seatId, status: "available" },
    { $set: { status: "held" } },
    { new: true }
  );

   if (!seat) {
    return res.status(409).json({ message: "Already taken" });
  }

  res.status(200).json({ message: "Booked", seatId, userId });

  }catch(error){
    console.error("Error booking seat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Stage -3
const Hold_TTL_Seconds = 60

export const holdSeat = async (req, res) => {
  const { seatId } = req.params;
  const { userId } = req.body;
  // console.log("SeatId",seatId);
  // console.log("userID",userId);
  try{
   const key = `seat:hold:${seatId}`;
   const gotLock = await redisClient.set(key,userId,"NX","EX",Hold_TTL_Seconds);
    if (!gotLock) {
    return res.status(409).json({ message: "Seat already held by someone else" });
  }

   const seat = await Seat.findOneAndUpdate(
    {_id:seatId,status:"available"},
   {$set:{status:"held",heldBy:userId,heldAt:new Date()}},
   {new:true}
  );

   if (!seat) {
    // Redis said yes but Mongo said no (e.g. already confirmed earlier) — release the lock we just took
    await redisClient.del(key);
    return res.status(409).json({ message: "Seat not available" });
  }

  res.status(200).json({ message: `Seat held for ${Hold_TTL_Seconds}s`, seatId, userId });
  }catch(error){
    console.error("Error holding seat:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
 }

export const cancelSeat = async(req,res)=>{
 let {seatId} = req.params;
 const {userId} = req.body;
 const key = `seat:hold:${seatId}`;
try{
   const holder = await redisClient.get(key);
  if (holder === userId) await redis.del(key);

  await Seat.findOneAndUpdate(
    { _id: seatId, status: "held", heldBy: userId },
    { $set: { status: "available", heldBy: null, heldAt: null } }
  );

  res.status(200).json({ message: "Hold cancelled", seatId });

}catch(error){
 console.error("Error holding seat:", error);
    res.status(500).json({ message: "Internal server error" });
}
}

export const confirmSeat = async(req,res)=>{
 const {seatId} = req.params;
 const {userId} = req.body;
 const key = `seat:hold:${seatId}`;
 try{
  const holder = await redisClient.get(key);
  if(!holder) return res.status(401).json({message:"hold exprired, try again"})
  if (holder !== userId) return res.status(403).json({ message: "This isn't your hold" });

 await Seat.findOneAndUpdate({ _id: seatId, status: "held" }, { $set: { status: "confirmed" } });
 await redisClient.del(key)
 res.status(200).json({ message: "Booking confirmed", seatId });
 }catch(error){
  console.error("Error holding seat:", error);
  res.status(500).json({ message: "Internal server error" });
 }
}