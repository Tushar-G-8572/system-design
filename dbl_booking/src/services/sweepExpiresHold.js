import Seat from "../models/seat.model";
import redisClient from "../config/redis.config";

export function startSweep(intervalMs = 5000) {
  setInterval(async () => {
    const heldSeats = await Seat.find({ status: "held" });
    for (const seat of heldSeats) {
      const key = `seat:hold:${seat._id}`;
      const stillHeld = await redisClient.exists(key);
      if (!stillHeld) {
        await Seat.findByIdAndUpdate(seat._id, {
          status: "available", heldBy: null, heldAt: null,
        });
        console.log(`Swept expired hold: seat ${seat._id} released`);
      }
    }
  }, intervalMs);
}