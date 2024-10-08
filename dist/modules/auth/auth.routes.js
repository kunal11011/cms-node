"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = (0, express_1.Router)();
router.post("/sign-up", auth_controller_1.default.signUp);
router.post("/sign-in", auth_controller_1.default.signIn);
router.get("/verify-account/:token", auth_controller_1.default.verifyAccount);
router.post("/on-board/:token", auth_controller_1.default.onBoard);
router.get("/refresh-token", auth_controller_1.default.refreshToken);
module.exports = router;
