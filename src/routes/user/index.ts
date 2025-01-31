import { Request, Router, Response, application, NextFunction } from "express";
import Users from "../../models/user.model";
import Trips, { tripStatus } from "../../models/trip.model";

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

router.get("/get-profile", async (req: Request, res: Response) => {
  const userDetails = await Users.findOne({ uid: req.user.uid });

  if (!userDetails) {
    return res.status(404).send({
      status: "error",
      message: "User not found",
    });
  }

  return res.status(200).send({
    status: "success",
    message: "User details fetched successfully",
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

  // const { firstname, lastname, email, phoneNumber } = req.body;

  //update individual fields
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

// router.post(":uid/upload-avatar",)

router.get("/get-trips", async (req: Request, res: Response) => {
  let { page, limit, status } = req.query;

  // tripStatus
  // if (!status || !tripStatus.includes(status))

  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "20";
  }

  const trips = await Trips.find({
    sender: req.user._id,
  })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("driver", "firstname lastname avatar");

  const totalTrips = await Trips.countDocuments({
    sender: req.user._id,
  });

  return res.status(200).send({
    status: "success",
    message: "Trips fetched successfully",
    data: {
      trips,
      totalTrips,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTrips / Number(limit)),
    },
  });
});

export default router;
