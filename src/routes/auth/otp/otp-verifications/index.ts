import { Request, Router, Response } from "express";
import {
  comparePasswords,
  getFutureTimeWithMinutes,
  hashString,
} from "../../../../helpers";
import Otps, { otpTypes } from "../../../../models/otp.model";
import Users from "../../../../models/user.model";

const router: Router = Router();

export interface IOTPVerifyPayload {
  otp: string;
  type: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
}

router.post(
  "/",
  async (request: Request<{}, {}, IOTPVerifyPayload>, response: Response) => {
    const { otp, type }: IOTPVerifyPayload = request.body;

    let userDetails;
    if (!request.user) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    if (!otp || !otp.trim().length || otp === "") {
      return response.status(400).send({
        status: "error",
        message: "OTP is required",
        data: null,
      });
    } else if (!type || !type.trim().length || type === "") {
      return response.status(400).send({
        status: "error",
        message: "Type is required",
        data: null,
      });
    } else if (!otpTypes.includes(type)) {
      return response.status(400).send({
        status: "error",
        message: "Invalid OTP type",
        data: null,
      });
    }

    if (type === "forgotPassword") {
      if (
        !request.body?.email ||
        !request.body?.password ||
        !request.body?.passwordRepeat
      ) {
        return response.status(400).send({
          status: "error",
          message: "Please fill out all fields",
          data: null,
        });
      } else if (request.body?.password !== request.body?.passwordRepeat) {
        return response.status(400).send({
          status: "error",
          message: "Both passwords dont match",
          data: null,
        });
      } else if (request.body?.password.length < 6) {
        return response.status(400).send({
          status: "error",
          message: "Password must not be less than 6 characters",
          data: null,
        });
      }
    }

    try {
      if (request.body.type === "forgotPassword") {
        userDetails = await Users.findOne({
          $or: [
            {
              email: request.body.email,
            },
          ],
        });
      } else {
        userDetails = await Users.findOne({
          uid: request.user.uid,
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

      if (!userDetails) {
        return response.status(400).send({
          status: "error",
          message: "User not found",
          data: null,
        });
      }
    } catch {
      return response.status(500).send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }

    try {
      let otpDetails;
      if (request.body.type === "verifyEmail") {
        otpDetails = await Otps.findOne({
          $or: [
            {
              user: userDetails._id,
              type: "verifyEmail",
            },
            {
              user: userDetails._id,
              type: "signupEmail",
            },
          ],
        });
      } else {
        otpDetails = await Otps.findOne({
          user: userDetails._id,
          type: request.body.type,
        });
      }

      if (!otpDetails) {
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
      } else {
        if (
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
        } else {
          if (
            otpDetails?.type === "verifyEmail" ||
            otpDetails?.type === "signupEmail"
          ) {
            userDetails.isEmailVerified = true;
            userDetails.otpInputCount = 0;
          } else if (otpDetails?.type === "verifyPhone") {
            userDetails.isPhoneVerified = true;
            userDetails.otpInputCount = 0;
          } else if (otpDetails?.type === "forgotPassword") {
            const newUserHashedPwd = request?.body?.password || "";
            userDetails.password = hashString(newUserHashedPwd);
          }
          await userDetails.save();

          if (request.body.type === "verifyEmail") {
            await Otps.deleteMany({
              $or: [
                {
                  user: userDetails._id,
                  type: "verifyEmail",
                },
                {
                  user: userDetails._id,
                  type: "signupEmail",
                },
              ],
            });
          } else {
            await Otps.deleteMany({
              user: userDetails._id,
              type: request.body.type,
            });
          }
          return response.status(200).send({
            status: "success",
            message: "OTP verified successfully",
            data: null,
          });
        }
      }
    } catch {
      return response.status(500).send({
        status: "error",
        message: "unable to verify otp",
        data: null,
      });
    }
  }
);

export default router;
