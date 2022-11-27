import { Request, Router, Response } from "express";
import { Error } from "mongoose";
import isEmail from "validator/lib/isEmail";
import User from "../../../controllers/user/user.controller";
import Otps from "../../../models/otp.model";
import Phone from "../../../helpers/lib-phone";

import {
  generateOtp,
  getCurrentDateInSeconds,
  getFutureTimeWithMinutes,
  hashString,
  isEmpty,
  isValidName,
} from "../../../helpers";
import MailerInstance from "../../../email/mail";
import EMAIL_TEMPLATES from "../../../email";

const router: Router = Router();

export interface ISignupPayload {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  accountType?: string;
  phoneNumber: string;
}
router.post(
  "/",
  async (req: Request<{}, {}, ISignupPayload>, res: Response) => {
    let {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      accountType = "user",
    } = req.body;

    if (!firstname || !lastname || !email || !password || !phoneNumber) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
        data: null,
      });
    }

    firstname = firstname.replace(/\s+/g, " ").trim();
    lastname = lastname.replace(/\s+/g, " ").trim();

    if (isEmpty(firstname, lastname, email, password, phoneNumber)) {
      return res.status(400).send({
        status: "error",
        message: "Please fill all fields",
        data: null,
      });
    }

    const phone = new Phone();
    if (phoneNumber[0] !== "+") {
      phoneNumber = `+${phoneNumber}`;
    }

    if (!isEmail(email)) {
      return res.status(400).send({
        status: "error",
        message: "Please enter a valid email",
        data: null,
      });
    } else if (!phone.isValid(phoneNumber)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    } else if (!isValidName(firstname) || !isValidName(lastname)) {
      return res.status(400).send({
        status: "error",
        message: "Please enter a valid name",
        data: null,
      });
    } else if (password.length < 6) {
      return res.status(400).send({
        status: "error",
        message: "Password must be at least 6 characters",
        data: null,
      });
    }

    const user = new User();

    try {
      const getUser = await user.getUserByEmail(email);

      if (getUser) {
        return res.status(400).send({
          status: "error",
          message: "email already used",
          data: null,
        });
      }
    } catch {
      return res.status(500).send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }

    //check for valid account types
    if (
      accountType !== "admin" &&
      accountType !== "user" &&
      accountType !== "business"
    ) {
      return res.status(400).send({
        status: "error",
        message: "Invalid account type",
        data: null,
      });
    }

    try {
      const newUser = await user.createUser({
        firstname,
        lastname,
        email,
        password,
        phoneNumber,
        accountType,
      });

      const otp = generateOtp(6);
      const hashedOtp = hashString(otp);

      const Otp = new Otps({
        otp: hashedOtp,
        user: newUser._id,
        createdAt: new Date(),
        type: "signupEmail",
        expiresAt: getFutureTimeWithMinutes(10),
      });

      try {
        await Otp.save();
        const Mailer = new MailerInstance();
        Mailer.sendTemplatedEmail({
          recipients: [email],
          template: EMAIL_TEMPLATES.CARGODEALER_WELCOME,
          templateData: {
            code: otp,
          },
        });
        return res.status(201).send({
          status: "success",
          message: "User created successfully",
          data: null,
        });
      } catch (err) {
        return res.status(400).send({
          status: "error",
          message: "Something went wrong",
          data: null,
        });
      }
    } catch (err) {
      return res.status(400).send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }
  }
);

export default router;
