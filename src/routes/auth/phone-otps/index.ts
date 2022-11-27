import { Router, Request, Response, NextFunction } from "express";
import User from "../../../controllers/user/user.controller";
import {
  comparePasswords,
  generateOtp,
  getFutureTimeWithMinutes,
  hashString,
  signJWT,
} from "../../../helpers";
import Phone from "../../../helpers/lib-phone";
import Users from "../../../models/user.model";
import Otps from "../../../models/otp.model";
import { v4 } from "uuid";

const router: Router = Router();

router.use("/", (request: Request, response: Response, next: NextFunction) => {
  if (request?.user?.uid) {
    return response.status(400).send({
      status: "error",
      message: "You are already logged in",
      data: null,
    });
  }
  next();
});

router.post(
  "/get",
  async (
    request: Request<
      {},
      {},
      {
        phoneNumber: string;
      }
    >,
    response: Response
  ) => {
    const { phoneNumber } = request.body;
    let newNumber = phoneNumber;

    if (!phoneNumber) {
      return response.status(401).send({
        status: "error",
        message: "Phone number is required",
      });
    }
    const phone = new Phone();
    if (phoneNumber[0] !== "+") {
      newNumber = `+${phoneNumber}`;
    }
    if (!phone.isValid(phoneNumber)) {
      return response.status(400).send({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    }

    const internationalNumber = phone.getInternationNumber(phoneNumber);
    if (!internationalNumber) {
      return response.status(400).send({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    }

    const createAndSendOtp: any = async (user: any) => {
      //   const otp = generateOtp(6);
      //   const hashedOtp = hashString(otp);

      // using 123456 as otp for test
      const otp = "123456";
      const hashedOtp = hashString(otp);

      const Otp = new Otps({
        otp: hashedOtp,
        user: user._id,
        createdAt: new Date(),
        type: "globalSigninSignup",
        expiresAt: getFutureTimeWithMinutes(10),
      });

      await Otp.save();

      //send sms here when done!

      //
    };
    // search for user with the number in the db
    let potentialUser = await Users.findOne({
      phoneNumber: internationalNumber,
    });

    if (!potentialUser) {
      const user = new User();
      const newUser = await user.createUser({
        phoneNumber: internationalNumber,
      });

      //   const otp = generateOtp(6);
      //   const hashedOtp = hashString(otp);

      // using 123456 as code for test
      const otp = "123456";
      const hashedOtp = hashString(otp);

      const Otp = new Otps({
        otp: hashedOtp,
        user: newUser._id,
        createdAt: new Date(),
        type: "globalSigninSignup",
        expiresAt: getFutureTimeWithMinutes(10),
      });

      await Otp.save();

      //send sms here when done!

      //

      return response.status(201).send({
        status: "success",
        message: "Otp sent!",
      });
    }

    await Otps.deleteMany({
      phoneNumber: internationalNumber,
      type: "globalSigninSignup",
    });

    if (potentialUser.pauseOtpSend) {
      if (potentialUser.pauseOtpSendUntil > new Date()) {
        return response.status(400).send({
          status: "error",
          message: "OTP sending is paused",
          data: {
            retryIn: potentialUser.pauseOtpSendUntil,
          },
        });
      } else {
        await Users.updateOne(
          {
            uid: potentialUser.uid,
          },
          {
            $set: {
              pauseOtpSend: false,
              pauseOtpSendUntil: null,
              otpSendCount: 0,
            },
          }
        );
      }
    } else {
      if (potentialUser.otpSendCount >= 9) {
        await Users.updateOne(
          {
            uid: potentialUser.uid,
          },
          {
            $set: {
              pauseOtpSend: true,
              pauseOtpSendUntil: getFutureTimeWithMinutes(5),
            },
          }
        );
      } else {
        await Users.updateOne(
          {
            uid: potentialUser.uid,
          },
          {
            $inc: {
              otpSendCount: 1,
            },
          }
        );
      }
      //   const otp = generateOtp(6);
      //   const hashedOtp = hashString(otp);

      // using 123456 as code for test
      const otp = "123456";
      const hashedOtp = hashString(otp);

      const Otp = new Otps({
        otp: hashedOtp,
        user: potentialUser._id,
        createdAt: new Date(),
        type: "globalSigninSignup",
        expiresAt: getFutureTimeWithMinutes(10),
      });

      await Otp.save();

      //send sms here when done!

      //

      return response.status(201).send({
        status: "success",
        message: "Otp sent!",
      });
    }
  }
);

router.post(
  "/verify",
  async (
    request: Request<
      {},
      {},
      {
        phoneNumber: string;
        otp: string;
      }
    >,
    response: Response
  ) => {
    // if(!ph)
    const { phoneNumber, otp } = request.body;
    let newNumber = phoneNumber;

    if (!phoneNumber || !otp) {
      return response.status(400).send({
        status: "error",
        message: "Otp and phone number is required",
        data: null,
      });
    }

    const phone = new Phone();
    if (phoneNumber[0] !== "+") {
      newNumber = `+${phoneNumber}`;
    }
    if (!phone.isValid(phoneNumber)) {
      return response.status(400).send({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    }

    const internationalNumber = phone.getInternationNumber(phoneNumber);
    if (!internationalNumber) {
      return response.status(400).send({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    }

    let userDetails = await Users.findOne({
      phoneNumber: internationalNumber,
    });

    if (!userDetails) {
      return response.status(404).send({
        status: "error",
        message: "User not found",
      });
    }

    if (userDetails?.pauseOtpInput) {
      if (userDetails?.pauseOtpInputUntil > new Date()) {
        return response.status(429).send({
          status: "error",
          message: "input limit exceeded",
          data: {
            retryIn: userDetails?.pauseOtpInputUntil,
          },
        });
      } else {
        userDetails.pauseOtpInput = false;
        userDetails.pauseOtpInputUntil = new Date();
        userDetails.otpInputCount = 0;
        await userDetails.save();
      }
    }

    const otpDetails = await Otps.findOne({
      user: userDetails._id,
      type: "globalSigninSignup",
    });
    if (
      !otpDetails ||
      !comparePasswords(otp, otpDetails.otp) ||
      otpDetails.expiresAt < new Date()
    ) {
      if (userDetails?.otpInputCount >= 9) {
        userDetails.pauseOtpInput = true;
        userDetails.pauseOtpInputUntil = getFutureTimeWithMinutes(15);
        await userDetails.save();
      } else {
        userDetails.otpInputCount += 1;
        await userDetails.save();
      }

      return response.status(400).send({
        status: "error",
        message: "invalid or expired otp",
        data: null,
      });
    }
    let key;

    if (!userDetails.isPhoneVerified) {
      userDetails.isPhoneVerified = true;
    }
    if (!userDetails?.key) {
      key = v4();
      userDetails.key = key;
    } else {
      key = userDetails.key;
    }
    await userDetails.save();
    const jwt = await signJWT(
      {
        uid: userDetails.uid,
      },
      userDetails?.key
    );

    await Otps.deleteMany({
      user: userDetails._id,
    });
    return response.send({
      status: "success",
      data: {
        accessToken: jwt,
        refreshToken: null,
      },
    });
  }
);

export default router;
