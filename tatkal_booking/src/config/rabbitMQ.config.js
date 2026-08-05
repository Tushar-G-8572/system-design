import { config } from "./env.config.js";
import amqplib from 'amqplib'

export const QUEUE_NAME="tatal-booking"

let channel = null;

export async function connectRabbitMQ() {
  const connection = await amqplib.connect(config.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME,{durable:true});
  connection.on('error', (err) => console.error('RabbitMQ error:', err));
  connection.on('close', () => console.warn('RabbitMQ connection closed'));

  console.log('RabbitMQ connected, queue ready:', QUEUE_NAME);
  return channel;
}

export function getChannel(){
 if(!channel) throw new Error('RabbitMQ channel not initialized — call connectRabbitMQ() first');
 return channel;
}

