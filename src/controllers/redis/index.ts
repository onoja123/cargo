import Redis from "ioredis";
import { config } from "dotenv";

// const redisHost = process.env.REDIS_HOST || "";
// const redisPort = 11402;
// const redisPassword = process.env.REDIS_PASSWORD || "";

config();

const client = new Redis({
  // host: redisHost,
  // port: redisPort,
  // password: redisPassword,
});
client.on("connect", async () => {
  console.log("CONNECTED TO OUR REDIS INSTANCE ⚡⚡⚡⚡⚡⚡⚡⚡");
});
client.on("error", (err) => {
  console.log("ERROR CONNECTING TO REDIS ⚡⚡⚡⚡⚡⚡⚡⚡", err);
});

export default client;
