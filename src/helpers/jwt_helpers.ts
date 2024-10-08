import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";

config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";

// interface CustomRequest extends Request {
//   payload?: any; // Define your expected payload structure here
// }

const signAccessToken = (payload: any, userId: string) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
        issuer: "kunal",
        subject: userId,
      },
      (err, token) => {
        if (err) {
          return reject(createHttpError.InternalServerError());
        }
        resolve(token);
      }
    );
  });
};

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(createHttpError.Unauthorized());
  }
  const token = authHeader.split(" ")[1];
  // return new Promise((resolve, reject) => {
  JWT.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      // return reject(createHttpError.Unauthorized());
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createHttpError.Unauthorized(message));
    }
    // resolve(payload);
    req.body.payload = payload;
    next();
  });
  // });
};

const signRefreshToken = (payload: any, userId: string) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1y",
        issuer: "kunal",
        subject: userId,
      },
      (err, token) => {
        if (err) {
          return reject(createHttpError.InternalServerError());
        }
        resolve(token);
      }
    );
  });
};

const verifyRefreshToken = (token: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return reject(createHttpError.Unauthorized());
      }
      resolve(payload?.sub);
    });
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
