import { Request, Router, Response, NextFunction } from "express";
import Users from "../../models/user.model";

const router: Router = Router();

router.use("/", (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !request.user.uid) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }
    next();
  });

//get rides

//get ride

//get ride requests

//get ride request

router.get("/profile", async (req: Request, res: Response) => {
    const userDetails = await Users.findOne({ uid: req.user.uid });
  
    if (!userDetails) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
  
    return res.status(200).send({
      status: "success",
      message: "Driver Details Fetched Successfully",
      data: {
        firstname: userDetails?.firstname,
        lastname: userDetails?.lastname,
        email: userDetails?.email,
        phoneNumber: userDetails?.phoneNumber,
        uid: userDetails?.uid,
        avatar: userDetails?.avatar,
        isEmailVerified: userDetails?.isEmailVerified,
        isPhoneNumberVerified: userDetails?.isPhoneVerified,
      },
    });
  });

router.post(":uid/update-profile", async (req: Request, res: Response) => {
    if (!req.user || !req.user.uid) {
      return res.status(401).send({
        status: "error",
        message: "Unauthorized",
      });
    }
  
    if (req.params.uid !== req.user.uid) {
      return res.status(401).send({
        status: "error",
        message: "Unauthorized",
      });
    }
    
    //TODO: Get Required Fields
    const updateFields = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    };
  
    const updatedUser = await Users.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: updateFields }
    );
  
    if (!updatedUser) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
  });

export default router;
