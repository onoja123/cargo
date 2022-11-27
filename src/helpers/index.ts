import crypto from "crypto";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import moment from "moment";

export const isEmpty = (...args: string[]): boolean => {
  let push: boolean = false;
  args.every((e: string) => {
    if (!e || e.trim() === "") push = true;
    return false;
  });
  return push;
};

export const isValidUsername = (val: string): boolean => {
  const usernameRegex = /^[a-z0-9_.]+$/;
  return usernameRegex.test(val);
};

export const hashString = (itemToHash: string): string => {
  const salt = genSaltSync(10);
  const hash = hashSync(itemToHash, salt);
  return hash;
};

export const getFutureTimeWithMinutes = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60000);
};

export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const getCurrentDateInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const comparePasswords = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const secondsToDate = (seconds: number, format?: string): string => {
  return moment.unix(seconds).format(format || "dddd MMMM Do YYYY, h:mm:ss a");
};

export const generateOtp = (length: number): string => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

export const isValidName = (name: string): boolean => {
  // const nameRegex = /^[a-zA-Z ]+$/;
  return /^[a-z ,.'-]+$/i.test(name);
};

export const signJWT = (payload: any, secret: string) => {
  return jwt.sign(
    {
      data: payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    secret
  );
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token);
};
