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
const http_errors_1 = __importDefault(require("http-errors"));
const send_mail_1 = __importDefault(require("../../helpers/send_mail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
(0, dotenv_1.config)();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
const JoiValidation = require("../../helpers/validation_schema");
const { signAccessToken, signRefreshToken, verifyRefreshToken, } = require("../../helpers/jwt_helpers");
const EmployeeSchema = require("../employee/employee.model");
const CompanySchema = require("../company/company.model");
const signUp = (reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedBody = yield JoiValidation.userSchema.validateAsync(reqBody);
        const doesUserExist = yield EmployeeSchema.findOne({
            email: validatedBody.email,
        });
        if (doesUserExist) {
            next(http_errors_1.default.Conflict(`${validatedBody.email} is already been registered`));
        }
        const doesCompanyExist = yield CompanySchema.findOne({
            email: validatedBody.company.email,
        });
        if (doesCompanyExist) {
            next(http_errors_1.default.Conflict(`${validatedBody.company.email} is already been registered`));
        }
        const company = new CompanySchema(validatedBody.company);
        const savedCompany = yield company.save();
        delete validatedBody.company;
        const user = new EmployeeSchema(Object.assign(Object.assign({}, validatedBody), { company: savedCompany._id, designation: "ADMIN" }));
        const savedUser = yield user.save();
        yield CompanySchema.findByIdAndUpdate(savedCompany._id, { createdBy: savedUser._id }, { new: true });
        const payload = {
            id: savedUser.id,
            designation: savedUser.designation,
            company: savedUser.company,
        };
        const accessToken = yield signAccessToken(payload, savedUser.id);
        const refreshToken = yield signRefreshToken({}, savedUser.id);
        yield (0, send_mail_1.default)(user.email);
        return { accessToken, refreshToken };
    }
    catch (error) {
        if (error.isJoi) {
            error.status = 422;
            next({ message: error.message, status: error.status });
        }
        next(error);
    }
});
const signIn = (reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedBody = yield JoiValidation.userLoginSchema.validateAsync(reqBody);
        const user = yield EmployeeSchema.findOne({
            email: validatedBody.email,
        });
        if (!user) {
            next(http_errors_1.default.NotFound("User not found"));
        }
        const isMatch = yield user.comparePassword(validatedBody.password);
        if (!isMatch) {
            next(http_errors_1.default.Unauthorized("Invalid Email or Password"));
        }
        const payload = {
            id: user.id,
            designation: user.designation,
            company: user.company,
        };
        const accessToken = yield signAccessToken(payload, user.id);
        const refreshToken = yield signRefreshToken({}, user.id);
        return { accessToken, refreshToken };
    }
    catch (error) {
        if (error.isJoi) {
            next(http_errors_1.default.BadRequest("Invalid Email or Password"));
        }
        next(error);
    }
});
const verifyAccount = (token, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                    next(http_errors_1.default.Unauthorized(message));
                }
                resolve(decoded);
            });
        });
        if (payload.designation !== "ADMIN") {
            next(http_errors_1.default.Unauthorized("Unauthorized user"));
        }
        // Find user by ID
        const user = yield EmployeeSchema.findById(payload.id);
        if (!user) {
            next(http_errors_1.default.NotFound("User not found"));
        }
        const result = yield EmployeeSchema.findByIdAndUpdate(payload.id, { verified: true }, { new: true });
        return result;
    }
    catch (error) {
        next(error);
    }
});
const onBoard = (reqBody, token, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, confirm_password } = reqBody;
        if (!password ||
            !confirm_password ||
            password !== confirm_password ||
            !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            next(http_errors_1.default.BadRequest());
        }
        // const token = req.params.token;
        const payload = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                    next(http_errors_1.default.Unauthorized(message));
                }
                resolve(decoded);
            });
        });
        const user = yield EmployeeSchema.findById(payload === null || payload === void 0 ? void 0 : payload.id);
        if (!user) {
            next(http_errors_1.default.NotFound("User not found"));
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const result = yield EmployeeSchema.findByIdAndUpdate(user._id, { password: hashedPassword, verified: true }, { new: true });
        return result;
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (refreshToken, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!refreshToken) {
            next(http_errors_1.default.Unauthorized());
        }
        const userId = yield verifyRefreshToken(refreshToken);
        const user = yield EmployeeSchema.findById(userId);
        if (!user) {
            next(http_errors_1.default.NotFound("User not found"));
        }
        const payload = {
            id: userId,
            designation: user.designation,
            company: user.company,
        };
        const accessToken = yield signAccessToken(payload, userId);
        const refToken = yield signRefreshToken({}, userId);
        return { accessToken, refreshToken: refToken };
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    signUp,
    signIn,
    verifyAccount,
    onBoard,
    refreshToken,
};
