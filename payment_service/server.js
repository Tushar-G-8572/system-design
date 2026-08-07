import 'dotenv/config';
import app from './src/app.js'
import { connectDB } from './src/config/db.config.js';
import redisClient from './src/config/redis.config.js';

connectDB()

app.listen(process.env.PORT,()=>{
 console.log("Server is running on port:",process.env.PORT)
})