import { Schema, model, Document } from "mongoose";

export interface IDeposit extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  depositDetails: {
    transactionId: string;
    transactionStatus: string;
    transactionAmount: number;
    transactionDate: Date;
    transactionType: string;
    transactionCurrency: string;
    transactionFee: number;
    transactionRef: string;
    transactionRefId: string;
    transactionRefUrl: string;
    transactionRefMethod: string;
    transactionMethod: string;
  };
}

const deposit = new Schema<IDeposit>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  amount: {
    type:Number,
    required:true
  },
  status:{
    type: String,
    required:true,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  depositDetails:{
    transactionId:{
      type:String,
      required:true
    },
    transactionStatus:{
      type:String,
      required:true
    },
    transactionAmount: {
      type:Number,
      required:true
    },
    transactionDate: {
      type:Date,
      required:true
    },
    transactionType: {
      type:String,
      required:true
    },
    transactionCurrency: {
      type:String,
      required:true
    },
    transactionFee: {
      type:Number,
      required:true
    },
    transactionRef: {
      type:String,
      required:true
    },
    transactionRefId: {
      type:String,
      required:true
    },
    transactionRefUrl: {
      type:String,
      required:true
    },
    transactionRefMethod: {
      type:String,
      required:true
    },
    transactionMethod: {
      type:String,
      required:true
    },
  }

})