import { Request, Router, Response } from "express";
import {
  generateOtp,
  getFutureTimeWithMinutes,
  hashString,
} from "../../../../helpers";
import Otps, { otpTypes } from "../../../../models/otp.model";
import Users from "../../../../models/user.model";
import MailerInstance from "../../../../email/mail";
import EMAIL_TEMPLATES from "../../../../email";

// TODO delete all  uid: "be1da941-4508-499f-9ec4-3a9d09f470f1",

const router: Router = Router();

export interface IGetOTPPayload {
  type: string;
  email?: string;
  phoneNumber?: string;
}

router.post(
  "/",
  async (request: Request<{}, {}, IGetOTPPayload>, response: Response) => {
    const { type }: IGetOTPPayload = request.body;

    if (!type || !type.trim().length || type === "") {
      return response.status(400).send({
        status: "error",
        message: "Type is required",
        data: null,
      });
    }

    // check if the otp type is any of the allowed types
    if (!otpTypes.includes(type)) {
      return response.status(400).send({
        status: "error",
        message: "Invalid OTP type",
        data: null,
      });
    }

    let userDetails;
    if (!request.user) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
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
      // userDetails = await Users.findOne({
      //   uid: request.user.uid,
      // });

      if (!userDetails) {
        return response.status(404).send({
          status: "error",
          message: "User not found",
          data: null,
        });
      }

      if (
        (type === "verifyEmail" && userDetails.isEmailVerified) ||
        (type === "verifyPhone" && userDetails.isPhoneVerified) ||
        (type === "signupEmail" && userDetails.isEmailVerified) ||
        (type === "signupPhone" && userDetails.isPhoneVerified)
      ) {
        return response.status(400).send({
          status: "error",
          message: "User already verified",
          data: null,
        });
      }

      if (userDetails.pauseOtpSend) {
        if (userDetails.pauseOtpSendUntil > new Date()) {
          return response.status(400).send({
            status: "error",
            message: "OTP sending is paused",
            data: {
              retryIn: userDetails.pauseOtpSendUntil,
            },
          });
        } else {
          await Users.updateOne(
            {
              uid: request.user.uid,
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
        if (userDetails.otpSendCount >= 9) {
          await Users.updateOne(
            {
              uid: request.user.uid,
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
              uid: request.user.uid,
            },
            {
              $inc: {
                otpSendCount: 1,
              },
            }
          );
        }
      }
      if (request.body.type === "verifyEmail") {
        await Otps.deleteMany({
          $or: [
            {
              user: userDetails._id,
              type: request.body.type,
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

      const otp = generateOtp(6);
      const hashedOtp = hashString(otp);

      const Otp = new Otps({
        otp: hashedOtp,
        user: userDetails._id,
        createdAt: new Date(),
        type: request.body.type,
        expiresAt: getFutureTimeWithMinutes(10),
      });

      await Otp.save();

      const Mailer = new MailerInstance();

      // send otp to user
      if (request.body.type === "signupEmail") {
        Mailer.sendTemplatedEmail({
          recipients: [userDetails.email],
          template: EMAIL_TEMPLATES.CARGODEALER_WELCOME,
          templateData: {
            code: otp,
          },
        });

        return response.status(200).send({
          status: "success",
          message: "OTP sent to email",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }
  }
);

export default router;
