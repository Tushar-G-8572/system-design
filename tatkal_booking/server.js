import { config } from "./src/config/env.config.js";
import redisClient from "./src/config/redis.config.js";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";
import { connectRabbitMQ } from "./src/config/rabbitMQ.config.js";

connectDB();
await connectRabbitMQ();

app.listen(config.PORT,()=>{
 console.log(`Server is running on port: ${config.PORT}`);
})