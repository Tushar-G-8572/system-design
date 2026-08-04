import { config } from "./src/config/config.js";
import app from "./src/app.js";
import redisClient from "./src/config/redis.config.js";
import { dbConnection } from "./src/config/db.config.js";

dbConnection();

app.listen(config.PORT,()=>{
 console.log(`server is running on port ${config.PORT}`)
})