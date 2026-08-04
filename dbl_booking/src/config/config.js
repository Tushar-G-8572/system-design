import "dotenv/config";

if (
  !process.env.PORT ||
  !process.env.MONGO_URI ||
  !process.env.REDIS_HOST ||
  !process.env.REDIS_PORT ||
  !process.env.REDIS_PASSWORD
) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

export const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
