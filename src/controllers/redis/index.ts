import Redis from "ioredis";
import { config } from "dotenv";

const redisHost = process.env.REDIS_HOST || "";
const redisPort = 18866;
const redisPassword = "uLB6C1bOFFJVCyT3UWWkHz82AZFkjq9f" || "";

config();

const client = new Redis({
  host: "redis-18866.c89.us-east-1-3.ec2.cloud.redislabs.com",
  port: 18866,
  password: redisPassword,
});
client.on("connect", async () => {
  console.log("CONNECTED TO OUR REDIS INSTANCE ⚡⚡⚡⚡⚡⚡⚡⚡");
});
client.on("error", (err) => {
  console.log("ERROR CONNECTING TO REDIS ⚡⚡⚡⚡⚡⚡⚡⚡", err);
});

export default client;
