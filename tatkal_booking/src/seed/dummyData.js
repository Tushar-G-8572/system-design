import mongoose from "mongoose";
import seatModel from "../model/seat.model.js";
import tripModel from "../model/trip.model.js";
import redisClient from "../config/redis.config.js";

const url = "mongodb://127.0.0.1:27017/tatkal_booking";

async function seedDummyData() {

    await mongoose.connect(url);

    try {

        const trip = await tripModel.create({
            userId: "user123",
            totalSeats: 10
        });

        const seats = Array.from({ length: 10 }, (_, i) => ({
            tripId: trip._id,
            seatNumber: `A${i + 1}`
        }));

        const insertedSeats = await seatModel.insertMany(seats);

        // Seed Redis
        for (const seat of insertedSeats) {

            await redisClient.set(
                `seat:${seat._id}`,
                "available"
            );

        }

        console.log("Mongo + Redis seeded successfully");

        process.exit(0);

    } catch (err) {

        console.log(err);

        process.exit(1);

    }

}

seedDummyData();