"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017", {
    dbName: process.env.DB_NAME,
})
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.log(error);
});
mongoose_1.default.connection.on("connected", () => {
    console.log("Mongoose connected to DB.");
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Mongoose disconnected.");
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    process.exit(0);
}));
