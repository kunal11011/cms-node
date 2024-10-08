import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import AuthService from "./auth.service";

config();

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const reqBody = await JoiValidation.userSchema.validateAsync(req.body);

  //   const doesUserExist = await EmployeeSchema.findOne({
  //     email: reqBody.email,
  //   });

  //   if (doesUserExist) {
  //     throw createHttpError.Conflict(
  //       `${reqBody.email} is already been registered`
  //     );
  //   }

  //   const doesCompanyExist = await CompanySchema.findOne({
  //     email: reqBody.company.email,
  //   });

  //   if (doesCompanyExist) {
  //     throw createHttpError.Conflict(
  //       `${reqBody.company.email} is already been registered`
  //     );
  //   }

  //   const company = new CompanySchema(reqBody.company);

  //   const savedCompany = await company.save();
  //   delete reqBody.company;

  //   const user = new EmployeeSchema({
  //     ...reqBody,
  //     company: savedCompany._id,
  //     designation: "ADMIN",
  //   });
  //   const savedUser = await user.save();

  //   await CompanySchema.findByIdAndUpdate(
  //     savedCompany._id,
  //     { createdBy: savedUser._id },
  //     { new: true }
  //   );

  //   const payload = {
  //     id: savedUser.id,
  //     designation: savedUser.designation,
  //     company: savedUser.company,
  //   };

  //   const accessToken = await signAccessToken(payload, savedUser.id);
  //   const refreshToken = await signRefreshToken({}, savedUser.id);

  //   await sendMail(user.email);
  //   res.send({ accessToken, refreshToken });
  // } catch (error: any) {
  //   if (error.isJoi) {
  //     error.status = 422;
  //   }
  //   next(error);
  // }
  try {
    const response = await AuthService.signUp(req.body, next);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const result = await JoiValidation.userLoginSchema.validateAsync(req.body);

  //   const user = await EmployeeSchema.findOne({
  //     email: result.email,
  //   });
  //   if (!user) {
  //     throw createHttpError.NotFound("User not found");
  //   }

  //   const isMatch = await user.comparePassword(result.password);
  //   if (!isMatch) {
  //     throw createHttpError.Unauthorized("Invalid Email or Password");
  //   }

  //   const payload = {
  //     id: user.id,
  //     designation: user.designation,
  //     company: user.company,
  //   };

  //   const accessToken = await signAccessToken(payload, user.id);
  //   const refreshToken = await signRefreshToken({}, user.id);

  //   await sendMail(user.email);

  //   res.send({ accessToken, refreshToken });
  // } catch (error: any) {
  //   if (error.isJoi) {
  //     return next(createHttpError.BadRequest("Invalid Email or Password"));
  //   }
  //   next(error);
  // }
  try {
    const response = await AuthService.signIn(req.body, next);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const token = req.params.token;

  //   const payload: any = await new Promise((resolve, reject) => {
  //     JWT.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
  //       if (err) {
  //         const message =
  //           err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
  //         return next(createHttpError.Unauthorized(message));
  //       }
  //       resolve(decoded);
  //     });
  //   });

  //   if (payload.designation !== "ADMIN") {
  //     return next(createHttpError.Unauthorized("Unauthorized user"));
  //   }

  //   // Find user by ID
  //   const user = await EmployeeSchema.findById(payload.id);
  //   if (!user) {
  //     return next(createHttpError.NotFound("User not found"));
  //   }

  //   const result = await EmployeeSchema.findByIdAndUpdate(
  //     payload.id,
  //     { verified: true },
  //     { new: true }
  //   );

  //   res.json(result);

  //   // JWT.verify(token, ACCESS_TOKEN_SECRET, async (err, payload: any) => {
  //   //   if (err) {
  //   //     const message =
  //   //       err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
  //   //     return next(createHttpError.Unauthorized(message));
  //   //   }
  //   //   if (payload.designation !== "ADMIN") {
  //   //     throw createHttpError.Unauthorized("Unauthorized user");
  //   //   }

  //   //   const user = await EmployeeSchema.findById(payload?.id);
  //   //   if (!user) {
  //   //     throw createHttpError.NotFound("User not found");
  //   //   }
  //   //   const result = await EmployeeSchema.findByIdAndUpdate(
  //   //     payload?.id,
  //   //     { verified: true },
  //   //     { new: true }
  //   //   );
  //   //   res.json(result);
  //   // });
  // } catch (error: any) {
  //   next(error);
  // }
  try {
    const response = await AuthService.verifyAccount(req.params.token, next);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const onBoard = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { password, confirm_password } = req.body;
  //   if (
  //     !password ||
  //     !confirm_password ||
  //     password !== confirm_password ||
  //     !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  //   ) {
  //     throw createHttpError.BadRequest();
  //   }
  //   const token = req.params.token;

  //   const payload: any = await new Promise((resolve, reject) => {
  //     JWT.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
  //       if (err) {
  //         const message =
  //           err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
  //         return next(createHttpError.Unauthorized(message));
  //       }
  //       resolve(decoded);
  //     });
  //   });

  //   const user = await EmployeeSchema.findById(payload?.id);
  //   if (!user) {
  //     throw createHttpError.NotFound("User not found");
  //   }

  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const result = await EmployeeSchema.findByIdAndUpdate(
  //     user._id,
  //     { password: hashedPassword, verified: true },
  //     { new: true }
  //   );
  //   res.send({ result });

  //   // JWT.verify(token, ACCESS_TOKEN_SECRET, async (err, payload: any) => {
  //   //   if (err) {
  //   //     const message =
  //   //       err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
  //   //     return next(createHttpError.Unauthorized(message));
  //   //   }
  //   //   const user = await EmployeeSchema.findById(payload?.id);
  //   //   if (!user) {
  //   //     throw createHttpError.NotFound("User not found");
  //   //   }

  //   //   const salt = await bcrypt.genSalt(10);
  //   //   const hashedPassword = await bcrypt.hash(password, salt);
  //   //   const result = await EmployeeSchema.findByIdAndUpdate(
  //   //     user._id,
  //   //     { password: hashedPassword, verified: true },
  //   //     { new: true }
  //   //   );
  //   //   res.send({ result });
  //   // });
  // } catch (error: any) {
  //   next(error);
  // }

  try {
    const response = await AuthService.onBoard(
      req.body,
      req.params.token,
      next
    );
    res.send(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const refreshToken = req.headers["authorization"]?.split(" ")[1];
  //   if (!refreshToken) {
  //     throw createHttpError.Unauthorized();
  //   }
  //   const userId = await verifyRefreshToken(refreshToken);
  //   const user = await EmployeeSchema.findById(userId);

  //   if (!user) {
  //     throw createHttpError.NotFound("User not found");
  //   }

  //   const payload = {
  //     id: userId,
  //     designation: user.designation,
  //     company: user.company,
  //   };

  //   const accessToken = await signAccessToken(payload, userId);
  //   const refToken = await signRefreshToken({}, userId);

  //   res.send({ accessToken, refreshToken: refToken });
  // } catch (error: any) {
  //   next(error);
  // }
  try {
    const token = req.headers["authorization"]?.split(" ")[1] || "";
    const response = await AuthService.refreshToken(token, next);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  signIn,
  verifyAccount,
  onBoard,
  refreshToken,
};
