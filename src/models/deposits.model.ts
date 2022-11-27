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
