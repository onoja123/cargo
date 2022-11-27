import { Schema, model, Document } from "mongoose";

export interface ITrip extends Document {
  type: string;
  sender: Schema.Types.ObjectId;
  receiver: {
    name?: string;
    phone?: string;
    email?: string;
    id: Schema.Types.ObjectId;
  };
  dropOffCode: string;
  dropOffQRCode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  charge: number;
  completedAt: Date;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  routes:
    | Array<{
        lat: number;
        lng: number;
        address: string;
      }>
    | {
        lat: number;
        lng: number;
        address: string;
      };
  driver: Schema.Types.ObjectId;
}

export const tripTypes = ["pickup", "dropoff"];

export const tripStatus = ["pending", "accepted", "completed", "cancelled"];

const tripSchema = new Schema<ITrip>({
  type: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  receiver: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  dropOffCode: {
    type: String,
    required: true,
  },
  dropOffQRCode: {
    type: String,
    required: true,
  },
  pickupLocation: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  routes: {
    type: Array,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
});

export default model<ITrip>("Trips", tripSchema);
