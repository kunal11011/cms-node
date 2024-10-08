// logger.js
const winston = require("winston");
require("winston-mongodb");
require("dotenv").config();

const logger = winston.createLogger({
  //   level: "info",
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.metadata(),
    winston.format.prettyPrint()
    // winston.format.printf(({ timestamp, level, message }: any) => {
    //   return `${timestamp} ${level}: ${message}`;
    // })
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ level: "warn", filename: "logs/warn.log" }),
    new winston.transports.File({ level: "error", filename: "logs/error.log" }),
    new winston.transports.File({ level: "info", filename: "logs/info.log" }),
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      collection: "logs",
    }),
  ],
});

module.exports = logger;
