import { Schema, model, Document } from "mongoose";
import { v4 } from "uuid";

// import { Schema, model, Document, Model } from "mongoose";

// export interface IUserWaitList extends Document {
//   email: string;
//   createdAt: Date;
// }

// const waitlistSchema = new Schema<IUserWaitList>({
//   email: {
//     type: String,
//   },
// });

// export default model<IUserWaitList>("waitlist", waitlistSchema);

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  uid: string;
  email: string;
  password: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isVerifed: boolean;
  accountType: string;
  kycStatus: string;
  createdAt: Date;
  otpSendCount: number;
  otpInputCount: number;
  pauseOtpSend: boolean;
  pauseOtpSendUntil: Date;
  pauseOtpInput: boolean;
  pauseOtpInputUntil: Date;
  avatar: string;
  key: string;
}

enum accountType {
  admin = "admin",
  user = "user",
  business = "business",
}

enum kycStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

const User = new Schema<IUser>({
  avatar: {
    type: String,
    default: "",
  },
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  uid: {
    type: String,
    required: true,
    default: v4(),
    unique: true,
  },
  email: {
    type: String,
  },
  password: {},
  phoneNumber: {},
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
  accountType: {
    type: String,
    enum: Object.values(accountType),
    default: accountType.user,
  },
  kycStatus: {
    type: String,
    enum: Object.values(kycStatus),
    default: kycStatus.pending,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otpSendCount: {
    type: Number,
    default: 0,
  },
  otpInputCount: {
    type: Number,
    default: 0,
  },
  pauseOtpSend: {
    type: Boolean,
    default: false,
  },
  pauseOtpSendUntil: {
    type: Date,
    default: null,
  },
  pauseOtpInput: {
    type: Boolean,
    default: false,
  },
  pauseOtpInputUntil: {
    type: Date,
    default: null,
  },
  key: {
    type: String,
    default: v4(),
  },
});

export default model<IUser>("Users", User);
