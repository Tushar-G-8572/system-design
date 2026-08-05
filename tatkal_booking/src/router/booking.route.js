import { Router } from "express";
import { QUEUE_NAME,getChannel } from "../config/rabbitMQ.config.js";
import {v4 as uuid} from 'uuid';
import { getSeat } from "../controller/booking.controller.js";

const router = Router();

router.post('/booking/seat/:seatId',async(req,res)=>{
 const {seatId} = req.params;
 const {userId} = req.body;
 const requestId = uuid();

 const message = {requestId,seatId,userId,status:'queued',timeStamps: Date.now()};

 getChannel().sendToQueue(
  QUEUE_NAME,
  Buffer.from(JSON.stringify(message)),
  {persistent:true}
 )

 res.status(202).json({ requestId, status: 'queued' });

})

router.get('/seat/:seatId',getSeat);

export default router;