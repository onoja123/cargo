import express, { Express, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
//remove when waitlist is off
// import waitlist from "./routes/waitlist/addWaitList";
import routes from "./routes/";
import Mongoose from "./controllers/mongoose";
import redis from "./controllers/redis";
// import Mailer from "./email/mail";
// import EMAIL_TEMPLATES from "./email";
// import Mongoose from "./controllers/mongoose.controller";
// import Mailer from "./controllers/mailer/mailer";
// import EMAIL_TEMPLATES from "./email";
import client from "./services/google-map";

const server = (): void => {
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  /* helmet is used to hide sensitive headers from the api and also add other headers that will help the server run properly */
  app.use(helmet());
  app.disable("x-powered-by");

  /* compression is used to compress the response body */
  app.use(compression());

  /* cors is used to allow cross origin requests */
  app.use(cors());

  /* dotenv is used to load environment variables from a .env file */
  dotenv.config();

  /* added favicon */

  app.get("/", (_, res: Response) => {
    return res.status(200).send("cargo-dealers api is up and running 🚀");
  });

  app.get("/health", (_, res: Response) => {
    return res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1", routes);

  // app.use('api/v1/webhook', routes);

  //   app.use("/api", routes);

  const db = new Mongoose();
  db.connect()
    .then((e) => {
      console.log(e);
      const httpServer: any = app.listen(process.env.PORT, () => {
        console.log(`Server started on  http://localhost:${process.env.PORT}`);
        client;
      });

      httpServer.setTimeout = 605 * 1000; // 605 seconds

      /*
       * Ensure all inactive connections are terminated by the ALB,
       * by setting this a few seconds higher than the ALB idle timeout
       */
      httpServer.keepAliveTimeout = 605 * 1000; // 605 seconds
      httpServer.headersTimeout = 606 * 1000;
    })
    .catch((e) => {
      console.log(e);
    });
};

export default server;

// my house - ChIJMQjGL7SPOxARKGSIl-oglHI
