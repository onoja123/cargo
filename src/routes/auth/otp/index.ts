import { Request, Router, Response } from "express";
import verify from "./otp-verifications/";
import getOtp from "./get-otp/";

const router: Router = Router();

router.use("/verify", verify);
router.use("/get", getOtp);

export default router;
