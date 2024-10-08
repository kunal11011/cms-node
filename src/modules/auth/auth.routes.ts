import { Router, Request, Response, NextFunction } from "express";
import AuthController from "./auth.controller";


const router = Router();

router.post("/sign-up", AuthController.signUp);

router.post("/sign-in", AuthController.signIn);

router.get("/verify-account/:token", AuthController.verifyAccount);

router.post("/on-board/:token", AuthController.onBoard);

router.get("/refresh-token", AuthController.refreshToken);

module.exports = router;
