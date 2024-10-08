// const express = require("express");

import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import { config } from "dotenv";
import { stat } from "fs";
const winston = require("winston");
const expressWinston = require("express-winston");
const logger = require("./logger");
require("./helpers/init_mongodb");

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./modules/auth/auth.routes");
const employeeRoutes = require("./modules/employee/employee.routes");
const companyRoutes = require("./modules/company/company.routes");
const { verifyAccessToken } = require("./helpers/jwt_helpers");

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: true,
    statusLevels: true,
  })
);

// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello Kunal");
// });

app.use("/api", authRoutes);
app.use("/api/employee", verifyAccessToken, employeeRoutes);
app.use("/api/company", verifyAccessToken, companyRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

const customLogFormat = winston.format.printf(
  ({ timestamp, level, meta }: any) => {
    return `${timestamp} ${level}: ${meta.message}`;
  }
);

app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.File({ filename: "logs/internalErrors.log" }),
    ],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.timestamp(),
      customLogFormat
      // winston.format.colorize(),
      // winston.format.simple()
    ),
  })
);

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.trace(err);
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};

app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 3000;
const server: Server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
