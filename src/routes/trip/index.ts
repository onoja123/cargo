import { Request, Router, Response } from "express";
import authMiddleware from "../../middlewares/auth";
import GetDetails from "./get-details/index";

const router: Router = Router();

router.use(
  "/get-trip-estimates",
  authMiddleware({ allowUnauthorized: true }),
  GetDetails
);

export default router;
