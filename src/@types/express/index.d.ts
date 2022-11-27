import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user: {
        uid: string;
        email: string;
        accountType: string;
        phoneNumber: string;
        _id: string;
      };
    }
  }
}
