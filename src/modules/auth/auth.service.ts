import createHttpError from "http-errors";
import sendMail from "../../helpers/send_mail";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
const JoiValidation = require("../../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../helpers/jwt_helpers");
const EmployeeSchema = require("../employee/employee.model");
const CompanySchema = require("../company/company.model");

const signUp = async (reqBody: any, next: NextFunction) => {
  try {
    const validatedBody = await JoiValidation.userSchema.validateAsync(reqBody);

    const doesUserExist = await EmployeeSchema.findOne({
      email: validatedBody.email,
    });

    if (doesUserExist) {
      next(
        createHttpError.Conflict(
          `${validatedBody.email} is already been registered`
        )
      );
    }

    const doesCompanyExist = await CompanySchema.findOne({
      email: validatedBody.company.email,
    });

    if (doesCompanyExist) {
      next(
        createHttpError.Conflict(
          `${validatedBody.company.email} is already been registered`
        )
      );
    }

    const company = new CompanySchema(validatedBody.company);

    const savedCompany = await company.save();
    delete validatedBody.company;

    const user = new EmployeeSchema({
      ...validatedBody,
      company: savedCompany._id,
      designation: "ADMIN",
    });
    const savedUser = await user.save();

    await CompanySchema.findByIdAndUpdate(
      savedCompany._id,
      { createdBy: savedUser._id },
      { new: true }
    );

    const payload = {
      id: savedUser.id,
      designation: savedUser.designation,
      company: savedUser.company,
    };

    const accessToken = await signAccessToken(payload, savedUser.id);
    const refreshToken = await signRefreshToken({}, savedUser.id);

    await sendMail(user.email);
    return { accessToken, refreshToken };
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
      next({ message: error.message, status: error.status });
    }
    next(error);
  }
};

const signIn = async (reqBody: any, next: NextFunction) => {
  try {
    const validatedBody = await JoiValidation.userLoginSchema.validateAsync(
      reqBody
    );

    const user = await EmployeeSchema.findOne({
      email: validatedBody.email,
    });
    if (!user) {
      next(createHttpError.NotFound("User not found"));
    }

    const isMatch = await user.comparePassword(validatedBody.password);
    if (!isMatch) {
      next(createHttpError.Unauthorized("Invalid Email or Password"));
    }

    const payload = {
      id: user.id,
      designation: user.designation,
      company: user.company,
    };

    const accessToken = await signAccessToken(payload, user.id);
    const refreshToken = await signRefreshToken({}, user.id);

    return { accessToken, refreshToken };
  } catch (error: any) {
    if (error.isJoi) {
      next(createHttpError.BadRequest("Invalid Email or Password"));
    }
    next(error);
  }
};

const verifyAccount = async (token: string, next: NextFunction) => {
  try {
    const payload: any = await new Promise((resolve, reject) => {
      JWT.verify(token, ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          next(createHttpError.Unauthorized(message));
        }
        resolve(decoded);
      });
    });

    if (payload.designation !== "ADMIN") {
      next(createHttpError.Unauthorized("Unauthorized user"));
    }

    // Find user by ID
    const user = await EmployeeSchema.findById(payload.id);
    if (!user) {
      next(createHttpError.NotFound("User not found"));
    }

    const result = await EmployeeSchema.findByIdAndUpdate(
      payload.id,
      { verified: true },
      { new: true }
    );

    return result;
  } catch (error: any) {
    next(error);
  }
};

const onBoard = async (reqBody: any, token: string, next: NextFunction) => {
  try {
    const { password, confirm_password } = reqBody;
    if (
      !password ||
      !confirm_password ||
      password !== confirm_password ||
      !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    ) {
      next(createHttpError.BadRequest());
    }
    // const token = req.params.token;

    const payload: any = await new Promise((resolve, reject) => {
      JWT.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          next(createHttpError.Unauthorized(message));
        }
        resolve(decoded);
      });
    });

    const user = await EmployeeSchema.findById(payload?.id);
    if (!user) {
      next(createHttpError.NotFound("User not found"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await EmployeeSchema.findByIdAndUpdate(
      user._id,
      { password: hashedPassword, verified: true },
      { new: true }
    );
    return result;
  } catch (error: any) {
    next(error);
  }
};

const refreshToken = async (refreshToken: string, next: NextFunction) => {
  try {
    if (!refreshToken) {
      next(createHttpError.Unauthorized());
    }
    const userId = await verifyRefreshToken(refreshToken);

    const user = await EmployeeSchema.findById(userId);

    if (!user) {
      next(createHttpError.NotFound("User not found"));
    }

    const payload = {
      id: userId,
      designation: user.designation,
      company: user.company,
    };

    const accessToken = await signAccessToken(payload, userId);
    const refToken = await signRefreshToken({}, userId);

    return { accessToken, refreshToken: refToken };
  } catch (error: any) {

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
