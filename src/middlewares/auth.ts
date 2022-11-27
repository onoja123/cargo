// middleware for auth
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJWT } from "../helpers";
import Users from "../models/user.model";

const authMiddleware = (params?: { allowUnauthorized?: boolean }) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;

    if (!authorization && params?.allowUnauthorized) return next();

    if (!authorization) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    // get token look for user and make sure its valid
    const decodedToken: any = await decodeJWT(token);

    if (!decodedToken && params?.allowUnauthorized) return next();

    if (!decodedToken) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    const { uid } = decodedToken.data as JwtPayload;

    if (!uid && params?.allowUnauthorized) return next();

    if (!uid) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    const user = await Users.findOne({
      uid,
    });

    if (!user && params?.allowUnauthorized) return next();

    if (!user) {
      return response.status(401).send({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    request.user = {
      uid: user.uid,
      email: user.email,
      _id: user._id,
      accountType: user.accountType,
      phoneNumber: user.phoneNumber,
    };
    return next();
  };
};

export default authMiddleware;
