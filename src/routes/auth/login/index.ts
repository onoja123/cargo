import { Request, Router, Response } from "express";

const router: Router = Router();

router.get(
  "/",
  (
    request: Request<
      {},
      {},
      {
        email: string;
        password: string;
      }
    >,
    response: Response
  ) => {
    if (request.user) {
      return response.send({
        status: "error",
        message: "User already logged in",
        data: null,
      });
    }
  }
);

export default router;
