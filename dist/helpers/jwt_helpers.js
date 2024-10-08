"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";
// interface CustomRequest extends Request {
//   payload?: any; // Define your expected payload structure here
// }
const signAccessToken = (payload, userId) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: "30m",
            issuer: "kunal",
            subject: userId,
        }, (err, token) => {
            if (err) {
                return reject(http_errors_1.default.InternalServerError());
            }
            resolve(token);
        });
    });
};
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next(http_errors_1.default.Unauthorized());
    }
    const token = authHeader.split(" ")[1];
    // return new Promise((resolve, reject) => {
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            // return reject(createHttpError.Unauthorized());
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(http_errors_1.default.Unauthorized(message));
        }
        // resolve(payload);
        req.body.payload = payload;
        next();
    });
    // });
};
const signRefreshToken = (payload, userId) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: "1y",
            issuer: "kunal",
            subject: userId,
        }, (err, token) => {
            if (err) {
                return reject(http_errors_1.default.InternalServerError());
            }
            resolve(token);
        });
    });
};
const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(http_errors_1.default.Unauthorized());
            }
            resolve(payload === null || payload === void 0 ? void 0 : payload.sub);
        });
    });
};
module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
