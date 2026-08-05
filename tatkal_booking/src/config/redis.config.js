import {config} from './env.config.js';
import redis from 'ioredis';
import fs from 'fs';
import {fileURLToPath} from 'url'
import path from 'path';


const redisClient = new redis({
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD || undefined,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

redisClient.defineCommand('reserveAndCheck',{
 numberOfKeys:1,
 lua: fs.readFileSync(path.resolve(__dirname,"../lua/reserveSeat.lua"),"utf-8")
})

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;