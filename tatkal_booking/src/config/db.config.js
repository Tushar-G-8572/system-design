import { config } from './env.config.js'
import mongoose from 'mongoose'

export const connectDB = async()=>{
 try{
  await mongoose.connect(config.MONGO_URI);
  console.log("Connencted to DB")
 }catch(err){
  console.log(err);
  process.exit(1);
 }
}
