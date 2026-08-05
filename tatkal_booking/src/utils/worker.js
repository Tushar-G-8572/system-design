import { config } from "../config/env.config.js";
import { connectRabbitMQ,QUEUE_NAME } from "../config/rabbitMQ.config.js";
import redisClient from "../config/redis.config.js";
import seatModel from "../model/seat.model.js";
import { connectDB } from "../config/db.config.js";

async function startWorker() {
 const channel = await connectRabbitMQ();
 await connectDB();
 channel.prefetch(10);
 channel.consume(QUEUE_NAME,
  async(msg)=>{
  if(!msg) return;

  const data = JSON.parse(msg.content.toString());

  const {seatId,userId,requestId} = data;

  const result = await redisClient.reserveAndCheck(
   `seat:${seatId}`,
   userId,
   requestId,
   300
  );

  switch(result){
   case 1:
    console.log('Seat Reserver');
    await seatModel.findOneAndUpdate(
        {
            _id: seatId,
            status: "available"
        },
        {
            $set: {
                status: "held",
                holdBy: userId,
                holdAt: new Date()
            }
        },
        {
            new: true
        }
    );
    break;
   case 0:
    console.log('Already reserved');
    break;
    case -1:
     console.log("seat not found");
     break
  }

  channel.ack(msg);
 })
}

startWorker();