"use strict";
// const express = require("express");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = require("dotenv");
const winston = require("winston");
const expressWinston = require("express-winston");
const logger = require("./logger");
require("./helpers/init_mongodb");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const authRoutes = require("./modules/auth/auth.routes");
const employeeRoutes = require("./modules/employee/employee.routes");
const companyRoutes = require("./modules/company/company.routes");
const { verifyAccessToken } = require("./helpers/jwt_helpers");
app.use(expressWinston.logger({
    winstonInstance: logger,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: true,
    statusLevels: true,
}));
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello Kunal");
// });
app.use("/api", authRoutes);
app.use("/api/employee", verifyAccessToken, employeeRoutes);
app.use("/api/company", verifyAccessToken, companyRoutes);
app.use((req, res, next) => {
    next(new http_errors_1.default.NotFound());
});
const customLogFormat = winston.format.printf(({ timestamp, level, meta }) => {
    return `${timestamp} ${level}: ${meta.message}`;
});
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({ filename: "logs/internalErrors.log" }),
    ],
    format: winston.format.combine(winston.format.json(), winston.format.timestamp(), customLogFormat
    // winston.format.colorize(),
    // winston.format.simple()
    ),
}));
const errorHandler = (err, req, res, next) => {
    // console.trace(err);
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use(errorHandler);
const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
