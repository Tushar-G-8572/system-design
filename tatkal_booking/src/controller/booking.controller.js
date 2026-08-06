import redisClient from "../config/redis.config.js";
import seatModel from "../model/seat.model.js";


export const confirmBooking = async (req, res) => {
  const { seatId } = req.params;
  const { userId, requestId } = req.body;

  try {
    const lockKey = `lock:seat:${seatId}`;
    const heldRequestId = await redisClient.get(lockKey);

    if (!heldRequestId || heldRequestId !== requestId) {
      return res.status(409).json({ success: false, message: "Hold expired or not yours" });
    }

    await redisClient.set(`seat:${seatId}`, `confirmed:${userId}`);
    await redisClient.del(lockKey);

    const seat = await seatModel.findByIdAndUpdate(
      seatId,
      { status: "confirmed", confirmedBy: userId },
      { new: true }
    );

    return res.status(200).json({ success: true, seat });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Error while confirming ticket" });
  }
};

export const getSeat = async (req, res) => {
    const { seatId } = req.params;
    console.log(seatId);
    try {
        const seat = await seatModel.findById(seatId);

        if (!seat) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }

        return res.status(200).json(seat);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};