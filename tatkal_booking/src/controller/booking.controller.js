import redisClient from "../config/redis.config.js";
import seatModel from "../model/seat.model.js";


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