import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import Auth from "./auth";
import Maps from "./maps";
import User from "./user";
import Trip from "./trip";

const router: Router = Router();

/*/ handles all auth services like signup/login reset password /*/
router.use(
  "/auth",
  authMiddleware({
    allowUnauthorized: true,
  }),
  Auth
);

router.use("/maps", Maps);

// user handlers
router.use("/user", authMiddleware(), User);

router.use("/trip", Trip);

export default router;
