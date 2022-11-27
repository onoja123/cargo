import { Request, Router, Response } from "express";
import signup from "./signup";
import otp from "./otp";
import phoneOTPs from "./phone-otps/index";
import authMiddleware from "../../middlewares/auth";
const router: Router = Router();

// router.use("/signup", signup);
// router.use("/otp", otp);

router.use("/phone-one-time-password", phoneOTPs);

export default router;
